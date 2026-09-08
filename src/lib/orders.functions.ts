import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itemSchema = z.object({
  product_id: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  unit_price: z.number().min(0).max(100000),
  qty: z.number().int().min(1).max(999),
});

const createOrderSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().min(1).max(40),
  area: z.string().min(1).max(120),
  address: z.string().min(1).max(400),
  shipping: z.number().min(0).max(1000),
  items: z.array(itemSchema).min(1).max(60),
});

export const getMyAccount = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const [{ data: profile }, { data: roles }, { data: orders }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone, area, address").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase
        .from("orders")
        .select(
          "id, order_number, status, total, subtotal, shipping, created_at, full_name, phone, area, address, order_items(id, title, qty, unit_price)",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

    return {
      profile: profile ?? null,
      roles: (roles ?? []).map((r) => r.role as string),
      orders: orders ?? [],
    };
  });

const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(120),
  phone: z.string().max(40).optional().default(""),
  area: z.string().max(120).optional().default(""),
  address: z.string().max(400).optional().default(""),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateProfileSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone,
        area: data.area,
        address: data.address,
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => createOrderSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const subtotal = data.items.reduce((s, i) => s + i.unit_price * i.qty, 0);
    const total = subtotal + data.shipping;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        full_name: data.full_name,
        phone: data.phone,
        area: data.area,
        address: data.address,
        subtotal,
        shipping: data.shipping,
        total,
        status: "pending",
      })
      .select("id, order_number")
      .single();

    if (error || !order) throw new Error(error?.message ?? "تعذّر إنشاء الطلب");

    const { error: itemsError } = await supabase.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        product_id: i.product_id,
        title: i.title,
        unit_price: i.unit_price,
        qty: i.qty,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    // نسخة احتياطية في MongoDB — لا تؤثر على الطلب إذا فشلت
    try {
      const { mirrorOrderToMongo } = await import("./backup.server");
      await mirrorOrderToMongo({
        orderId: order.id,
        orderNumber: order.order_number,
        userId,
        fullName: data.full_name,
        phone: data.phone,
        area: data.area,
        address: data.address,
        subtotal,
        shipping: data.shipping,
        total,
        status: "pending",
        items: data.items.map((i) => ({
          productId: i.product_id,
          title: i.title,
          unitPrice: i.unit_price,
          qty: i.qty,
        })),
      });
    } catch (backupError) {
      console.error("MongoDB backup failed:", backupError);
    }

    return { orderNumber: order.order_number, total };
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roleList = (roles ?? []).map((r) => r.role as string);
    if (!roleList.includes("manager") && !roleList.includes("technical")) {
      throw new Error("Forbidden");
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, total, subtotal, shipping, created_at, full_name, phone, area, address, user_id, order_items(id, title, qty, unit_price)",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((orders ?? []).map((o) => o.user_id)));
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", userIds)
      : { data: [] as { id: string; full_name: string | null; email: string | null }[] };

    const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

    return {
      roles: roleList,
      orders: (orders ?? []).map((o) => ({
        ...o,
        customer: byId.get(o.user_id) ?? null,
      })),
      totals: {
        count: (orders ?? []).length,
        revenue: (orders ?? []).reduce((s, o) => s + Number(o.total), 0),
      },
    };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orderId: z.string().uuid(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.orderId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
