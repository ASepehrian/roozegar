import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "ساعت ایران و تهران | ساعت دقیق آنلاین",
  description: "ساعت دقیق تهران و ایران را آنلاین ببینید؛ همراه با تاریخ شمسی، میلادی و قمری در روزگار.",
  alternates: { canonical: "/time" },
};

export default function TimePage(){
  return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · CLOCK</span><h1>ساعت دقیق تهران</h1><p>ساعت ایران را همراه با تاریخ امروز و تقویم‌های شمسی، میلادی و قمری در صفحه اصلی روزگار ببینید.</p><p><Link className="seo-link" href="/">مشاهده ساعت زنده تهران ←</Link></p></section><section className="seo-grid"><article className="seo-card"><h2>ساعت ایران</h2><p>نمایش ساعت تهران بر اساس منطقه زمانی Asia/Tehran.</p></article><article className="seo-card"><h2>تاریخ شمسی</h2><p>ساعت و تاریخ را همزمان و بدون نیاز به نصب برنامه ببینید.</p></article></section></SeoPage>
}