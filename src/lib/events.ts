// Source: roozegar occasions (مناسبت‌ها)
// Why: occasions are stored against the calendar they are actually defined in
//      (Jalali for national days, Hijri for religious ones, Gregorian for a
//      handful of international ones) and resolved per rendered day, so Hijri
//      occasions drift through the Jalali year exactly as they do in reality.

import { calOf, monthGrid } from "./calendar";

export type OccasionCategory = "national" | "religious" | "official";

export const CATEGORY_LABELS: Record<OccasionCategory, string> = {
  national: "ملی و فرهنگی",
  religious: "مذهبی",
  official: "دولتی",
};

export interface Occasion {
  title: string;
  category: OccasionCategory;
  /** Official public holiday in Iran. */
  holiday: boolean;
}

interface FixedOccasion extends Occasion {
  m: number;
  d: number;
}

const PERSIAN_OCCASIONS: FixedOccasion[] = [
  { m: 1, d: 1, title: "نوروز، آغاز سال نو", category: "national", holiday: true },
  { m: 1, d: 2, title: "عید نوروز", category: "national", holiday: true },
  { m: 1, d: 3, title: "عید نوروز", category: "national", holiday: true },
  { m: 1, d: 4, title: "عید نوروز", category: "national", holiday: true },
  { m: 1, d: 12, title: "روز جمهوری اسلامی", category: "official", holiday: true },
  { m: 1, d: 13, title: "سیزده‌به‌در، روز طبیعت", category: "national", holiday: true },
  { m: 1, d: 19, title: "روز هنر انقلاب اسلامی", category: "official", holiday: false },
  { m: 1, d: 25, title: "روز بزرگداشت عطار نیشابوری", category: "national", holiday: false },
  { m: 2, d: 1, title: "روز بزرگداشت سعدی", category: "national", holiday: false },
  { m: 2, d: 3, title: "روز بزرگداشت شیخ بهایی، روز ملی کارآفرینی", category: "national", holiday: false },
  { m: 2, d: 10, title: "روز ملی خلیج فارس", category: "national", holiday: false },
  { m: 2, d: 12, title: "روز معلم", category: "official", holiday: false },
  { m: 2, d: 25, title: "روز بزرگداشت فردوسی", category: "national", holiday: false },
  { m: 2, d: 28, title: "روز بزرگداشت حکیم عمر خیام", category: "national", holiday: false },
  { m: 3, d: 1, title: "روز بزرگداشت ملاصدرا", category: "national", holiday: false },
  { m: 3, d: 3, title: "آزادسازی خرمشهر، روز مقاومت", category: "official", holiday: false },
  { m: 3, d: 14, title: "رحلت امام خمینی", category: "official", holiday: true },
  { m: 3, d: 15, title: "قیام ۱۵ خرداد", category: "official", holiday: true },
  { m: 3, d: 20, title: "روز جهانی صنایع‌دستی", category: "national", holiday: false },
  { m: 3, d: 27, title: "روز جهاد کشاورزی", category: "official", holiday: false },
  { m: 4, d: 1, title: "روز اصناف", category: "national", holiday: false },
  { m: 4, d: 10, title: "روز صنعت و معدن", category: "official", holiday: false },
  { m: 4, d: 25, title: "روز بهزیستی و تأمین اجتماعی", category: "official", holiday: false },
  { m: 5, d: 6, title: "روز کشاورز", category: "national", holiday: false },
  { m: 5, d: 14, title: "سالروز صدور فرمان مشروطیت", category: "national", holiday: false },
  { m: 5, d: 17, title: "روز خبرنگار", category: "national", holiday: false },
  { m: 6, d: 1, title: "روز پزشک، بزرگداشت ابن‌سینا", category: "national", holiday: false },
  { m: 6, d: 4, title: "روز کارمند", category: "official", holiday: false },
  { m: 6, d: 5, title: "روز داروسازی، بزرگداشت زکریای رازی", category: "national", holiday: false },
  { m: 6, d: 13, title: "روز تعاون", category: "official", holiday: false },
  { m: 6, d: 27, title: "روز شعر و ادب فارسی، بزرگداشت شهریار", category: "national", holiday: false },
  { m: 6, d: 31, title: "روز سینما", category: "national", holiday: false },
  { m: 7, d: 5, title: "روز گردشگری", category: "national", holiday: false },
  { m: 7, d: 8, title: "روز بزرگداشت مولوی", category: "national", holiday: false },
  { m: 7, d: 13, title: "روز نیروی انتظامی", category: "official", holiday: false },
  { m: 7, d: 20, title: "روز بزرگداشت حافظ", category: "national", holiday: false },
  { m: 7, d: 24, title: "روز ملی پارالمپیک", category: "national", holiday: false },
  { m: 7, d: 26, title: "روز تربیت بدنی و ورزش", category: "official", holiday: false },
  { m: 8, d: 1, title: "روز آمار و برنامه‌ریزی", category: "official", holiday: false },
  { m: 8, d: 13, title: "روز دانش‌آموز", category: "official", holiday: false },
  { m: 8, d: 24, title: "روز کتاب و کتاب‌خوانی", category: "national", holiday: false },
  { m: 9, d: 5, title: "روز بسیج دانش‌آموزی", category: "official", holiday: false },
  { m: 9, d: 7, title: "روز نیروی دریایی", category: "official", holiday: false },
  { m: 9, d: 16, title: "روز دانشجو", category: "official", holiday: false },
  { m: 9, d: 30, title: "شب یلدا، جشن چله", category: "national", holiday: false },
  { m: 10, d: 5, title: "روز ملی ایمنی در برابر زلزله", category: "official", holiday: false },
  { m: 10, d: 20, title: "روز کشتی", category: "national", holiday: false },
  { m: 11, d: 12, title: "بازگشت امام خمینی، آغاز دههٔ فجر", category: "official", holiday: false },
  { m: 11, d: 19, title: "روز نیروی هوایی", category: "official", holiday: false },
  { m: 11, d: 22, title: "پیروزی انقلاب اسلامی", category: "official", holiday: true },
  { m: 11, d: 29, title: "روز اقتصاد مقاومتی و کارآفرینی", category: "official", holiday: false },
  { m: 12, d: 5, title: "روز مهندس، بزرگداشت خواجه نصیرالدین طوسی", category: "national", holiday: false },
  { m: 12, d: 15, title: "روز درختکاری", category: "national", holiday: false },
  { m: 12, d: 25, title: "روز بزرگداشت پروین اعتصامی", category: "national", holiday: false },
  { m: 12, d: 29, title: "روز ملی شدن صنعت نفت", category: "official", holiday: true },
];

