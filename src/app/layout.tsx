import type { Metadata } from "next";
import "./globals.css";
import "./sylva.css";
import "./seo.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qolet.ir"),
  title: {
    default: "روزگار | تقویم فارسی، ساعت و تاریخ امروز",
    template: "%s | روزگار",
  },
  description:
    "روزگار؛ تقویم فارسی آنلاین برای مشاهده تاریخ امروز، تقویم شمسی، میلادی و قمری، ساعت تهران، مناسبت‌ها، اوقات شرعی و ابزار تبدیل تاریخ.",
  keywords: [
    "تقویم",
    "تقویم فارسی",
    "تقویم شمسی",
    "تقویم ۱۴۰۵",
    "تاریخ امروز",
    "ساعت ایران",
    "ساعت تهران",
    "تقویم آنلاین",
    "مناسبت های امروز",
    "اوقات شرعی",
    "تبدیل تاریخ",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.qolet.ir/",
    siteName: "روزگار",
    locale: "fa_IR",
    title: "روزگار | تقویم فارسی، ساعت و تاریخ امروز",
    description:
      "تقویم شمسی، میلادی و قمری، ساعت تهران، مناسبت‌ها، اوقات شرعی و ابزارهای تاریخ در یک صفحه.",
  },
  twitter: {
    card: "summary_large_image",
    title: "روزگار | تقویم فارسی، ساعت و تاریخ امروز",
    description:
      "تقویم شمسی، میلادی و قمری، ساعت تهران، مناسبت‌ها، اوقات شرعی و ابزارهای تاریخ.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

// Applies the saved appearance (theme, font size, font family) before paint,
// so there's no flash of the default look.
const themeInitScript = `
(function(){
  try {
    var root = document.documentElement;
    var theme = localStorage.getItem('roozegar-theme') || 'auto';
    var dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) root.classList.add('dark');
    var size = localStorage.getItem('roozegar-font-size') || 'md';
    root.classList.add('fs-' + (['sm','md','lg'].indexOf(size) >= 0 ? size : 'md'));
    var family = localStorage.getItem('roozegar-font-family') || 'vazir';
    root.classList.add('font-' + (['vazir','naskh','markazi'].indexOf(family) >= 0 ? family : 'vazir'));
  } catch (e) {}
})();
`;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "روزگار",
  url: "https://www.qolet.ir/",
  inLanguage: "fa-IR",
  description: "تقویم فارسی، ساعت تهران، مناسبت‌ها، اوقات شرعی و ابزارهای تبدیل تاریخ.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />{children}</body>
    </html>
  );
}
