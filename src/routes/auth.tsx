import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { backupMyProfile } from "@/lib/backup.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | هوية" },
      { name: "description", content: "سجّل دخولك أو أنشئ حسابًا في هوية لمتابعة طلباتك السابقة." },
      { property: "og:title", content: "تسجيل الدخول | هوية" },
      { property: "og:description", content: "حساب هوية: طلباتك وبياناتك في مكان واحد." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const runBackup = useServerFn(backupMyProfile);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          void runBackup().catch(() => undefined);
          toast.success("تم إنشاء حسابك");
          navigate({ to: "/account" });
        } else {
          toast.success("تم إنشاء الحساب، تحقق من بريدك لتفعيله");
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("أهلًا بعودتك");
        navigate({ to: "/account" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(
        message.includes("Invalid login")
          ? "البريد أو كلمة المرور غير صحيحة"
          : message.includes("already registered")
            ? "هذا البريد مسجّل مسبقًا"
            : message.toLowerCase().includes("weak") || message.includes("pwned")
              ? "كلمة المرور ضعيفة، اختر كلمة أقوى"
              : message.includes("6 characters")
                ? "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"
                : message,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-hawiya max-w-md py-16 lg:py-24">
      <h1 className="font-display text-4xl">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        حسابك في هوية يحفظ طلباتك السابقة وتفاصيل التوصيل.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {mode === "signup" && (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="الاسم الكامل"
            className="w-full rounded-[16px] border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary"
          />
        )}
        <input
          required
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          className="w-full rounded-[16px] border border-border bg-card px-4 py-3.5 text-right text-sm outline-none focus:border-primary"
        />
        <input
          required
          type="password"
          minLength={6}
          dir="ltr"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          className="w-full rounded-[16px] border border-border bg-card px-4 py-3.5 text-right text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-[16px] bg-primary px-6 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
        >
          {busy ? "لحظة…" : mode === "login" ? "دخول" : "إنشاء الحساب"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="mt-5 text-sm text-primary underline-offset-4 hover:underline"
      >
        {mode === "login" ? "ما عندك حساب؟ أنشئ حسابًا جديدًا" : "عندك حساب؟ سجّل الدخول"}
      </button>

      <div className="mt-8">
        <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">
          ← العودة إلى المتجر
        </Link>
      </div>
    </section>
  );
}
