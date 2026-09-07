# روزگار · Roozegar

تقویم فارسی — شمسی، میلادی و قمری در کنار هم، تقویم ماهانه، ابزار تبدیل تاریخ.
بدون حساب کاربری، بدون پایگاه‌داده، بدون ردیابی.

Built with Next.js 15 · React 19 · TypeScript.

## اجرای محلی

```bash
npm install
npm run dev
```

سپس http://localhost:3100

## دیپلوی روی Railway

### روش ۱: از طریق گیت‌هاب (پیشنهادی)

1. یک ریپازیتوری جدید روی گیت‌هاب بساز و این پوشه را push کن:
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<username>/roozegar.git
   git push -u origin main
   ```
2. به [railway.app](https://railway.app) برو و وارد شو (می‌تونی با گیت‌هاب لاگین کنی).
3. **New Project → Deploy from GitHub repo** را بزن و ریپازیتوری `roozegar` را انتخاب کن.
4. Railway به‌صورت خودکار Next.js را تشخیص می‌دهد (از طریق Nixpacks) و از
   `npm run build` برای build و `npm run start` برای اجرا استفاده می‌کند —
   چیزی برای تنظیم لازم نیست، چون `railway.json` همراه پروژه است.
5. بعد از اولین دیپلوی، از تب **Settings → Networking** یک دامنهٔ عمومی
   (Generate Domain) بگیر یا دامنهٔ خودت را وصل کن.

### روش ۲: از طریق Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

سپس در داشبورد Railway یک دامنه برای سرویس بساز.

## نکات فنی دیپلوی

- سرور با `next start -H 0.0.0.0 -p ${PORT:-3000}` اجرا می‌شود، یعنی روی همهٔ
  اینترفیس‌ها بایند می‌شود و پورتی را می‌خواند که Railway از طریق متغیر محیطی
  `PORT` تزریق می‌کند — نیازی به تنظیم دستی پورت نیست.
- صفحهٔ اصلی `force-dynamic` است تا «امروز» همیشه لحظهٔ واقعی تهران را نشان
  دهد، نه یک نسخهٔ کش‌شده در زمان build.
- بدون متغیر محیطی اجباری؛ پروژه بدون هیچ کلید یا سرویس خارجی کار می‌کند.

## ساختار

```
src/
├── app/
│   ├── layout.tsx      RTL، متادیتا، اسکریپت پوستهٔ پیش از رندر
│   ├── page.tsx         صفحهٔ اصلی (force-dynamic)
│   └── globals.css      توکن‌های رنگ (روشن + تیره)، تایپوگرافی
├── components/
│   ├── CalendarApp.tsx  ارکستراتور اصلی: ساعت، گرید ماه، تبدیل تاریخ
│   └── GirihDivider.tsx نوار تزئینی گره‌چینی
└── lib/
    └── calendar.ts       هستهٔ تبدیل شمسی/میلادی/قمری (بر پایهٔ Intl)
```
