import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import notebookImg from "@/assets/p-notebook.jpg";
import { formatKWD } from "@/data/products";
import { useStore } from "@/lib/store";
import { Reveal } from "@/components/Reveal";
import { Divider } from "@/components/Ornament";

export const Route = createFileRoute("/campaign/daftar-athar")({
  head: () => ({
    meta: [
      { title: "دفتر أثر | حملة هوية" },
      {
        name: "description",
        content: "دفتر أثر من هوية — غلاف منحوت بحرف عربي واحد، وصفحات تكفي تفاصيلك اليومية.",
      },
      { property: "og:title", content: "دفتر أثر | حملة هوية" },
      {
        property: "og:description",
        content: "دفتر أثر من هوية — غلاف منحوت بحرف عربي واحد، وصفحات تكفي تفاصيلك اليومية.",
      },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CampaignDaftarAthar,
});

const PRODUCT_ID = "athar-notebook";
const PRODUCT_PRICE = 6.5;

const features = [
  {
    title: "غلاف يُنحت لا يُطبع",
    body: "حرف عربي واحد بارز بتقنية النقش، يمنح كل نسخة إحساسًا بالعمق والملمس.",
  },
  {
    title: "ورق يليق بخط يدك",
    body: "ورق سميك 120 غرام بلون أبيض دافئ، يمتص الحبر بانتظام ويحافظ على جودة الخط.",
  },
  {
    title: "تصميم يرافقك",
    body: "مقاس 14×20 سم يناسب الحقيبة والمكتب، بتجليد يفتح بالكامل لتكتبي بارتياح.",
  },
];

const specs = [
  { label: "المقاس", value: "14×20 سم" },
  { label: "عدد الصفحات", value: "160 صفحة" },
  { label: "نوع الورق", value: "120 غرام أبيض دافئ" },
  { label: "التجليد", value: "خياطة يدوية يفتح بالكامل" },
  { label: "الغلاف", value: "ورق مقوى بحرف منحوت بارز" },
  { label: "إضافات", value: "شريط تحديد وجيب خلفي" },
];

function CampaignDaftarAthar() {
  const { addToCart } = useStore();

  const handleOrder = () => {
    addToCart(PRODUCT_ID);
    toast("تمت إضافة دفتر أثر إلى السلة");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute inset-0 pattern-geo" aria-hidden />
        <div className="container-hawiya relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <Reveal className="order-1 text-right">
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              من مجموعة هوية
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.15] text-foreground">
              دفتر يبدأ من حرف،
              <br />
              <span className="text-primary">وينتهي في يومك</span>
            </h1>
            <svg width="140" height="12" viewBox="0 0 140 12" fill="none" className="mt-5 text-primary/40" aria-hidden>
              <path d="M0 6h44M96 6h44" stroke="currentColor" strokeWidth="1" />
              <path d="M70 1l5 5-5 5-5-5 5-5Z" stroke="currentColor" strokeWidth="1" />
              <path d="M52 6c4 0 5-3 8-3s4 3 8 3M88 6c-4 0-5-3-8-3s-4 3-8 3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
            <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground lg:text-lg">
              دفتر أثر مو مجرد ورق تكتبين فيه. غلافه منحوت بحرف عربي واحد، وصفحاته مساحة تكتب فيها تفاصيلك كل يوم — من أول فكرة إلى آخر خط.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleOrder}
                className="rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                اطلبي نسختك الآن
              </button>
              <div className="text-right">
                <p className="font-display text-2xl text-foreground">{formatKWD(PRODUCT_PRICE)}</p>
                <p className="text-xs text-muted-foreground">شامل الضريبة، توصيل لكل مناطق الكويت</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-2 relative" delay={120}>
            <div className="absolute -top-5 -right-5 h-[72%] w-[72%] arch-soft bg-primary/10 lg:-top-8 lg:-right-8" />
            <span className="pointer-events-none absolute -bottom-6 right-2 font-display text-[7rem] leading-none text-primary/10 lg:text-[10rem]">
              أ
            </span>
            <div className="relative arch-soft overflow-hidden p-[6px] ring-1 ring-primary/20">
              <img
                src={notebookImg}
                alt="دفتر أثر بغلاف عنابي وشعار حرف عربي منحوت"
                width={1200}
                height={1408}
                className="arch-soft w-full object-cover shadow-lift"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-hawiya">
        <Divider />
      </div>

      {/* WHY ATHAR */}
      <section className="section-pad pt-10 lg:pt-16">
        <div className="container-hawiya">
          <Reveal className="text-center">
            <p className="text-sm text-primary">ليش أثر؟</p>
            <h2 className="mt-3 font-display text-3xl lg:text-4xl">تفاصيل تخلّي الكتابة عادة</h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="relative h-full rounded-[24px] border border-border/60 bg-secondary/40 p-8 text-right transition-colors duration-300 hover:bg-secondary/60">
                  <span className="pointer-events-none absolute right-4 top-4 font-display text-5xl text-primary/10">0{i + 1}</span>
                  <h3 className="relative font-display text-xl">{f.title}</h3>
                  <p className="relative mt-4 text-sm leading-7 text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT DETAILS */}
      <section className="section-pad pt-0">
        <div className="container-hawiya">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="overflow-hidden rounded-[24px] bg-secondary/40 p-2">
                <img
                  src={notebookImg}
                  alt="تفاصيل دفتر أثر"
                  loading="lazy"
                  width={900}
                  height={900}
                  className="h-[360px] w-full rounded-[20px] object-cover lg:h-[480px]"
                />
              </div>
            </Reveal>

            <Reveal className="text-right" delay={100}>
              <p className="text-sm text-primary">مواصفات المنتج</p>
              <h2 className="mt-3 font-display text-3xl lg:text-4xl">صُنع ليكون جزء من يومك</h2>
              <dl className="mt-8 space-y-4">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-4 border-b border-border/60 pb-4"
                  >
                    <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-olive" />
                  توصيل لكل المناطق
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-olive" />
                  استبدال خلال 7 أيام
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-olive" />
                  كمية محدودة
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative overflow-hidden bg-[#2F2221] py-20 text-[#F5EFE7] lg:py-28">
        <span className="pointer-events-none absolute inset-0 pattern-geo-light" aria-hidden />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-6 pattern-arches opacity-30" aria-hidden />
        <div className="container-hawiya relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <svg width="64" height="48" viewBox="0 0 64 48" fill="none" className="mx-auto mb-8 text-[#D7C0A3]/40" aria-hidden>
              <path d="M24 4C12 12 4 22 4 34c0 8 6 14 14 14 8 0 14-6 14-14 0-6-4-10-10-10-2 0-4 .5-5 1.5C19 18 27 10 38 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M56 4C44 12 36 22 36 34c0 8 6 14 14 14 8 0 14-6 14-14 0-6-4-10-10-10-2 0-4 .5-5 1.5C51 18 59 10 70 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <blockquote className="font-display text-[clamp(1.6rem,4vw,2.6rem)] leading-relaxed">
              "أول دفتر أحس إن الحرف العربي فيه مو بس زخرفة، أحس إنه هوية."
            </blockquote>
            <p className="mt-6 text-sm text-[#F5EFE7]/60">— رأي تمثيلي من مجتمع هوية</p>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#7E1E20] py-16 text-[#F5EFE7] lg:py-24">
        <span className="pointer-events-none absolute inset-0 pattern-geo-light" aria-hidden />
        <span className="pointer-events-none absolute inset-y-0 left-[-4%] flex items-center font-display text-[14rem] leading-none text-[#F5EFE7]/[0.07] lg:text-[22rem]">
          أثر
        </span>
        <div className="container-hawiya relative">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-tight">ابدأ أثرك اليوم</h2>
            <p className="mt-5 text-base leading-8 text-[#F5EFE7]/80">
              الكمية محدودة لهذه الدفعة. اطلبي دفتر أثر الآن واحصلي على قطعة تصاحبك من أول خط إلى آخر فكرة.
            </p>
            <button
              type="button"
              onClick={handleOrder}
              className="mt-9 inline-block rounded-[16px] bg-[#F5EFE7] px-8 py-4 text-sm text-[#7E1E20] transition-opacity duration-200 hover:opacity-90"
            >
              اطلبي دفتر أثر — {formatKWD(PRODUCT_PRICE)}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#F5EFE7]/60">
              <ShieldCheck className="h-3.5 w-3.5" />
              سياسة استبدال خلال 7 أيام
            </p>
          </Reveal>
        </div>
      </section>

      {/* BREADCRUMB / BACK */}
      <div className="container-hawiya py-8">
        <Link to="/shop" className="text-sm text-muted-foreground transition-colors hover:text-primary">
          ← العودة إلى المتجر
        </Link>
      </div>
    </>
  );
}
