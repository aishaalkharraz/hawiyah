import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Monitor, Smartphone } from "lucide-react";
import notebookImg from "@/assets/p-notebook.jpg";
import { notebook } from "@/lib/notebook-info";
import { Reveal } from "@/components/Reveal";
import { Divider } from "@/components/Ornament";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "الإيميل الترويجي | هوية" },
      {
        name: "description",
        content: "معاينة الإيميل الترويجي لدفتر أثر من هوية — كل فكرة تستحق مكان.",
      },
      { property: "og:title", content: "الإيميل الترويجي | هوية" },
      {
        property: "og:description",
        content: "الإيميل الترويجي لدفتر أثر: كل فكرة تستحق مكان. اطلب دفترك الآن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <>
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute inset-0 pattern-geo" aria-hidden />
        <div className="container-hawiya relative py-14 text-right lg:py-20">
          <Reveal>
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              حملة {notebook.name}
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.2]">
              الإيميل الترويجي
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              هذي نسخة الإيميل اللي يوصل لمشتركي القائمة البريدية — بنفس ألوان وخطوط هوية، وجاهز
              للإرسال على الجوال والكمبيوتر.
            </p>

            <div className="mt-8 inline-flex rounded-full border border-border p-1">
              <button
                type="button"
                onClick={() => setView("desktop")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors ${
                  view === "desktop" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                كمبيوتر
              </button>
              <button
                type="button"
                onClick={() => setView("mobile")}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs transition-colors ${
                  view === "mobile" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                جوال
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-hawiya">
        <Divider />
      </div>

      <section className="section-pad pt-10">
        <div className="container-hawiya">
          {/* Subject + preview line */}
          <Reveal className="mx-auto max-w-2xl rounded-[20px] border border-border/60 bg-secondary/40 p-5 text-right">
            <p className="text-xs text-muted-foreground">عنوان الرسالة</p>
            <p className="mt-1 font-display text-lg">يمكن فكرتك الجاية تبدأ من صفحة ✨</p>
            <p className="mt-4 text-xs text-muted-foreground">النص التمهيدي</p>
            <p className="mt-1 text-sm text-foreground/80">
              دفترك الجديد جاهز لكل فكرة، خطة وملاحظة.
            </p>
          </Reveal>

          {/* Email body */}
          <Reveal delay={100} className="mt-10">
            <div
              className={`mx-auto w-full transition-all duration-300 ${
                view === "mobile" ? "max-w-[390px]" : "max-w-2xl"
              }`}
            >
              <div className="overflow-hidden rounded-[24px] border border-border/60 bg-[#F5EFE7] shadow-lift">
                {/* header bar */}
                <div className="relative overflow-hidden bg-[#7E1E20] px-6 py-5 text-center text-[#F5EFE7]">
                  <span className="pointer-events-none absolute inset-0 pattern-geo-light" aria-hidden />
                  <p className="relative font-display text-2xl">هوية</p>
                  <p className="relative mt-1 text-[11px] text-[#F5EFE7]/70">
                    يكتمل الجمال بهوية عربية
                  </p>
                </div>

                <img
                  src={notebookImg}
                  alt="دفتر أثر بغلاف عنابي وحرف عربي منحوت"
                  loading="lazy"
                  width={1200}
                  height={800}
                  className={`w-full object-cover ${view === "mobile" ? "h-52" : "h-72"}`}
                />

                <div className="px-6 py-9 text-right sm:px-10">
                  <h2 className="font-display text-[clamp(1.7rem,4vw,2.4rem)] leading-tight text-[#2F2221]">
                    كل فكرة تستحق مكان.
                  </h2>
                  <span className="mt-4 block h-px w-24 bg-[#D7C0A3]" aria-hidden />

                  <div className="mt-6 space-y-5 text-sm leading-8 text-[#2F2221]/80 sm:text-base">
                    <p>وسط زحمة الأفكار والمواعيد، أحيانًا كل اللي تحتاجه صفحة فاضية.</p>
                    <p>
                      هذا الدفتر صُمم ليكون معك في الدراسة، العمل، التخطيط، وحتى اللحظات اللي تجيك
                      فيها فكرة فجأة.
                    </p>
                    <p className="font-display text-lg leading-9 text-[#7E1E20]">
                      اكتبها.
                      <br />
                      رتبها.
                      <br />
                      وخلها تتحول إلى شيء أكبر.
                    </p>
                  </div>

                  <div className="mt-8 rounded-[18px] border border-[#D7C0A3]/60 bg-white/50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-[#2F2221]/70">{notebook.name}</p>
                      <p className="font-display text-xl text-[#7E1E20]">
                        {notebook.price.toFixed(3)} {notebook.currency}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-[#2F2221]/60">
                      {notebook.shipping} {notebook.returns}
                    </p>
                  </div>

                  <Link
                    to="/campaign/daftar-athar"
                    className="mt-8 block rounded-[16px] bg-[#7E1E20] px-8 py-4 text-center text-sm text-[#F5EFE7] transition-opacity duration-200 hover:opacity-90"
                  >
                    اطلب دفترك الآن
                  </Link>

                  <p className="mt-8 text-center font-display text-lg text-[#2F2221]">
                    ابدأ صفحتك الأولى اليوم.
                  </p>
                </div>

                <div className="relative overflow-hidden bg-[#2F2221] px-6 py-6 text-center text-[11px] text-[#F5EFE7]/60">
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-4 pattern-arches opacity-25" aria-hidden />
                  <p className="relative">هوية — منتجات مستوحاة من الحرف العربي، الكويت</p>
                  <p className="relative mt-1">وصلك هذا الإيميل لأنك مشترك في قائمة هوية البريدية.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-10 text-center">
            <Link
              to="/campaign/daftar-athar"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ← صفحة الحملة الكاملة لدفتر أثر
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
