import type { Metadata } from "next";
import Link from "next/link";
import { PERSIAN_MONTHS, monthGrid, toFa } from "@/lib/calendar";
import SeoPage from "@/components/SeoPage";

const years=[1404,1405,1406,1407];
export function generateStaticParams(){return years.flatMap(year=>Array.from({length:12},(_,i)=>({year:String(year),month:String(i+1)})));}
export async function generateMetadata({params}:{params:Promise<{year:string;month:string}>}):Promise<Metadata>{
 const {year,month}=await params; const m=Number(month); const name=PERSIAN_MONTHS[m-1]??"ماه";
 return {title:`تقویم ${name} ${year}`,description:`تقویم ${name} سال ${year} هجری شمسی؛ روزهای ماه را آنلاین در روزگار ببینید.`,alternates:{canonical:`/calendar/${year}/${month}`}};
}
export default async function MonthPage({params}:{params:Promise<{year:string;month:string}>}){
 const {year,month}=await params; const y=Number(year),m=Number(month);
 if(!years.includes(y)||m<1||m>12) return <SeoPage><section className="seo-hero"><h1>صفحه تقویم پیدا نشد</h1></section></SeoPage>;
 const grid=monthGrid("persian",y,m); const cells:Array<number|null>=[];
 for(let i=0;i<grid.startIndex;i++) cells.push(null); for(let d=1;d<=grid.daysInMonth;d++) cells.push(d);
 while(cells.length%7) cells.push(null);
 return <SeoPage><section className="seo-hero"><span className="seo-kicker">روزگار · تقویم شمسی</span><h1>تقویم {PERSIAN_MONTHS[m-1]} {year}</h1><p>روزهای ماه {PERSIAN_MONTHS[m-1]} سال {year} هجری شمسی.</p></section><section className="seo-section"><div className="seo-calendar">{["ش","ی","د","س","چ","پ","ج"].map(d=><div className="head" key={d}>{d}</div>)}{cells.map((d,i)=><div className={!d?"muted":""} key={i}>{d?toFa(d):""}</div>)}</div></section><section className="seo-section"><p><Link className="seo-link" href={`/calendar/${year}`}>← همه ماه‌های سال {year}</Link></p></section></SeoPage>
}