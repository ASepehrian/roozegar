import type { Metadata } from "next";
import Link from "next/link";
import { PERSIAN_MONTHS } from "@/lib/calendar";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "تقویم شمسی ۱۴۰۵ | تقویم فارسی آنلاین",
  description: "تقویم شمسی آنلاین روزگار؛ ماه‌های سال ۱۴۰۵ را ببینید و وارد صفحه اختصاصی هر ماه شوید.",
  alternates: { canonical: "/calendar" },
};

export default function CalendarIndex(){
  return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · PERSIAN CALENDAR</span><h1>تقویم شمسی ۱۴۰۵</h1><p>تقویم فارسی سال ۱۴۰۵ را ماه‌به‌ماه ببینید. هر صفحه شامل روزهای ماه و لینک به جزئیات تاریخ است.</p></section>
  <section className="seo-grid">{PERSIAN_MONTHS.map((m,i)=><article className="seo-card" key={m}><h2><Link className="seo-link" href={`/calendar/1405/${i+1}`}>{m} ۱۴۰۵</Link></h2><p>تقویم {m} سال ۱۴۰۵، همراه با دسترسی به تاریخ و مناسبت‌های روز.</p></article>)}</section>
  <section className="seo-section"><h2>سال‌های تقویمی</h2><p><Link className="seo-link" href="/calendar/1404">تقویم ۱۴۰۴</Link> · <Link className="seo-link" href="/calendar/1405">تقویم ۱۴۰۵</Link> · <Link className="seo-link" href="/calendar/1406">تقویم ۱۴۰۶</Link> · <Link className="seo-link" href="/calendar/1407">تقویم ۱۴۰۷</Link></p></section>
  </SeoPage>
}