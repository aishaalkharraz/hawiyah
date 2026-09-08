import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { formatKWD } from "@/data/products";
import { getMyAccount, updateMyProfile } from "@/lib/orders.functions";
import { orderStatusLabels } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Divider } from "@/components/Ornament";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "حسابي | هوية" },
      { name: "description", content: "بياناتك ومشترياتك السابقة من هوية في مكان واحد." },
      { property: "og:title", content: "حسابي | هوية" },
      { property: "og:description", content: "تابع طلباتك السابقة وحالتها من حسابك في هوية." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const fetchAccount = useServerFn(getMyAccount);
  const saveProfile = useServerFn(updateMyProfile);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState<{
    full_name: string;
    phone: string;
    area: string;
    address: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: () => fetchAccount(),
  });

  const mutation = useMutation({
    mutationFn: (values: { full_name: string; phone: string; area: string; address: string }) =>
      saveProfile({ data: values }),
    onSuccess: () => {
      toast.success("تم حفظ بياناتك");
      queryClient.invalidateQueries({ queryKey: ["account"] });
    },
    onError: () => toast.error("تعذّر الحفظ، حاول مرة أخرى"),
  });

  const isStaff =
    !!data?.roles.includes("manager") || !!data?.roles.includes("technical");
  const current = form ?? {
    full_name: data?.profile?.full_name ?? "",
    phone: data?.profile?.phone ?? "",
    area: data?.profile?.area ?? "",
    address: data?.profile?.address ?? "",
  };
  const setField = (key: "full_name" | "phone" | "area" | "address") => (value: string) =>
    setForm({ ...current, [key]: value });

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/" });
  };

  return (
    <section className="container-hawiya py-12 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl lg:text-5xl">حسابي</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            بياناتك الشخصية ومشترياتك السابقة من هوية.
          </p>
        </div>
        <div className="flex gap-2">
          {isStaff && (
            <Link
              to="/dashboard"
              className="rounded-[16px] border border-border px-5 py-3 text-sm transition-colors hover:bg-secondary/50"
            >
              لوحة الإدارة
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="rounded-[16px] border border-border px-5 py-3 text-sm transition-colors hover:bg-secondary/50"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <Divider />

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="h-fit rounded-[24px] border border-border bg-card p-6">
          <h2 className="text-xl">بياناتي</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (current.full_name.trim()) {
                mutation.mutate({ ...current, full_name: current.full_name.trim() });
              }
            }}
            className="mt-5 space-y-3"
          >
            <label className="block text-xs text-muted-foreground">الاسم</label>
            <input
              value={current.full_name}
              onChange={(e) => setField("full_name")(e.target.value)}
              placeholder="الاسم الكامل"
              className="w-full rounded-[16px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <label className="block text-xs text-muted-foreground">رقم الجوال</label>
            <input
              dir="ltr"
              value={current.phone}
              onChange={(e) => setField("phone")(e.target.value)}
              placeholder="+965 XXXX XXXX"
              className="w-full rounded-[16px] border border-border bg-background px-4 py-3 text-right text-sm outline-none focus:border-primary"
            />
            <label className="block text-xs text-muted-foreground">المنطقة</label>
            <input
              value={current.area}
              onChange={(e) => setField("area")(e.target.value)}
              placeholder="مثال: السالمية"
              className="w-full rounded-[16px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <label className="block text-xs text-muted-foreground">العنوان</label>
            <input
              value={current.address}
              onChange={(e) => setField("address")(e.target.value)}
              placeholder="القطعة، الشارع، رقم المنزل"
              className="w-full rounded-[16px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <label className="block text-xs text-muted-foreground">البريد الإلكتروني</label>
            <input
              dir="ltr"
              readOnly
              value={data?.profile?.email ?? ""}
              className="w-full rounded-[16px] border border-border bg-secondary/40 px-4 py-3 text-right text-sm text-muted-foreground outline-none"
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-[16px] bg-primary px-5 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              حفظ التعديلات
            </button>
          </form>
        </aside>

        <div>
          <h2 className="text-xl">المشتريات السابقة</h2>
          {isLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">جارٍ التحميل…</p>
          ) : !data?.orders.length ? (
            <div className="mt-6 rounded-[24px] border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">ما عندك طلبات سابقة بعد.</p>
              <Link
                to="/shop"
                className="mt-5 inline-block rounded-[16px] bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                ابدأ التسوق
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {data.orders.map((order) => (
                <li key={order.id} className="rounded-[24px] border border-border bg-card p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
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
                    </div>
                    <span className="rounded-full bg-secondary/60 px-4 py-1.5 text-xs">
                      {orderStatusLabels[order.status] ?? order.status}
                    </span>
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

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                    <span className="text-muted-foreground">الإجمالي</span>
                    <span className="text-base text-primary">{formatKWD(Number(order.total))}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
