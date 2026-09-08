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
  );
}
