import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ينسخ بيانات حساب المستخدم الحالي إلى MongoDB (نسخة احتياطية)
export const backupMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .maybeSingle();

    try {
      const { mirrorUserToMongo } = await import("./backup.server");
      await mirrorUserToMongo({
        userId,
        fullName: profile?.full_name ?? "",
        email: profile?.email ?? "",
      });
    } catch (error) {
      console.error("MongoDB user backup failed:", error);
    }
    return { ok: true };
  });
