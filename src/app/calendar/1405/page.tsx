import type { Metadata } from "next";
import Link from "next/link";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "تقویم شمسی ۱۴۰۵ | تقویم فارسی آنلاین",
  description: "تقویم کامل سال ۱۴۰۵ هجری شمسی؛ ماه‌های سال را ببینید و تاریخ و مناسبت‌های هر ماه را در روزگار دنبال کنید.",
  alternates: { canonical: "/calendar/1405" },
};

export default function Calendar1405() {
  return <SeoPage>
    <section className="seo-hero">
      <span className="seo-kicker">روزگار · تقویم شمسی</span>
      <h1>تقویم شمسی ۱۴۰۵</h1>
      <p>تقویم کامل سال ۱۴۰۵ هجری شمسی را ماه‌به‌ماه ببینید. برای هر ماه صفحه‌ای اختصاصی با تاریخ‌های تقویمی در دسترس است.</p>
    </section>
    <section className="seo-grid">
      <article className="seo-card" key="1"><h2><Link className="seo-link" href="/calendar/1405/1">فروردین ۱۴۰۵</Link></h2><p>تقویم فروردین سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="2"><h2><Link className="seo-link" href="/calendar/1405/2">اردیبهشت ۱۴۰۵</Link></h2><p>تقویم اردیبهشت سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="3"><h2><Link className="seo-link" href="/calendar/1405/3">خرداد ۱۴۰۵</Link></h2><p>تقویم خرداد سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="4"><h2><Link className="seo-link" href="/calendar/1405/4">تیر ۱۴۰۵</Link></h2><p>تقویم تیر سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="5"><h2><Link className="seo-link" href="/calendar/1405/5">مرداد ۱۴۰۵</Link></h2><p>تقویم مرداد سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="6"><h2><Link className="seo-link" href="/calendar/1405/6">شهریور ۱۴۰۵</Link></h2><p>تقویم شهریور سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="7"><h2><Link className="seo-link" href="/calendar/1405/7">مهر ۱۴۰۵</Link></h2><p>تقویم مهر سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="8"><h2><Link className="seo-link" href="/calendar/1405/8">آبان ۱۴۰۵</Link></h2><p>تقویم آبان سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="9"><h2><Link className="seo-link" href="/calendar/1405/9">آذر ۱۴۰۵</Link></h2><p>تقویم آذر سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="10"><h2><Link className="seo-link" href="/calendar/1405/10">دی ۱۴۰۵</Link></h2><p>تقویم دی سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="11"><h2><Link className="seo-link" href="/calendar/1405/11">بهمن ۱۴۰۵</Link></h2><p>تقویم بهمن سال ۱۴۰۵ و روزهای این ماه.</p></article><article className="seo-card" key="12"><h2><Link className="seo-link" href="/calendar/1405/12">اسفند ۱۴۰۵</Link></h2><p>تقویم اسفند سال ۱۴۰۵ و روزهای این ماه.</p></article>
    </section>
  </SeoPage>;
}