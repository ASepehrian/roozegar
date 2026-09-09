# روزگار · Roozegar

تقویم فارسی — شمسی، میلادی و قمری در کنار هم، تقویم ماهانه، ابزار تبدیل تاریخ.
بدون حساب کاربری، بدون پایگاه‌داده، بدون ردیابی.

Built with Next.js 16 · React 19 · TypeScript.

## امکانات

- **سه تقویم هم‌زمان**: شمسی، میلادی و قمری در سربرگ و زیر هر خانهٔ ماه.
- **ساعت زندهٔ تهران**: ثانیه‌به‌ثانیه، با تشخیص خودکار تغییر روز در نیمه‌شب تهران.
- **برج فلکی**: برج هر ماه شمسی با نشان SVG.
- **مناسبت‌ها**: ملی و فرهنگی به‌صورت پیش‌فرض؛ مذهبی و دولتی قابل فعال‌سازی در تنظیمات.
- **ابزارهای تاریخ**: تبدیل بین سه تقویم، فاصلهٔ دو تاریخ، محاسبهٔ سن.
- **اوقات شرعی**: ۱۲ شهر ایران با محاسبهٔ محلی و روش تهران یا MWL.
- **پوسته و قلم**: تیره/روشن/خودکار، سه اندازه و سه قلم فارسی.
- **آب‌وهوای امروز**: از Open-Meteo و بدون نیاز به کلید API.
- **بیت روز**: یک بیت از حافظ یا سعدی که هر روز تغییر می‌کند.

## اجرای محلی

```bash
npm install
npm run dev
```

سپس http://localhost:3100

## دیپلوی روی Railway

### از طریق GitHub

1. در Railway گزینهٔ **New Project → Deploy from GitHub repo** را انتخاب کن.
2. ریپازیتوری `roozegar` را انتخاب کن.
3. Railway پروژهٔ Next.js را با Nixpacks تشخیص می‌دهد و `npm run build` و `npm run start` را اجرا می‌کند.
4. از **Settings → Networking** یک دامنهٔ عمومی بساز یا دامنهٔ خودت را متصل کن.

`railway.json` و `.nvmrc` برای Node.js 20+ در پروژه قرار دارند.

## نکات فنی

- سرور با `next start -H 0.0.0.0 -p ${PORT:-3000}` اجرا می‌شود و پورت Railway را می‌خواند.
- صفحهٔ اصلی `force-dynamic` است تا تاریخ امروز بر اساس زمان واقعی تهران محاسبه شود.
- پروژه متغیر محیطی اجباری ندارد.
- نیازمند Node.js ≥20.9 به‌خاطر Next.js 16 است.

## ساختار

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── CalendarApp.tsx
│   ├── SettingsPanel.tsx
│   ├── DateTools.tsx
│   ├── DateFields.tsx
│   ├── PrayerTimesCard.tsx
│   ├── WeatherCard.tsx
│   ├── PoemCard.tsx
│   ├── ZodiacBadge.tsx
│   └── GirihDivider.tsx
└── lib/
    ├── calendar.ts
    ├── datetools.ts
    ├── events.ts
    ├── prayer.ts
    ├── cities.ts
    ├── weather.ts
    ├── poems.ts
    ├── settings.ts
    └── zodiac.ts
```
