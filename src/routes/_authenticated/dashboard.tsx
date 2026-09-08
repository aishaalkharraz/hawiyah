import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { formatKWD } from "@/data/products";
import { getDashboard, updateOrderStatus } from "@/lib/orders.functions";
import { orderStatusLabels } from "@/hooks/useAuth";
import { Divider } from "@/components/Ornament";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | هوية" },
      { name: "description", content: "متابعة المبيعات والطلبات وحالتها في هوية." },
      { property: "og:title", content: "لوحة الإدارة | هوية" },
      { property: "og:description", content: "كل الطلبات والمبيعات في مكان واحد." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const fetchDashboard = useServerFn(getDashboard);
  const setStatus = useServerFn(updateOrderStatus);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (vars: { orderId: string; status: (typeof statuses)[number] }) =>
      setStatus({ data: vars }),
    onSuccess: () => {
      toast.success("تم تحديث حالة الطلب");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => toast.error("تعذّر تحديث الحالة"),
  });

  if (error) {
    return (
      <section className="container-hawiya max-w-xl py-24 text-center">
        <h1 className="font-display text-4xl">صفحة مخصّصة للإدارة</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          هذه اللوحة متاحة لفريق الإدارة والدعم الفني فقط.
        </p>
        <Link
          to="/account"
          className="mt-8 inline-block rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          العودة إلى حسابي
        </Link>
      </section>
    );
  }

  return (
    <section className="container-hawiya py-12 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl lg:text-5xl">لوحة الإدارة</h1>
          <p className="mt-3 text-sm text-muted-foreground">كل الطلبات والمبيعات وحالة كل طلب.</p>
        </div>
        <Link
          to="/account"
          className="rounded-[16px] border border-border px-5 py-3 text-sm transition-colors hover:bg-secondary/50"
        >
          حسابي
        </Link>
      </div>

      <Divider />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground">إجمالي المبيعات</p>
          <p className="mt-2 font-display text-3xl text-primary">
            {formatKWD(data?.totals.revenue ?? 0)}
          </p>
        </div>
        <div className="rounded-[24px] border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground">عدد الطلبات</p>
          <p className="mt-2 font-display text-3xl">{data?.totals.count ?? 0}</p>
        </div>
        <div className="rounded-[24px] border border-border bg-card p-6">
          <p className="text-xs text-muted-foreground">صلاحيتك</p>
          <p className="mt-2 text-lg">
            {data?.roles.includes("technical") ? "الدعم الفني" : "مدير"}
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-xl">الطلبات</h2>
      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
      ) : !data?.orders.length ? (
        <p className="mt-6 text-sm text-muted-foreground">لا توجد طلبات بعد.</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {data.orders.map((order) => (
            <li key={order.id} className="rounded-[24px] border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm">
                    رقم الطلب: <span dir="ltr">{order.order_number}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("ar-KW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-3 text-sm">
                    العميل: {order.customer?.full_name || order.full_name || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {order.customer?.email ?? ""}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.phone} — {order.area} — {order.address}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-base text-primary">{formatKWD(Number(order.total))}</p>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      mutation.mutate({
                        orderId: order.id,
                        status: e.target.value as (typeof statuses)[number],
                      })
                    }
                    className="mt-3 rounded-[16px] border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {orderStatusLabels[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <ul className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4">
                    <span>
                      {item.title} × {item.qty}
                    </span>
                    <span className="text-primary">
                      {formatKWD(Number(item.unit_price) * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
