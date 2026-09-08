import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن هوية | قصة العلامة" },
      { name: "description", content: "هوية علامة عربية معاصرة تحوّل الحرف العربي إلى قطع يومية." },
      { property: "og:title", content: "عن هوية | قصة العلامة" },
      { property: "og:description", content: "نصمم قطعًا تحمل روح العربية بأسلوب بسيط ومعاصر." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="container-hawiya py-12 lg:py-20">
        <p className="text-sm text-muted-foreground">عن هوية</p>
        <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight">
          نصمم قطعًا تحمل روح العربية.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-9 text-muted-foreground">
          بدأت هوية من سؤال بسيط: كيف نأخذ جمال الحرف العربي من اللوحة إلى الطاولة؟ نصمم في الكويت
          قطعًا يومية — دفاتر، أكواب، حقائب، بوسترات — بأسلوب معاصر ومساحات بيضاء واسعة، بعيدًا عن
          الزخرفة التقليدية.
        </p>
      </section>

      <section className="container-hawiya">
        <Reveal>
          <img
            src={heroImg}
            alt="تشكيلة منتجات هوية"
            loading="lazy"
            width={1200}
            height={1408}
            className="h-[380px] w-full rounded-[28px] object-cover lg:h-[560px]"
          />
        </Reveal>
      </section>

      <section className="container-hawiya section-pad">
        <div className="grid gap-10 lg:grid-cols-3">
          {[
            { t: "تصميم أولًا", d: "كل قطعة تبدأ برسم للحرف، ثم تُختصر حتى تبقى الفكرة فقط." },
            { t: "خامات تدوم", d: "ورق سميك، سيراميك مطفي، قماش قطني ثقيل — تفاصيل تُحسّ باليد." },
            { t: "إنتاج محدود", d: "دفعات صغيرة تحافظ على جودة التنفيذ وقيمة القطعة." },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <div className="rounded-[24px] border border-border bg-card p-8">
                <h2 className="font-display text-2xl">{c.t}</h2>
                <p className="mt-3 text-sm leading-8 text-muted-foreground">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Link
          to="/shop"
          className="mt-12 inline-block rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
        >
          تسوّق الآن
        </Link>
      </section>
    </>
  );
}
