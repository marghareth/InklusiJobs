"use client";

import { useState } from "react";

export default function WelcomeWorker({ name = "there", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Message Card */}
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "white", maxWidth: 560 }}
      >
        {/* Top Gradient Bar */}
        <div
          className="h-2 w-full"
          style={{
            background:
              "linear-gradient(135deg, #479880 0%, #4b959e 50%, #648fbf 100%)",
          }}
        />

        {/* Content */}
        <div style={{ padding: "52px 56px 48px", textAlign: "center" }}>

          {/* Icon Circle */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 88, height: 88, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #479880 0%, #4b959e 50%, #648fbf 100%)",
                boxShadow: "0 8px 24px rgba(75,149,158,0.35)",
              }}
            >
              <svg width={48} height={48} fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            Welcome to InklusiJobs,<br />{name}!
          </h2>

          {/* Subtitle */}
          <p style={{ fontSize: 16, color: "#4b959e", margin: "0 0 32px", lineHeight: 1.6 }}>
            Your journey to meaningful employment starts here.
          </p>

          {/* Decorative dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 36 }}>
            {["#479880", "#5fa8d3", "#7286d3", "#b8a4e3"].map((c) => (
              <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            style={{
              padding: "14px 48px", borderRadius: 14, fontWeight: 700, fontSize: 16,
              color: "#fff", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #479880 0%, #4b959e 50%, #648fbf 100%)",
              boxShadow: "0 6px 20px rgba(75,149,158,0.4)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(75,149,158,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(75,149,158,0.4)"; }}
          >
            Get Started
          </button>

          {/* Footer */}
          <p style={{ fontSize: 12, color: "#8891c9", marginTop: 24, marginBottom: 0 }}>
            ✨ Built by SHE++ with 💙
          </p>
        </div>

        {/* Close X */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 36, height: 36, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#eef2f7", border: "none", cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#dde3ec"}
          onMouseLeave={e => e.currentTarget.style.background = "#eef2f7"}
          aria-label="Close"
        >
          <svg width={16} height={16} fill="none" stroke="#1e293b" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}