"use client";

import { useAuthModalContext } from "@/components/landing/AuthModalContext";

export default function OpenModalButton({ children, variant = "worker", className, style }) {
  const { openAsWorker, openAsEmployer, openRoleSelector } = useAuthModalContext();

  const handleClick = () => {
    if (variant === "worker")   openAsWorker?.() ?? openRoleSelector();
    if (variant === "employer") openAsEmployer?.() ?? openRoleSelector();
    if (variant === "selector") openRoleSelector();
  };

  return (
    <button onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}