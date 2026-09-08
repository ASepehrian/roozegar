import { Couplet } from "@/lib/poems";

export default function PoemCard({ couplet }: { couplet: Couplet }) {
  return (
    <div className="card poem">
      <div className="card-head">
        <span className="card-title">بیت امروز</span>
        <span className="poet">{couplet.poet}</span>
      </div>
      <p className="poem-line">{couplet.first}</p>
      <p className="poem-line">{couplet.second}</p>
    </div>
  );
}
