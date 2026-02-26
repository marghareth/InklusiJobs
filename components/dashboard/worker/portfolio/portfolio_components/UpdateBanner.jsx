import { IcBell, IcX } from "./Icons";

export default function UpdateBanner({ lastUpdated, prevUpdate, onDismiss }) {
  return (
    <div className="pf-banner">
      <div className="pf-banner-l">
        <span className="pf-banner-ico"><IcBell /></span>
        <div className="pf-banner-text">
          <strong>Portfolio updated</strong> — {lastUpdated}
          <span className="pf-banner-prev">Previous update: {prevUpdate}</span>
        </div>
      </div>
      <button className="pf-banner-dismiss" onClick={onDismiss}>
        <IcX />
      </button>
    </div>
  );
}