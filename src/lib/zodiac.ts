// Persian solar months line up almost exactly with the zodiac (Nowruz =
// vernal equinox = start of Aries), so each month maps directly to one sign.

export interface ZodiacSign {
  name: string; // Persian name
  glyph: string; // Unicode astrological symbol
  element: string;
}

export const ZODIAC_BY_MONTH: ZodiacSign[] = [
  { name: "حَمَل", glyph: "♈", element: "آتش" }, // فروردین
  { name: "ثَور", glyph: "♉", element: "خاک" }, // اردیبهشت
  { name: "جَوزا", glyph: "♊", element: "باد" }, // خرداد
  { name: "سرطان", glyph: "♋", element: "آب" }, // تیر
  { name: "اَسَد", glyph: "♌", element: "آتش" }, // مرداد
  { name: "سنبله", glyph: "♍", element: "خاک" }, // شهریور
  { name: "میزان", glyph: "♎", element: "باد" }, // مهر
  { name: "عقرب", glyph: "♏", element: "آب" }, // آبان
  { name: "قوس", glyph: "♐", element: "آتش" }, // آذر
  { name: "جَدْی", glyph: "♑", element: "خاک" }, // دی
  { name: "دَلو", glyph: "♒", element: "باد" }, // بهمن
  { name: "حوت", glyph: "♓", element: "آب" }, // اسفند
];

export function zodiacForPersianMonth(m: number): ZodiacSign {
  return ZODIAC_BY_MONTH[(m - 1 + 12) % 12];
}
