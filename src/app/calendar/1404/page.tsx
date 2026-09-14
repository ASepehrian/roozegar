import type { Metadata } from "next";
import Link from "next/link";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "تقویم شمسی 1404 | تقویم فارسی آنلاین",
  description: "تقویم کامل سال 1404 هجری شمسی؛ ماه‌های سال را ببینید و تاریخ و مناسبت‌های هر ماه را در روزگار دنبال کنید.",
  alternates: { canonical: "/calendar/1404" },
};

export default function Calendar1404() {
  return <SeoPage>
    <section className="seo-hero">
      <span className="seo-kicker">روزگار · تقویم شمسی</span>
      <h1>تقویم شمسی 1404</h1>
      <p>تقویم کامل سال 1404 هجری شمسی را ماه‌به‌ماه ببینید. برای هر ماه صفحه‌ای اختصاصی با تاریخ‌های تقویمی در دسترس است.</p>
    </section>
    <section className="seo-grid">
      <article className="seo-card" key="1"><h2><Link className="seo-link" href="/calendar/1404/1">فروردین 1404</Link></h2><p>تقویم فروردین سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="2"><h2><Link className="seo-link" href="/calendar/1404/2">اردیبهشت 1404</Link></h2><p>تقویم اردیبهشت سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="3"><h2><Link className="seo-link" href="/calendar/1404/3">خرداد 1404</Link></h2><p>تقویم خرداد سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="4"><h2><Link className="seo-link" href="/calendar/1404/4">تیر 1404</Link></h2><p>تقویم تیر سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="5"><h2><Link className="seo-link" href="/calendar/1404/5">مرداد 1404</Link></h2><p>تقویم مرداد سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="6"><h2><Link className="seo-link" href="/calendar/1404/6">شهریور 1404</Link></h2><p>تقویم شهریور سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="7"><h2><Link className="seo-link" href="/calendar/1404/7">مهر 1404</Link></h2><p>تقویم مهر سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="8"><h2><Link className="seo-link" href="/calendar/1404/8">آبان 1404</Link></h2><p>تقویم آبان سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="9"><h2><Link className="seo-link" href="/calendar/1404/9">آذر 1404</Link></h2><p>تقویم آذر سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="10"><h2><Link className="seo-link" href="/calendar/1404/10">دی 1404</Link></h2><p>تقویم دی سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="11"><h2><Link className="seo-link" href="/calendar/1404/11">بهمن 1404</Link></h2><p>تقویم بهمن سال 1404 و روزهای این ماه.</p></article><article className="seo-card" key="12"><h2><Link className="seo-link" href="/calendar/1404/12">اسفند 1404</Link></h2><p>تقویم اسفند سال 1404 و روزهای این ماه.</p></article>
    </section>
    <section className="seo-section">
      <h2>تقویم سال‌های دیگر</h2>
      <p><Link className="seo-link" href="/calendar/1405">تقویم 1405</Link> · <Link className="seo-link" href="/calendar/1406">تقویم 1406</Link> · <Link className="seo-link" href="/calendar/1407">تقویم 1407</Link></p>
    </section>
  </SeoPage>;
}