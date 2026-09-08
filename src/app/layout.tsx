import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "روزگار | تقویم فارسی",
  description:
    "تقویم شمسی، میلادی و قمری. تقویم ماهانه، ابزار تبدیل تاریخ. بدون ثبت‌نام و بدون تبلیغات.",
};

// Applies the saved/preferred theme, font, and size before paint, so there's
// no flash of the wrong look on load.
const themeInitScript = `
(function(){
  try {
    var theme = localStorage.getItem('roozegar-theme') || 'auto';
    var dark = theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : theme === 'dark';
    if (dark) document.documentElement.classList.add('dark');
    var font = localStorage.getItem('roozegar-font') || 'vazirmatn';
    var size = localStorage.getItem('roozegar-size') || 'md';
    document.documentElement.setAttribute('data-font', font);
    document.documentElement.setAttribute('data-size', size);
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
