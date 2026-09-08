import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { notebook } from "./notebook-info";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});

const askSchema = z.object({
  messages: z.array(messageSchema).min(1).max(24),
});

const specsText = notebook.specs.map((s) => `${s.label}: ${s.value}`).join("، ");

const SYSTEM_PROMPT = `أنت "مساعد هوية" الذكي، مساعد عربي ودود لمتجر "هوية" الكويتي، متخصص في منتج واحد: ${notebook.name}.

معلومات المنتج (استخدمها فقط، ولا تخترع تفاصيل غير موجودة):
- الاسم: ${notebook.name}
- السعر: ${notebook.price.toFixed(3)} ${notebook.currency} شامل الضريبة
- المواصفات: ${specsText}
- الشحن: ${notebook.shipping}
- الإرجاع: ${notebook.returns}

مهاراتك:
1) معرفة المنتج: جاوبي بدقة عن المواصفات والسعر والشحن والاستبدال.
2) كتابة إعلانية: صياغة جمل قصيرة دافئة بنفس نبرة العلامة (عصرية، بسيطة، راقية).
3) توصيات: اقترحي استخدامات للدفتر حسب حاجة الزائر (دراسة، عمل، تخطيط، أفكار).
4) تخطيط: عند الطلب، اكتبي خطة أسبوعية أو طريقة ترتيب مهام جاهزة للنسخ في الدفتر.

القواعد:
- اكتبي بالعربية دائمًا وبلهجة خليجية خفيفة ومهذبة.
- ردود قصيرة ومرتبة (٣–٦ أسطر أو نقاط قصيرة)، بنص عادي بدون رموز Markdown مثل ** أو #.
- لا تخترعي عروضًا أو أسعارًا أو مواصفات غير مذكورة أعلاه.
- إذا سُئلتِ عن شيء خارج نطاق الدفتر، أعيدي التوجيه بلطف إلى المنتج أو صفحات المتجر.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => askSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI service is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.7-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`AI gateway failed [${response.status}]: ${body}`);
      if (response.status === 429) throw new Error("rate_limit");
      throw new Error("ai_failed");
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = json.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("ai_empty");
    return { reply };
  });

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  question: z.string().trim().min(2).max(600),
});

const SPREADSHEET_ID = "18uRro1HbY6xjy8pje8lKriy3tGtT1tT3oUBRYBg3oWo";

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !sheetsKey) throw new Error("Sheets connection is not configured");

    const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${SPREADSHEET_ID}/values/Leads!A:E:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": sheetsKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [
          [data.name, data.email, data.question, new Date().toISOString(), notebook.name],
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Sheets append failed [${response.status}]: ${body}`);
      throw new Error("sheets_failed");
    }

    return { saved: true as const };
  });
