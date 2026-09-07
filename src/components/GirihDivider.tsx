export default function GirihDivider() {
  return (
    <div className="motif" aria-hidden="true">
      <svg viewBox="0 0 400 14" preserveAspectRatio="none">
        <defs>
          <pattern id="girih" width="20" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7 L5 0 L10 7 L5 14 Z" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <path d="M10 7 L15 0 L20 7 L15 14 Z" fill="none" stroke="var(--teal)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="14" fill="url(#girih)" />
      </svg>
    </div>
  );
}
