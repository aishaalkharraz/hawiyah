import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import posterImg from "@/assets/p-poster.jpg";
import mugImg from "@/assets/p-mug.jpg";
import toteImg from "@/assets/p-tote.jpg";
import decorImg from "@/assets/p-decor.jpg";
import giftImg from "@/assets/p-gift.jpg";
import notebookImg from "@/assets/p-notebook.jpg";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Divider } from "@/components/Ornament";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "هوية | يكتمل الجمال بهوية عربية" },
      {
        name: "description",
        content: "قطع صُممت لتأخذ العربية من الحرف إلى تفاصيل يومك — مكتبيات، هدايا، ديكور وإكسسوارات.",
      },
      { property: "og:title", content: "هوية | يكتمل الجمال بهوية عربية" },
      {
        property: "og:description",
        content: "علامة لايف ستايل عربية معاصرة: مكتبيات، هدايا، ديكور وإكسسوارات.",
      },
    ],
  }),
  component: Home,
});

const categoryCards = [
  { title: "مكتبيات", image: notebookImg, tone: "bg-[#7E1E20] text-[#F5EFE7]" },
  { title: "هدايا", image: giftImg, tone: "bg-[#D7C0A3] text-[#2F2221]" },
  { title: "ديكور", image: decorImg, tone: "bg-[#79856B] text-[#F5EFE7]" },
  { title: "إكسسوارات", image: toteImg, tone: "bg-[#2F2221] text-[#F5EFE7]" },
];

function Home() {
  const featured = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute inset-0 pattern-geo" aria-hidden />
        <div className="container-hawiya relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="order-1 text-right">
            <span className="inline-block rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              علامة عربية معاصرة
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.12] text-foreground">
              يكتمل الجمال
              <br />
              <span className="text-primary">بهوية عربية</span>
            </h1>
            <svg width="140" height="12" viewBox="0 0 140 12" fill="none" className="mt-5 text-primary/40" aria-hidden>
              <path d="M0 6h44M96 6h44" stroke="currentColor" strokeWidth="1" />
              <path d="M70 1l5 5-5 5-5-5 5-5Z" stroke="currentColor" strokeWidth="1" />
              <path d="M52 6c4 0 5-3 8-3s4 3 8 3M88 6c-4 0-5-3-8-3s-4 3-8 3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
            <p className="mt-6 max-w-md text-base leading-8 text-muted-foreground lg:text-lg">
              قطع صُممت لتأخذ العربية من الحرف إلى تفاصيل يومك.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/collections"
                className="rounded-[16px] bg-primary px-7 py-4 text-sm text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                اكتشف المجموعة
              </Link>
              <Link
                to="/shop"
                className="rounded-[16px] border border-foreground/20 px-7 py-4 text-sm transition-colors duration-200 hover:bg-secondary/60"
              >
                تسوّق الآن
              </Link>
            </div>
          </div>

          <div className="order-2 relative">
            <div className="absolute -top-5 -left-5 h-[72%] w-[72%] arch-soft bg-primary lg:-top-8 lg:-left-8" />
            <span className="pointer-events-none absolute -bottom-6 left-2 font-display text-[7rem] leading-none text-primary/10 lg:text-[10rem]">
              هوية
            </span>
            <div className="relative arch-soft overflow-hidden p-[6px] ring-1 ring-primary/20">
              <img
                src={heroImg}
                alt="مجموعة منتجات هوية: دفتر وحقيبة وكوب وبوستر وصندوق هدية"
                width={1200}
                height={1408}
                className="arch-soft w-full object-cover shadow-lift"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container-hawiya">
        <Divider />
      </div>

      {/* FEATURED */}
      <section className="section-pad pt-10 lg:pt-16">

        <div className="container-hawiya">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl lg:text-4xl">الأكثر طلبًا</h2>
              <p className="mt-3 text-sm text-muted-foreground">اختيارات صنعت لترافق تفاصيلك اليومية.</p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
            >
              كل المنتجات
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </Link>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:mt-14 lg:grid-cols-4 lg:gap-x-7">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section-pad pt-0">
        <div className="container-hawiya">
          <Reveal>
            <h2 className="font-display text-3xl lg:text-4xl">تسوّق حسب هويتك</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <Link
                  to="/shop"
                  search={{ cat: c.title }}
                  className={`group relative block h-[320px] overflow-hidden rounded-[24px] transition-transform duration-300 hover:-translate-y-1.5 lg:h-[400px] ${c.tone}`}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 pattern-geo-light" aria-hidden />
                  <span className="pointer-events-none absolute inset-4 rounded-[18px] border border-current/15" aria-hidden />
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <h3 className="font-display text-3xl">{c.title}</h3>
                    <span className="mt-3 inline-flex h-10 w-10 translate-x-3 items-center justify-center rounded-full bg-current/10 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      <ArrowLeft className="h-4 w-4" />
                    </span>
                  </div>

                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="relative overflow-hidden bg-[#7E1E20] text-[#F5EFE7]">
        <span className="pointer-events-none absolute inset-0 pattern-geo-light" aria-hidden />
        <span className="pointer-events-none absolute inset-x-0 top-0 h-6 pattern-arches opacity-30" aria-hidden />
        <span className="pointer-events-none absolute inset-y-0 left-[-4%] flex items-center font-display text-[16rem] leading-none text-[#F5EFE7]/[0.07] lg:text-[24rem]">
          هوية
        </span>
        <div className="container-hawiya relative section-pad">
          <Reveal className="max-w-2xl">
            <p className="text-sm text-[#D7C0A3]">عن هوية</p>

            <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] leading-tight">
              ليست مجرد تفاصيل.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-9 text-[#F5EFE7]/80">
              نصمم قطعًا تحمل روح العربية، بأسلوب بسيط ومعاصر يرافق تفاصيلك اليومية.
            </p>
            <Link
              to="/about"
              className="mt-9 inline-block rounded-[16px] bg-[#F5EFE7] px-7 py-4 text-sm text-[#7E1E20] transition-opacity duration-200 hover:opacity-90"
            >
              اقرأ قصتنا
            </Link>
          </Reveal>
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="section-pad">
        <div className="container-hawiya">
          <Reveal className="max-w-2xl">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.4rem)]">العربية كما نراها.</h2>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              لغة تعيش في التفاصيل، وتتحول إلى تصميم نستخدمه كل يوم.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
            <Reveal className="lg:col-span-5 lg:mt-16">
              <div className="overflow-hidden rounded-[24px] bg-secondary/50">
                <img
                  src={posterImg}
                  alt="بوستر بحروف عربية"
                  loading="lazy"
                  width={900}
                  height={900}
                  className="h-[360px] w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[440px]"
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">بوستر تفاصيل — طباعة أرشيفية</p>
            </Reveal>

            <Reveal className="flex items-center justify-center rounded-[24px] bg-[#79856B] p-10 text-center lg:col-span-3" delay={80}>
              <span className="font-display text-[7rem] leading-none text-[#F5EFE7] lg:text-[9rem]">ه</span>
            </Reveal>

            <Reveal className="lg:col-span-4" delay={140}>
              <div className="overflow-hidden rounded-[24px] bg-secondary/50">
                <img
                  src={mugImg}
                  alt="كوب سيراميك بحرف عربي"
                  loading="lazy"
                  width={900}
                  height={900}
                  className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105 lg:h-[340px]"
                />
              </div>
              <p className="mt-6 text-sm leading-8 text-muted-foreground">
                نبدأ من الحرف: نبسّطه، نمنحه مساحة، ثم نضعه على قطعة تُستخدم كل صباح. هكذا تتحول اللغة
                إلى عادة يومية.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
