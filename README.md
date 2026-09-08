# روزگار · Roozegar

تقویم فارسی — شمسی، میلادی و قمری در کنار هم، تقویم ماهانه، ابزار تبدیل تاریخ.
بدون حساب کاربری، بدون پایگاه‌داده، بدون ردیابی.

Built with Next.js 16 · React 19 · TypeScript.

## امکانات

- سه تقویم هم‌زمان (شمسی/میلادی/قمری) در سربرگ و زیر هر خانهٔ ماه
- ساعت زندهٔ تهران با تشخیص خودکار تغییر روز در نیمه‌شب
- برج فلکی هر روز (نگاشت مستقیم از ماه شمسی)
- مناسبت‌های ملی/فرهنگی پیش‌فرض؛ مذهبی/دولتی پشت یک کلید نمایش
- ابزار تبدیل تاریخ، فاصلهٔ دو تاریخ، محاسبهٔ سن
- اوقات شرعی برای ۱۲ شهر ایران (کتابخانهٔ `adhan`، روش تهران)
- آب‌وهوای امروز (Open-Meteo، بدون نیاز به کلید API)
- یک بیت شعر تصادفیِ روزانه از حافظ/سعدی
- پوستهٔ روشن/تیره/خودکار + سه اندازه و سه فونت فارسی

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
   چیزی برای تنظیم لازم نیست، چون `railway.json` و `.nvmrc` (Node ≥20)
   همراه پروژه است.
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
- بدون متغیر محیطی اجباری؛ پروژه بدون هیچ کلید یا سرویس خارجی کار می‌کند
  (آب‌وهوا و اوقات شرعی هم بدون کلید API کار می‌کنند).
- نیازمند Node.js ≥20.9 (به‌خاطر Next.js 16) — با `.nvmrc` و `engines` در
  `package.json` مشخص شده.

## ساختار

```
src/
├── app/
│   ├── layout.tsx      RTL، متادیتا، اسکریپت پوسته/فونت پیش از رندر
│   ├── page.tsx         صفحهٔ اصلی (force-dynamic)
│   └── globals.css      توکن‌های رنگ، تایپوگرافی، اندازهٔ قلم
├── components/
│   ├── CalendarApp.tsx  ارکستراتور اصلی
│   ├── DateTools.tsx    تب‌های تبدیل/فاصله/سن
│   ├── DateFields.tsx   فرم انتخاب تاریخ مشترک
│   ├── PrayerTimesCard.tsx  اوقات شرعی
│   ├── WeatherCard.tsx  آب‌وهوا
│   ├── QuoteCard.tsx    بیت شعر روز
│   ├── ZodiacBadge.tsx  آیکون برج
│   ├── SettingsPanel.tsx  پوسته/فونت/اندازه
│   └── GirihDivider.tsx نوار تزئینی گره‌چینی
└── lib/
    ├── calendar.ts       هستهٔ تبدیل شمسی/میلادی/قمری (بر پایهٔ Intl)
    ├── occasions.ts      دیتاست مناسبت‌ها
    ├── zodiac.ts         نگاشت ماه به برج
    ├── prayerTimes.ts    پوششی روی کتابخانهٔ adhan
    └── weather.ts        کلاینت Open-Meteo
```

