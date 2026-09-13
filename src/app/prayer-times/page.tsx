import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "اوقات شرعی امروز | اذان صبح، ظهر و مغرب",
  description: "اوقات شرعی شهرهای ایران را در روزگار ببینید؛ شامل اذان صبح، طلوع آفتاب، ظهر، مغرب و عشاء.",
  alternates: { canonical: "/prayer-times" },
};

export default function PrayerPage(){
  return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · PRAYER TIMES</span><h1>اوقات شرعی</h1><p>اوقات شرعی امروز را برای شهرهای ایران مشاهده کنید؛ از اذان صبح و طلوع آفتاب تا ظهر، مغرب و عشاء.</p><p><Link className="seo-link" href="/#prayer-times">مشاهده اوقات شرعی ←</Link></p></section><section className="seo-grid"><article className="seo-card"><h2>تهران</h2><p>اوقات شرعی تهران را در تقویم روزگار مشاهده کنید.</p></article><article className="seo-card"><h2>مشهد</h2><p>محاسبه اوقات شرعی برای مشهد و شهرهای دیگر ایران.</p></article><article className="seo-card"><h2>شهرهای ایران</h2><p>شهر موردنظر خود را در ابزار اوقات شرعی انتخاب کنید.</p></article></section></SeoPage>
}