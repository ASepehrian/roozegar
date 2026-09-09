"use client";

import { zodiacOfPersianMonth } from "@/lib/zodiac";

export default function ZodiacBadge({ month }: { month: number }) {
  const z = zodiacOfPersianMonth(month);
  return (
    <span className="zodiac" title={`${z.latin} · ${z.element}`}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={z.path} />
      </svg>
      <span className="zodiac-text"><span>{z.name}</span><span className="zodiac-el">{z.latin}</span></span>
    </span>
  );
}
