// Source: roozegar zodiac (برج فلکی)
// Why: the Persian solar months are the zodiac signs themselves — Farvardin is
//      Aries (حمل) and Shahrivar is Virgo (سنبله) — so the sign of a day is a
//      pure function of its Jalali month, no ephemeris needed.

export interface Zodiac {
  name: string;
  latin: string;
  element: "آتش" | "خاک" | "باد" | "آب";
  path: string;
}

export const ZODIACS: Zodiac[] = [
  { name: "حمل", latin: "Aries", element: "آتش", path: "M12 20V8M12 8c0-3 2-4 3.5-4S19 5 19 7.5M12 8c0-3-2-4-3.5-4S5 5 5 7.5" },
  { name: "ثور", latin: "Taurus", element: "خاک", path: "M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM5 3c0 4 3 6 7 6s7-2 7-6" },
  { name: "جوزا", latin: "Gemini", element: "باد", path: "M5 4h14M5 20h14M9 4v16M15 4v16" },
  { name: "سرطان", latin: "Cancer", element: "آب", path: "M4 9c3-3 10-4 15-1M20 15c-3 3-10 4-15 1M7 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM17 11.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" },
  { name: "اسد", latin: "Leo", element: "آتش", path: "M7 17a3 3 0 1 1 0-6c2.5 0 3.5 2 3.5 4.5S9 20 12 20s5-1.5 5-4M8.5 11.5C8.5 8 10 4 13 4s4.5 2.5 3.5 5.5" },
  { name: "سنبله", latin: "Virgo", element: "خاک", path: "M4 5v10M8 5v10M12 5v9M4 5c0-1 4-1 4 0M8 5c0-1 4-1 4 0M12 8c1-3 5-3 5 2v6M17 16c0 3 2 4 3.5 3M14 18c1.5 2 4 2.5 6.5 1.5" },
  { name: "میزان", latin: "Libra", element: "باد", path: "M3 19h18M3 14h6a4 4 0 1 1 6 0h6" },
  { name: "عقرب", latin: "Scorpio", element: "آب", path: "M3 5v10M7 5v10M11 5v9M3 5c0-1 4-1 4 0M7 5c0-1 4-1 4 0M11 8c1-3 5-3 5 2v6h4M17 16l3 3 1-3" },
  { name: "قوس", latin: "Sagittarius", element: "آتش", path: "M4 20L19 5M12 5h7v7M8 12l4 4" },
  { name: "جدی", latin: "Capricorn", element: "خاک", path: "M3 6c2-2 4 0 4 3v8M7 9c1-4 4-5 6-3s1 6-2 7M13 17a3 3 0 1 0 4-2c-2-1-3.5 0-3.5 2S15 21 18 20" },
  { name: "دلو", latin: "Aquarius", element: "باد", path: "M3 10l3-3 3 3 3-3 3 3 3-3 3 3M3 17l3-3 3 3 3-3 3 3 3-3 3 3" },
  { name: "حوت", latin: "Pisces", element: "آب", path: "M7 3c-3 4-3 14 0 18M17 3c3 4 3 14 0 18M4 12h16" },
];

export function zodiacOfPersianMonth(month: number): Zodiac {
  return ZODIACS[(month - 1 + 12) % 12];
}
