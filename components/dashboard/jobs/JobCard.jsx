'use client';

import { Ic } from './Icons';
import { PWD_TYPES, USER_PROFILE } from './jobsData';

export default function JobCard({ job, expanded, onToggle, saved, onSave, score }) {
  const isTop = score >= 4;
  const isGood = score >= 2 && !isTop;

  return (
    <div className={`jc ${isTop ? "jc-top" : ""} ${expanded ? "jc-open" : ""}`}>
      {isTop && <div className="jc-badge jc-badge-top">Top Match</div>}
      {isGood && <div className="jc-badge jc-badge-good">Good Match</div>}
      {job.urgent && (
        <div className={`jc-urgent ${isTop || isGood ? "jc-urgent-shift" : ""}`}>
          Urgent
        </div>
      )}

      <div className="jc-header">
        <div className="jc-logo" style={{
          background:`${job.logoColor}1a`,
          color:job.logoColor,
          border:`1.5px solid ${job.logoColor}33`
        }}>
          {job.logo}
        </div>
        <div className="jc-mid">
          <div className="jc-pos">{job.position}</div>
          <div className="jc-co">
            {job.company}
            {job.verified && (
              <span className="jc-verified">
                <Ic.Check />Verified
              </span>
            )}
          </div>
        </div>
        <div className="jc-right">
          <div className="jc-sal">{job.salary}</div>
          <div className="jc-age">{job.posted}</div>
        </div>
      </div>

      <div className="jc-tags">
        <span className="jc-tag jc-tag-s">{job.setup}</span>
        <span className="jc-tag jc-tag-t">{job.type}</span>
        <span className="jc-tag jc-tag-l">
          <Ic.Pin />{job.location}
        </span>
      </div>

      <div className="jc-pwd">
        <span className="jc-pwd-lbl">PWD-Friendly:</span>
        <div className="jc-pwd-chips">
          {job.pwdFriendly.map(p => {
            const t = PWD_TYPES.find(x => x.id === p);
            return (
              <span 
                key={p} 
                className={`jc-chip ${p === USER_PROFILE.disability ? "jc-chip-hl" : ""}`}
              >
                {t?.label}
              </span>
            );
          })}
        </div>
      </div>

      <p className="jc-desc">{job.description}</p>

      <div className="jc-foot">
        <button className="jc-expand" onClick={onToggle}>
          {expanded ? "Hide details ↑" : "View full details ↓"}
        </button>
        <button 
          className={`jc-save ${saved ? "jc-saved" : ""}`} 
          onClick={onSave}
        >
          <Ic.Bookmark f={saved} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {expanded && (
        <div className="jc-expand-body">
          <div className="jc-grid">
            <div className="jc-sect">
              <div className="jc-sect-t">Requirements</div>
              <ul className="jc-ul">
                {job.requirements.map(r => <li key={r}>{r}</li>)}
              </ul>
            </div>
            <div className="jc-sect">
              <div className="jc-sect-t">Accommodations Provided</div>
              <ul className="jc-ul jc-ul-green">
                {job.accommodations.map(a => (
                  <li key={a}>
                    <Ic.Check />{a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="jc-sect jc-sect-full">
              <div className="jc-sect-t">Contact & Address</div>
              <div className="jc-contacts">
                <div className="jc-ct">
                  <Ic.Mail />
                  <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
                </div>
                <div className="jc-ct">
                  <Ic.Phone />{job.contactPhone}
                </div>
                <div className="jc-ct">
                  <Ic.Pin />{job.address}
                </div>
              </div>
            </div>
          </div>
          <div className="jc-actions">
            <button className="jc-apply">Apply Now →</button>
            <button 
              className={`jc-save-lg ${saved ? "jc-saved" : ""}`} 
              onClick={onSave}
            >
              <Ic.Bookmark f={saved} />
              {saved ? "Saved" : "Save Job"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}