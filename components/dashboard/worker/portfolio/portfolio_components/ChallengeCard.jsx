import AnimBar from "./AnimBar";
import { IcCheck, IcClock, IcTrophy } from "./Icons";

export default function ChallengeCard({ ch, compact }) {
  const done = ch.status === "completed";

  return (
    <div className={`ch-card ${done ? "ch-done" : "ch-going"}`}>
      <div className="ch-stripe" />
      <div className="ch-inner">
        <div className="ch-head">
          <div className="ch-title-wrap">
            <span className={`ch-status-badge ${done ? "ch-sbadge-done" : "ch-sbadge-going"}`}>
              {done ? <><IcCheck /> Completed</> : <><IcClock /> In Progress</>}
            </span>
            <h4 className="ch-title">{ch.title}</h4>
          </div>
          <div className="ch-pts-wrap">
            <IcTrophy />
            <span className="ch-pts">{ch.pts} pts</span>
          </div>
        </div>
        {!compact && <p className="ch-desc">{ch.desc}</p>}
        <div className="ch-meta-row">
          <span className="ch-field-tag">{ch.tag}</span>
          <span className="ch-date">{ch.date}</span>
        </div>
        <div className="ch-prog-row">
          <div className="ch-prog-track">
            <AnimBar
              pct={ch.pct}
              color={done ? "#2DB8A0" : "#2D3F6B"}
              height={6}
            />
          </div>
          <span className="ch-prog-num">{ch.pct}%</span>
        </div>
      </div>
    </div>
  );
}