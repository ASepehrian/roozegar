import Link from "next/link";

export default function SeoPage({children}:{children:React.ReactNode}){
  return <main className="seo-page">
    <nav className="seo-nav" aria-label="ناوبری">
      <Link className="seo-brand" href="/">روزگار</Link>
      <div className="seo-navlinks">
        <Link href="/today">امروز</Link><Link href="/calendar">تقویم</Link><Link href="/events">مناسبت‌ها</Link><Link href="/prayer-times">اوقات شرعی</Link><Link href="/date-converter">تبدیل تاریخ</Link>
      </div>
    </nav>
    {children}
    <footer className="seo-footer">روزگار؛ تقویم فارسی، ساعت تهران و ابزارهای تاریخ — <Link className="seo-link" href="/">بازگشت به صفحه اصلی</Link></footer>
  </main>
}