const HIJRI_OCCASIONS: FixedOccasion[] = [
  { m: 1, d: 1, title: "آغاز سال قمری", category: "religious", holiday: false },
  { m: 1, d: 9, title: "تاسوعای حسینی", category: "religious", holiday: true },
  { m: 1, d: 10, title: "عاشورای حسینی", category: "religious", holiday: true },
  { m: 2, d: 20, title: "اربعین حسینی", category: "religious", holiday: true },
  { m: 2, d: 28, title: "رحلت پیامبر (ص) و شهادت امام حسن (ع)", category: "religious", holiday: true },
  { m: 2, d: 30, title: "شهادت امام رضا (ع)", category: "religious", holiday: true },
  { m: 3, d: 8, title: "شهادت امام حسن عسکری (ع)", category: "religious", holiday: true },
  { m: 3, d: 17, title: "میلاد پیامبر (ص) و امام صادق (ع)", category: "religious", holiday: true },
  { m: 6, d: 3, title: "شهادت حضرت فاطمه (س)", category: "religious", holiday: true },
  { m: 7, d: 13, title: "ولادت امام علی (ع)، روز پدر", category: "religious", holiday: true },
  { m: 7, d: 27, title: "مبعث پیامبر (ص)", category: "religious", holiday: true },
  { m: 8, d: 3, title: "ولادت امام حسین (ع)، روز پاسدار", category: "religious", holiday: false },
  { m: 8, d: 15, title: "ولادت امام زمان (عج)", category: "religious", holiday: true },
  { m: 9, d: 1, title: "آغاز ماه مبارک رمضان", category: "religious", holiday: false },
  { m: 9, d: 19, title: "ضربت خوردن امام علی (ع)", category: "religious", holiday: false },
  { m: 9, d: 21, title: "شهادت امام علی (ع)", category: "religious", holiday: true },
  { m: 9, d: 23, title: "شب قدر", category: "religious", holiday: false },
  { m: 10, d: 1, title: "عید سعید فطر", category: "religious", holiday: true },
  { m: 10, d: 2, title: "تعطیل به مناسبت عید فطر", category: "religious", holiday: true },
  { m: 10, d: 25, title: "شهادت امام صادق (ع)", category: "religious", holiday: true },
  { m: 12, d: 10, title: "عید سعید قربان", category: "religious", holiday: true },
  { m: 12, d: 18, title: "عید سعید غدیر خم", category: "religious", holiday: true },
];

const GREGORIAN_OCCASIONS: FixedOccasion[] = [
  { m: 1, d: 1, title: "آغاز سال میلادی", category: "national", holiday: false },
  { m: 3, d: 8, title: "روز جهانی زن", category: "national", holiday: false },
  { m: 4, d: 22, title: "روز جهانی زمین", category: "national", holiday: false },
  { m: 6, d: 5, title: "روز جهانی محیط زیست", category: "national", holiday: false },
  { m: 12, d: 10, title: "روز جهانی حقوق بشر", category: "national", holiday: false },
];

function isChaharshanbeSuriEve(anchor: Date, pm: number, pd: number, py: number): boolean {
  if (pm !== 12) return false;
  // Celebrated on the eve of the year's last Wednesday, i.e. the last Tuesday
  // of Esfand.
  if (anchor.getUTCDay() !== 2) return false;
  const { daysInMonth } = monthGrid("persian", py, 12);
  return pd + 7 > daysInMonth;
}

/** All occasions falling on the Tehran day represented by `anchor`. */
export function occasionsOf(anchor: Date): Occasion[] {
  const p = calOf(anchor, "persian");
  const h = calOf(anchor, "islamic-civil");
  const g = calOf(anchor, "gregorian");
  const out: Occasion[] = [];
  for (const o of PERSIAN_OCCASIONS) if (o.m === p.m && o.d === p.d) out.push(o);
  for (const o of HIJRI_OCCASIONS) if (o.m === h.m && o.d === h.d) out.push(o);
  for (const o of GREGORIAN_OCCASIONS) if (o.m === g.m && o.d === g.d) out.push(o);
  if (isChaharshanbeSuriEve(anchor, p.m, p.d, p.y)) {
    out.push({ title: "چهارشنبه‌سوری", category: "national", holiday: false });
  }
  return out;
}

export function filterOccasions(list: Occasion[], enabled: Set<OccasionCategory>): Occasion[] {
  return list.filter((o) => enabled.has(o.category));
}

export function isHolidayDay(anchor: Date, occasions: Occasion[]): boolean {
  // Fridays are the weekly public holiday in Iran.
  if (anchor.getUTCDay() === 5) return true;
  return occasions.some((o) => o.holiday);
}
