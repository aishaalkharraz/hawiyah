import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { askAssistant, saveLead } from "@/lib/assistant.functions";
import { notebook, suggestedQuestions } from "@/lib/notebook-info";
import { Reveal } from "@/components/Reveal";
import { Divider } from "@/components/Ornament";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "مساعدك الذكي | هوية" },
      {
        name: "description",
        content: "اسأل عن دفتر أثر أو خل المساعد الذكي يساعدك تختار أفضل طريقة لاستخدامه.",
      },
      { property: "og:title", content: "مساعدك الذكي | هوية" },
      {
        property: "og:description",
        content: "مساعد ذكي يجاوب عن دفتر أثر ويقترح لك أفكار استخدام وخطط أسبوعية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type ChatMessage = { role: "user" | "assistant"; content: string };

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "هلا فيك 👋 أنا مساعد هوية. أقدر أجاوبك عن دفتر أثر، أقترح لك طرق استخدامه، وأسوي لك خطة أسبوعية جاهزة تكتبها فيه. شنو تحب تعرف؟",
};

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const save = useServerFn(saveLead);

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "", question: "" });
  const [saving, setSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || thinking) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const res = await ask({ data: { messages: next.slice(-12) } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (error) {
      const rate = error instanceof Error && error.message.includes("rate_limit");
      toast(rate ? "ضغط على المساعد الآن، جرّب بعد لحظات" : "تعذّر الوصول للمساعد، حاول مرة ثانية");
      setMessages(next);
    } finally {
      setThinking(false);
    }
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (lead.name.trim().length < 2 || !lead.email.includes("@") || lead.question.trim().length < 2) {
      toast("عبّي الاسم والإيميل وسؤالك من فضلك");
      return;
    }
    setSaving(true);
    try {
      await save({ data: lead });
      setSavedOnce(true);
      setLead({ name: "", email: "", question: "" });
      toast("وصلنا طلبك، بنرد عليك بأقرب وقت");
    } catch {
      toast("ما قدرنا نحفظ بياناتك الحين، جرّب مرة ثانية");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <span className="pointer-events-none absolute inset-0 pattern-geo" aria-hidden />
        <div className="container-hawiya relative py-14 text-right lg:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              مدعوم بالذكاء الاصطناعي
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.2]">
              مساعدك الذكي
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              اسأل عن الدفتر أو خل المساعد الذكي يساعدك تختار أفضل طريقة لاستخدامه.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-hawiya">
        <Divider />
      </div>

      <section className="section-pad pt-10">
        <div className="container-hawiya grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-12">
          {/* CHAT */}
          <Reveal>
            <div className="flex h-[560px] flex-col overflow-hidden rounded-[24px] border border-border/60 bg-secondary/30">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/60 px-5 py-4">
                <div className="text-right">
                  <p className="font-display text-lg">مساعد هوية</p>
                  <p className="text-xs text-muted-foreground">يعرف كل تفاصيل {notebook.name}</p>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-[18px] px-4 py-3 text-sm leading-7 ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "border border-border/60 bg-background text-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-end">
                    <div className="flex items-center gap-2 rounded-[18px] border border-border/60 bg-background px-4 py-3 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      يكتب...
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border/60 bg-background/60 px-5 py-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {suggestedQuestions.slice(0, 3).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(q)}
                      disabled={thinking}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="اكتب سؤالك عن الدفتر..."
                    className="h-12 flex-1 rounded-[14px] border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-primary/50"
                  />
                  <button
                    type="submit"
                    disabled={thinking || !input.trim()}
                    aria-label="إرسال"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-primary text-primary-foreground transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4 rotate-180" />
                  </button>
                </form>
              </div>
            </div>
          </Reveal>

          {/* SIDE: more questions + lead form */}
          <div className="space-y-8">
            <Reveal delay={80}>
              <div className="rounded-[24px] border border-border/60 p-6 text-right">
                <h2 className="font-display text-xl">جرّب تسأل</h2>
                <ul className="mt-4 space-y-2">
                  {suggestedQuestions.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => void send(q)}
                        disabled={thinking}
                        className="w-full rounded-[14px] bg-secondary/50 px-4 py-3 text-right text-sm text-foreground/80 transition-colors duration-200 hover:bg-secondary disabled:opacity-50"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <form
                onSubmit={submitLead}
                className="rounded-[24px] border border-border/60 bg-secondary/40 p-6 text-right"
              >
                <h2 className="font-display text-xl">تحب نرد عليك؟</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  اترك اسمك وإيميلك وسؤالك عن {notebook.name}، وبيوصلك رد من فريق هوية.
                </p>
                <div className="mt-5 space-y-3">
                  <input
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    placeholder="الاسم"
                    className="h-12 w-full rounded-[14px] border border-border bg-background px-4 text-sm outline-none focus:border-primary/50"
                  />
                  <input
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    type="email"
                    placeholder="الإيميل"
                    dir="ltr"
                    className="h-12 w-full rounded-[14px] border border-border bg-background px-4 text-right text-sm outline-none focus:border-primary/50"
                  />
                  <textarea
                    value={lead.question}
                    onChange={(e) => setLead({ ...lead, question: e.target.value })}
                    placeholder="سؤالك"
                    rows={3}
                    className="w-full rounded-[14px] border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary px-6 py-3.5 text-sm text-primary-foreground transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  إرسال بياناتي
                </button>
                {savedOnce && (
                  <p className="mt-3 text-xs text-olive">تم حفظ طلبك بنجاح ✓</p>
                )}
              </form>
            </Reveal>

            <Reveal delay={200}>
              <Link
                to="/campaign/daftar-athar"
                className="block rounded-[24px] bg-[#7E1E20] p-6 text-right text-[#F5EFE7] transition-opacity duration-200 hover:opacity-95"
              >
                <p className="font-display text-xl">جاهز تطلب دفترك؟</p>
                <p className="mt-2 text-sm text-[#F5EFE7]/80">
                  {notebook.name} — {notebook.price.toFixed(3)} {notebook.currency}
                </p>
                <span className="mt-4 inline-block text-sm underline underline-offset-4">
                  شوف صفحة الدفتر ←
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
