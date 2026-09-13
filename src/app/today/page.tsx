import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "تاریخ امروز | تقویم شمسی، میلادی و قمری",
  description: "تاریخ امروز را در تقویم شمسی، میلادی و قمری ببینید؛ همراه با ساعت تهران و مناسبت‌های امروز در روزگار.",
  alternates: { canonical: "/today" },
};

export default function TodayPage(){
  return <SeoPage><section className="seo-hero">
    <span className="seo-kicker">روزگار · TODAY</span>
    <h1>تاریخ امروز</h1>
    <p>برای تاریخ دقیق امروز، ساعت تهران، تقویم شمسی، میلادی و قمری و مناسبت‌های روز، از تقویم آنلاین روزگار استفاده کنید.</p>
    <p><Link className="seo-link" href="/">مشاهده تاریخ امروز و ساعت زنده ←</Link></p>
  </section>
  <section className="seo-grid">
    <article className="seo-card"><h2>تقویم شمسی</h2><p>تاریخ امروز را در تقویم رسمی هجری شمسی ایران مشاهده کنید.</p></article>
    <article className="seo-card"><h2>تقویم میلادی</h2><p>معادل میلادی هر روز را کنار تاریخ شمسی ببینید.</p></article>
    <article className="seo-card"><h2>تقویم قمری</h2><p>تاریخ قمری و مناسبت‌های مذهبی را نیز در یک نگاه ببینید.</p></article>
  </section></SeoPage>
}