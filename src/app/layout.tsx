import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "روزگار | تقویم فارسی",
  description:
    "تقویم شمسی، میلادی و قمری. تقویم ماهانه، ابزار تبدیل تاریخ. بدون ثبت‌نام و بدون تبلیغات.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
