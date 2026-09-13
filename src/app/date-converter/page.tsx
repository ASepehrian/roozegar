import type { Metadata } from "next";
import Link from "next/link";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "تبدیل تاریخ شمسی، میلادی و قمری",
  description: "ابزار آنلاین تبدیل تاریخ بین تقویم شمسی، میلادی و قمری در روزگار.",
  alternates: { canonical: "/date-converter" },
};

export default function ConverterPage(){
  return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · DATE TOOLS</span><h1>تبدیل تاریخ</h1><p>تاریخ را بین تقویم هجری شمسی، میلادی و قمری تبدیل کنید و معادل دقیق آن را ببینید.</p><p><Link className="seo-link" href="/#date-tools">رفتن به ابزار تبدیل تاریخ ←</Link></p></section><section className="seo-section"><h2>تبدیل تاریخ شمسی به میلادی</h2><p>برای تبدیل یک تاریخ شمسی به میلادی، از ابزار تبدیل تاریخ روزگار استفاده کنید. این ابزار برای تبدیل تاریخ‌های روزمره، مناسبت‌ها و برنامه‌ریزی کاربردی است.</p></section><section className="seo-section"><h2>تبدیل تاریخ میلادی به شمسی</h2><p>تاریخ میلادی را وارد کنید تا معادل هجری شمسی آن را مشاهده کنید.</p></section><section className="seo-section"><h2>تبدیل تاریخ قمری</h2><p>روزگار امکان مشاهده معادل قمری تاریخ‌ها را نیز در کنار دو تقویم دیگر فراهم می‌کند.</p></section></SeoPage>
}