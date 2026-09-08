/** Shared product knowledge for the "دفتر أثر" notebook (browser-safe). */

export const notebook = {
  id: "athar-notebook",
  name: "دفتر أثر",
  price: 6.5,
  currency: "د.ك",
  specs: [
    { label: "المقاس", value: "14×20 سم" },
    { label: "عدد الصفحات", value: "160 صفحة" },
    { label: "نوع الورق", value: "120 غرام أبيض دافئ" },
    { label: "التجليد", value: "خياطة يدوية يفتح بالكامل" },
    { label: "الغلاف", value: "ورق مقوى بحرف عربي منحوت بارز" },
    { label: "إضافات", value: "شريط تحديد وجيب خلفي" },
  ],
  shipping: "توصيل لكل مناطق الكويت، والسعر شامل الضريبة.",
  returns: "سياسة استبدال خلال 7 أيام من الاستلام.",
} as const;

export const suggestedQuestions = [
  "هل الدفتر مناسب للجامعة؟",
  "شلون أقدر أستخدمه للتخطيط؟",
  "عطِني أفكار لاستخدام الدفتر.",
  "سو لي خطة أسبوعية أقدر أكتبها في الدفتر.",
  "شنو أفضل طريقة أرتب فيه مهامي؟",
];
