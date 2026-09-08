import notebook from "@/assets/p-notebook.jpg";
import mug from "@/assets/p-mug.jpg";
import tote from "@/assets/p-tote.jpg";
import poster from "@/assets/p-poster.jpg";
import gift from "@/assets/p-gift.jpg";
import decor from "@/assets/p-decor.jpg";
import accessory from "@/assets/p-accessory.jpg";

export type CategoryId = "مكتبيات" | "هدايا" | "ديكور" | "إكسسوارات";

export type Product = {
  id: string;
  title: string;
  category: CategoryId;
  price: number;
  image: string;
  gallery: string[];
  description: string;
  inStock: boolean;
  popularity: number;
  createdAt: number;
};

export const categories: CategoryId[] = ["مكتبيات", "هدايا", "ديكور", "إكسسوارات"];

export const products: Product[] = [
  {
    id: "athar-notebook",
    title: "دفتر أثر",
    category: "مكتبيات",
    price: 6.5,
    image: notebook,
    gallery: [notebook, gift, poster],
    description:
      "دفتر بغلاف صلب بلون العنّاب، مطبوع بحرف عربي معاصر. ورق سميك بلون الكريم يمنح كتابتك دفئًا، وخياطة مفتوحة تجعله يستقر بين يديك.",
    inStock: true,
    popularity: 98,
    createdAt: 6,
  },
  {
    id: "harf-mug",
    title: "كوب حرف",
    category: "ديكور",
    price: 4.75,
    image: mug,
    gallery: [mug, decor, poster],
    description:
      "كوب سيراميك مطفي بلمسة يدوية، يحمل حرفًا عربيًا بلون العنّاب. صُمم ليكون بداية يومك، ويصلح للمايكرويف وغسالة الصحون.",
    inStock: true,
    popularity: 92,
    createdAt: 5,
  },
  {
    id: "arabic-tote",
    title: "حقيبة عربية",
    category: "إكسسوارات",
    price: 8.0,
    image: tote,
    gallery: [tote, accessory, notebook],
    description:
      "حقيبة قماش قطني ثقيل بلون طبيعي، مطبوعة بطباعة حريرية دقيقة. جيب داخلي وحمّالات مريحة ترافقك من المكتب إلى المقهى.",
    inStock: true,
    popularity: 88,
    createdAt: 4,
  },
  {
    id: "tafaseel-poster",
    title: "بوستر تفاصيل",
    category: "ديكور",
    price: 5.25,
    image: poster,
    gallery: [poster, decor, mug],
    description:
      "طباعة فنية على ورق مطفي بجودة أرشيفية، بحروف عربية كبيرة ومساحات بيضاء واسعة. متوفر بمقاس A3 بدون إطار.",
    inStock: true,
    popularity: 80,
    createdAt: 3,
  },
  {
    id: "hawiya-giftbox",
    title: "صندوق هوية",
    category: "هدايا",
    price: 14.9,
    image: gift,
    gallery: [gift, notebook, mug],
    description:
      "صندوق هدية يجمع دفتر أثر وكوب حرف وبطاقة مكتوبة بخط اليد، بتغليف عنّابي وشريط بيج. جاهز للإهداء مباشرة.",
    inStock: true,
    popularity: 95,
    createdAt: 7,
  },
  {
    id: "zaytoun-decor",
    title: "طقم زيتون",
    category: "ديكور",
    price: 11.75,
    image: decor,
    gallery: [decor, poster, mug],
    description:
      "مزهرية صغيرة ووعاء سيراميك بتدرّج الزيتون والعنّاب، بأسطح مطفية ناعمة تكمّل زوايا بيتك الهادئة.",
    inStock: true,
    popularity: 70,
    createdAt: 2,
  },
  {
    id: "harf-keychain",
    title: "ميدالية حرف",
    category: "إكسسوارات",
    price: 3.9,
    image: accessory,
    gallery: [accessory, tote, gift],
    description:
      "ميدالية جلد بلون العنّاب مع حلقة معدنية، وبروش صغير بحرف عربي. تفصيلة صغيرة تُكمل هويتك اليومية.",
    inStock: false,
    popularity: 64,
    createdAt: 1,
  },
  {
    id: "kutub-set",
    title: "طقم مكتب أثر",
    category: "مكتبيات",
    price: 12.25,
    image: notebook,
    gallery: [notebook, accessory, gift],
    description:
      "دفتران بمقاسين مختلفين وقلم بلون العنّاب، في غلاف واحد. طقم متكامل لمن يكتب كل يوم.",
    inStock: true,
    popularity: 76,
    createdAt: 8,
  },
  {
    id: "gift-small",
    title: "هدية صغيرة",
    category: "هدايا",
    price: 7.4,
    image: gift,
    gallery: [gift, mug, decor],
    description: "صندوق مصغّر يضم كوب حرف وبطاقة معايدة عربية، بتغليف أنيق جاهز للإهداء.",
    inStock: true,
    popularity: 58,
    createdAt: 9,
  },
];

export const formatKWD = (value: number) => `${value.toFixed(3)} د.ك`;

export const getProduct = (id: string) => products.find((p) => p.id === id);
