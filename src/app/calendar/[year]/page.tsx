import type { Metadata } from "next";
import Link from "next/link";
import { PERSIAN_MONTHS } from "@/lib/calendar";
import SeoPage from "@/components/SeoPage";

const years=[1404,1405,1406,1407];
export function generateStaticParams(){return years.map(year=>({year:String(year)}));}
export async function generateMetadata({params}:{params:Promise<{year:string}>}):Promise<Metadata>{
 const {year}=await params;
 return {title:`تقویم شمسی ${year}`,description:`تقویم کامل سال ${year} هجری شمسی، شامل دوازده ماه و لینک صفحات ماهانه در روزگار.`,alternates:{canonical:`/calendar/${year}`}};
}
export default async function YearPage({params}:{params:Promise<{year:string}>}){
 const {year}=await params; const y=Number(year);
 if(!years.includes(y)) return <SeoPage><section className="seo-hero"><h1>سال پیدا نشد</h1><p>سال موردنظر در دسترس نیست.</p></section></SeoPage>;
 return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · CALENDAR</span><h1>تقویم شمسی {year}</h1><p>تقویم کامل سال {year} را ماه‌به‌ماه مرور کنید.</p></section><section className="seo-grid">{PERSIAN_MONTHS.map((m,i)=><article className="seo-card" key={m}><h2><Link className="seo-link" href={`/calendar/${year}/${i+1}`}>{m} {year}</Link></h2><p>مشاهده روزهای {m} و دسترسی به اطلاعات تاریخ.</p></article>)}</section></SeoPage>
}