import type { Metadata } from "next";
import Link from "next/link";
import SeoPage from "@/components/SeoPage";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "قیمت امروز طلا | قیمت طلای ۱۸ عیار",
  description: "قیمت لحظه‌ای طلای ۱۸ عیار به تومان، تغییرات روزانه و آخرین زمان به‌روزرسانی در روزگار.",
  alternates: { canonical: "/gold" },
  openGraph: { title: "قیمت امروز طلا | روزگار", description: "مشاهده قیمت به‌روز طلای ۱۸ عیار به تومان در روزگار.", url: "https://www.qolet.ir/gold", type: "website" },
};
type Market={gold18Toman?:{toman:number;changePercent:number;rising:boolean};fetchedAt?:number};
const fa=(n:number)=>new Intl.NumberFormat("fa-IR").format(Math.round(n));
async function getMarket():Promise<Market|null>{try{const r=await fetch("https://www.qolet.ir/api/market",{cache:"no-store"});if(!r.ok)return null;return await r.json()}catch{return null}}
export default async function GoldPage(){const d=await getMarket();const g=d?.gold18Toman;const u=d?.fetchedAt?new Date(d.fetchedAt).toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit"}):null;return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · بازار</span><h1>قیمت امروز طلا</h1><p>قیمت طلای ۱۸ عیار را به تومان ببینید و تغییرات روزانه آن را دنبال کنید.</p></section><section className="seo-grid"><article className="seo-card"><h2>طلای ۱۸ عیار</h2><p className="seo-price">{g?fa(g.toman)+" تومان":"در حال دریافت قیمت..."}</p><p>{g?(g.rising?"افزایش ":"کاهش ")+fa(Math.abs(g.changePercent))+"٪ نسبت به آخرین مقدار ثبت‌شده":"قیمت فعلاً در دسترس نیست."}</p>{u&&<p className="seo-muted">آخرین دریافت: {u}</p>}</article><article className="seo-card"><h2>قیمت طلا در روزگار</h2><p>صفحه اختصاصی برای مشاهده قیمت طلای ۱۸ عیار و دسترسی سریع به تقویم و ابزارهای روزانه.</p><p><Link className="seo-link" href="/">مشاهده تقویم و قیمت‌های بازار ←</Link></p></article></section><section className="seo-section"><h2>سؤالات رایج</h2><div className="seo-grid"><article className="seo-card"><h3>قیمت طلای ۱۸ عیار چقدر است؟</h3><p>مقدار فعلی در کارت بالای صفحه نمایش داده می‌شود و هنگام دریافت داده از سرویس بازار به‌روزرسانی می‌شود.</p></article><article className="seo-card"><h3>قیمت‌ها به چه واحدی هستند؟</h3><p>قیمت این صفحه به تومان نمایش داده می‌شود.</p></article></div></section></SeoPage>}