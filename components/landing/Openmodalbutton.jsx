"use client";

/**
 * OpenModalButton.jsx
 * A lightweight client component that fires the inklusijobs:open-modal event.
 * Use this inside server-rendered pages (About, Learn, ForEmployers, FindWork)
 * so CTAs can still open the auth modal without making the whole page a client component.
 *
 * Usage:
 *   <OpenModalButton style={...} className={...}>Join InklusiJobs →</OpenModalButton>
 */

export default function OpenModalButton({ children, className, style, tab = "signup" }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("inklusijobs:open-modal", { detail: { tab } }));
  };

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}