// Server-safe price map (no image imports) used to validate cart totals.
export const productPrices: Record<string, { title: string; price: number }> = {
  "athar-notebook": { title: "دفتر أثر", price: 6.5 },
  "harf-mug": { title: "كوب حرف", price: 4.75 },
  "arabic-tote": { title: "حقيبة عربية", price: 8.0 },
  "tafaseel-poster": { title: "بوستر تفاصيل", price: 5.25 },
  "hawiya-giftbox": { title: "صندوق هوية", price: 14.9 },
  "zaytoun-decor": { title: "طقم زيتون", price: 11.75 },
  "harf-keychain": { title: "ميدالية حرف", price: 3.9 },
  "kutub-set": { title: "طقم مكتب أثر", price: 12.25 },
  "gift-small": { title: "هدية صغيرة", price: 7.4 },
};
