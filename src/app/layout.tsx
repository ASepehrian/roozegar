import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "روزگار",
  description: "تقویم و ساعت فارسی",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
