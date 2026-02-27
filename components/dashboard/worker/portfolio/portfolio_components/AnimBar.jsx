import { useState, useEffect } from "react";

export default function AnimBar({ pct, color = "#2DB8A0", delay = 0, height = 8 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div style={{ height, background: "rgba(26,39,68,0.10)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${w}%`,
        background: color,
        borderRadius: 999,
        transition: `width .8s cubic-bezier(.4,0,.2,1) ${delay}ms`
      }} />
    </div>
  );
}