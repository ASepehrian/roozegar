"use client";

import type { Zodiac } from "@/lib/zodiac";

export default function ZodiacBadge({ zodiac, size = 22 }: { zodiac: Zodiac; size?: number }) {
  return (
    <span className="zodiac" title={`${zodiac.latin} · ${zodiac.element}`}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={zodiac.path} />
      </svg>
      <span className="zodiac-text"><span>{zodiac.name}</span><span className="zodiac-el">{zodiac.latin}</span></span>
    </span>
  );
}
