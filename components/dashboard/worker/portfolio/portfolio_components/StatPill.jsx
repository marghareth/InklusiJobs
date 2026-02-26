export default function StatPill({ n, label, accent }) {
  return (
    <div className="stat-pill" style={{ "--acc": accent }}>
      <span className="stat-pill-n">{n}</span>
      <span className="stat-pill-l">{label}</span>
    </div>
  );
}