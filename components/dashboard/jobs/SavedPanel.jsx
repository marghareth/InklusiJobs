'use client';

import { Ic } from './Icons';
import { JOB_LISTINGS, PWD_TYPES, USER_PROFILE } from './data/jobsData';

export default function SavedPanel({ savedIds, onClose, full, setFull, onUnsave }) {
  const jobs = JOB_LISTINGS.filter(j => savedIds.includes(j.id));

  return (
    <div className={`sj-panel ${full ? "sj-full" : ""}`}>
      <div className="sj-header">
        <div className="sj-title">
          <span style={{color:"var(--gold)"}}>
            <Ic.Bookmark f={true} />
          </span>
          Saved Jobs
          <span className="sj-badge">{jobs.length}</span>
        </div>
        <div className="sj-hdr-btns">
          <button 
            className="sj-ibtn" 
            onClick={() => setFull(!full)} 
            title={full ? "Collapse" : "Expand"}
          >
            {full ? <Ic.Minimize /> : <Ic.Maximize />}
          </button>
          <button className="sj-ibtn" onClick={onClose}>
            <Ic.X />
          </button>
        </div>
      </div>

      <div className="sj-body">
        {jobs.length === 0 ? (
          <div className="sj-empty">
            <div style={{opacity:.4,marginBottom:".5rem"}}>
              <Ic.Bookmark f={false} />
            </div>
            <div className="sj-empty-t">No saved jobs yet</div>
            <div className="sj-empty-s">
              Click Save on any listing to bookmark it here
            </div>
          </div>
        ) : (
          <div className="sj-list">
            {jobs.map(job => (
              <div key={job.id} className="sj-item">
                <div className="sj-logo" style={{
                  background:`${job.logoColor}20`,
                  color:job.logoColor
                }}>
                  {job.logo}
                </div>
                <div className="sj-info">
                  <div className="sj-pos">{job.position}</div>
                  <div className="sj-co">{job.company}</div>
                  <div className="sj-meta">
                    <span className="sj-mtag">{job.setup}</span>
                    <span className="sj-sal">{job.salary}</span>
                  </div>
                  
                  {full && (
                    <>
                      <div className="sj-loc">
                        <Ic.Pin />{job.location}
                      </div>
                      <div className="sj-pwd-row">
                        {job.pwdFriendly.map(p => {
                          const t = PWD_TYPES.find(x => x.id === p);
                          return (
                            <span 
                              key={p} 
                              className={`sj-pc ${p === USER_PROFILE.disability ? "hl" : ""}`}
                            >
                              {t?.label}
                            </span>
                          );
                        })}
                      </div>
                      <p className="sj-desc">{job.description}</p>
                      <div className="sj-contacts">
                        <span><Ic.Mail />{job.contactEmail}</span>
                        <span><Ic.Phone />{job.contactPhone}</span>
                        <span><Ic.Pin />{job.address}</span>
                      </div>
                    </>
                  )}
                  
                  <div className="sj-actions">
                    <button className="sj-apply">Apply →</button>
                    <button 
                      className="sj-remove" 
                      onClick={() => onUnsave(job.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}