<<<<<<< HEAD
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
=======
import { Zodiac } from "@/lib/zodiac";

export default function ZodiacBadge({
  zodiac,
  size = 28,
  showLabel = true,
}: {
  zodiac: Zodiac;
  size?: number;
  showLabel?: boolean;
}) {
  return (
    <span className="zodiac" title={`برج ${zodiac.name} · ${zodiac.latin}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={zodiac.path} />
      </svg>
      {showLabel && (
        <span className="zodiac-text">
          برج {zodiac.name}
          <span className="zodiac-el">عنصر {zodiac.element}</span>
        </span>
      )}
    </span>
>>>>>>> 93fd0166cf5155c0a2dfd1bdfd40f13e4b8af7df
  );
}
