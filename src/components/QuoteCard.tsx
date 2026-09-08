import { Couplet } from "@/lib/quotes";

export default function QuoteCard({ couplet }: { couplet: Couplet }) {
  return (
    <div className="card quote-card">
      <div className="quote-lines">
        <div>{couplet.lines[0]}</div>
        <div>{couplet.lines[1]}</div>
      </div>
      <div className="quote-poet">— {couplet.poet}</div>
    </div>
  );
}
