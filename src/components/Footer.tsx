import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden bg-[#2F2221] text-[#F5EFE7]">
      <div className="h-6 w-full pattern-arches opacity-25" aria-hidden />
      <span className="pointer-events-none absolute -bottom-10 left-6 font-display text-[10rem] leading-none text-[#F5EFE7]/[0.04] lg:text-[14rem]" aria-hidden>
        هوية
      </span>
      <div className="container-hawiya relative grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr_1fr_1.4fr] lg:py-20">
        <div>
          <p className="font-display text-3xl">هوية</p>
          <span className="mt-3 block h-px w-16 bg-[#D7C0A3]/50" aria-hidden />
          <p className="mt-3 max-w-xs text-sm text-[#F5EFE7]/70">يكتمل الجمال بهوية عربية</p>
        </div>


        <div>
          <p className="text-sm text-[#D7C0A3]">روابط</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/shop" className="text-[#F5EFE7]/80 transition-colors hover:text-[#F5EFE7]">
                المتجر
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#F5EFE7]/80 transition-colors hover:text-[#F5EFE7]">
                عن هوية
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#F5EFE7]/80 transition-colors hover:text-[#F5EFE7]">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm text-[#D7C0A3]">خدمة العملاء</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/shipping" className="text-[#F5EFE7]/80 transition-colors hover:text-[#F5EFE7]">
                سياسة الشحن
              </Link>
            </li>
            <li>
              <Link to="/returns" className="text-[#F5EFE7]/80 transition-colors hover:text-[#F5EFE7]">
                الاستبدال والاسترجاع
              </Link>
            </li>
            <li className="flex gap-4 pt-1 text-[#F5EFE7]/80">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#F5EFE7]">
                Instagram
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#F5EFE7]">
                TikTok
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-display text-xl">ابقَ قريبًا من هوية</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmail("");
              toast("تم اشتراكك بنجاح");
            }}
            className="mt-4 flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="min-w-0 flex-1 rounded-[16px] border border-[#F5EFE7]/20 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#F5EFE7]/45 focus:border-[#D7C0A3]"
            />
            <button
              type="submit"
              className="rounded-[16px] bg-[#D7C0A3] px-6 py-3 text-sm text-[#2F2221] transition-opacity duration-200 hover:opacity-90"
            >
              اشترك
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#F5EFE7]/10">
        <div className="container-hawiya py-6 text-xs text-[#F5EFE7]/50">
          © {new Date().getFullYear()} هوية — جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
