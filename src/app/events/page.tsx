import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "مناسبت‌های امروز و تقویم مناسبت‌ها",
  description: "مناسبت‌های ملی، فرهنگی، رسمی و مذهبی ایران را در تقویم روزگار مشاهده کنید.",
  alternates: { canonical: "/events" },
};

export default function EventsPage(){
  return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · EVENTS</span><h1>مناسبت‌های تقویم</h1><p>مناسبت‌های ملی، فرهنگی، رسمی و مذهبی را در کنار تاریخ هر روز مشاهده کنید.</p><p><Link className="seo-link" href="/">مشاهده مناسبت‌های امروز ←</Link></p></section><section className="seo-grid"><article className="seo-card"><h2>مناسبت‌های ملی</h2><p>نوروز، روز طبیعت، شب یلدا و دیگر مناسبت‌های ملی و فرهنگی.</p></article><article className="seo-card"><h2>مناسبت‌های مذهبی</h2><p>مناسبت‌های قمری و تعطیلات مذهبی در کنار تقویم شمسی.</p></article><article className="seo-card"><h2>مناسبت‌های رسمی</h2><p>روزهای رسمی و تعطیلات ثبت‌شده در تقویم ایران.</p></article></section></SeoPage>
}