import AnimBar from "./AnimBar";
import { SKILL_COLORS } from "../utils/constants";

export default function SkillRow({ skill, i, compact }) {
  return (
    <div className="sk-row">
      <div className="sk-top">
        <div className="sk-left">
          <span className="sk-name">{skill.name}</span>
          {!compact && <span className="sk-tag">{skill.tag}</span>}
        </div>
        <span className="sk-pct">{skill.pct}%</span>
      </div>
      <AnimBar pct={skill.pct} color={SKILL_COLORS[i % SKILL_COLORS.length]} delay={i * 70} />
    </div>
  );
}