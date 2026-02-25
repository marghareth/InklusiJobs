"use client";

import { useState } from "react";

export default function WelcomeEmployer({ name = "your company", onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(30, 41, 59, 0.8)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Message Card */}
      <div
        className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl animate-fadeIn"
        style={{ backgroundColor: "white" }}
      >
        {/* Top Gradient Bar - Employer colors */}
        <div
          className="h-2 w-full"
          style={{
            background:
              "linear-gradient(135deg, #3d7b74 0%, #5fa8d3 50%, #7286d3 100%)",
          }}
        ></div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon Circle */}
          <div className="flex justify-center mb-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #3d7b74 0%, #5fa8d3 50%, #7286d3 100%)",
              }}
            >
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1e293b" }}>
            Welcome to InklusiJobs, {name}!
          </h2>

          <p className="text-lg mb-6" style={{ color: "#4b959e" }}>
            Thank you for joining us in building an inclusive workforce.
          </p>

          {/* Decorative Element */}
          <div className="flex justify-center gap-2 mb-6">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#3d7b74" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#5fa8d3" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#7286d3" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#b8a4e3" }}
            ></span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #3d7b74 0%, #5fa8d3 50%, #7286d3 100%)",
            }}
          >
            Get Started
          </button>

          {/* Footer */}
          <p className="text-xs mt-6" style={{ color: "#8891c9" }}>
            ✨ Built by SHE++ with 💙
          </p>
        </div>

        {/* Close X button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: "#eef2f7", color: "#1e293b" }}
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
