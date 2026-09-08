import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | هوية" },
      { name: "description", content: "تواصل مع فريق هوية للاستفسارات، الطلبات الخاصة، والتعاون." },
      { property: "og:title", content: "تواصل معنا | هوية" },
      { property: "og:description", content: "نسعد بالرد على استفساراتك خلال يوم عمل." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <section className="container-hawiya grid gap-12 py-12 lg:grid-cols-2 lg:py-20">
      <div>
        <h1 className="font-display text-4xl lg:text-5xl">تواصل معنا</h1>
        <p className="mt-4 max-w-md text-sm leading-8 text-muted-foreground">
          لأي استفسار عن الطلبات أو الهدايا المؤسسية، اكتب لنا وسنعود إليك خلال يوم عمل.
        </p>
        <div className="mt-8 space-y-2 text-sm">
          <p>البريد: hello@hawiya.co</p>
          <p>الكويت — العاصمة</p>
          <p>من الأحد إلى الخميس، ١٠ص – ٦م</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.email) return;
          setForm({ name: "", email: "", message: "" });
          toast("تم إرسال رسالتك، شكرًا لك");
        }}
        className="space-y-4 rounded-[24px] border border-border bg-card p-6 lg:p-8"
      >
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="الاسم"
          className="w-full rounded-[16px] border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="البريد الإلكتروني"
          className="w-full rounded-[16px] border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
        />
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="رسالتك"
          rows={5}
          className="w-full resize-none rounded-[16px] border border-border bg-background px-4 py-3.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="w-full rounded-[16px] bg-primary px-6 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          إرسال
        </button>
      </form>
    </section>
  );
}
