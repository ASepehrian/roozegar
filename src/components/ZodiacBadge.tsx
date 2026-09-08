import { ZodiacSign } from "@/lib/zodiac";

export default function ZodiacBadge({ sign, size = 28 }: { sign: ZodiacSign; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={sign.name}>
      <circle cx="12" cy="12" r="11" fill="none" stroke="var(--gold)" strokeWidth="1" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="13"
        fill="var(--gold)"
        fontFamily="Vazirmatn, sans-serif"
      >
        {sign.glyph}
      </text>
    </svg>
  );
}
