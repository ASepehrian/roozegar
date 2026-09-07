import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "روزگار | تقویم فارسی",
  description:
    "تقویم شمسی، میلادی و قمری. تقویم ماهانه، ابزار تبدیل تاریخ. بدون ثبت‌نام و بدون تبلیغات.",
};

// Applies the saved/preferred theme before paint, so there's no light-mode
// flash for users whose system (or last choice) is dark.
const themeInitScript = `
(function(){
  try {
    var saved = localStorage.getItem('roozegar-theme');
    var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
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
