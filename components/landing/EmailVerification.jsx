"use client";

import { useState } from "react";

export default function EmailVerification({
  email = "example@gmail.com",
  onResend,
  onReturn,
}) {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const handleResend = () => {
    setResendDisabled(true);
    setResendMessage("Verification email resent!");

    if (onResend) onResend();

    setTimeout(() => {
      setResendDisabled(false);
      setResendMessage("");
    }, 60000);
  };

  return (
    <div className="w-full">
      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(
            135deg,
            #479880 0%,
            #4b959e 45%,
            #648fbf 80%
          );
        }
      `}</style>

      {/* Header with gradient */}
      <div className="gradient-bg text-white p-8 text-center rounded-t-2xl">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Email Verification</h2>
        <p className="text-white/90">
          A verification email has been sent to
          <br />
          <span className="font-semibold">{email}</span>
        </p>
      </div>

      {/* Body */}
      <div className="p-8 bg-[#f4f7f9]">
        <p className="text-[#1e293b] text-center mb-6">
          Click on the link to complete the verification process
        </p>

        {/* Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className="w-full py-3 px-4 bg-linear-to-r from-[#3d7b74] to-[#5fa8d3] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {resendDisabled ? "Email Sent" : "Resend Email"}
          </button>

          <button
            onClick={onReturn}
            className="w-full py-3 px-4 bg-[#eef2f7] text-[#1e293b] font-medium rounded-xl border border-[#e2e8f0] hover:bg-[#e2e8f0] transition-colors"
          >
            Return to Site
          </button>
        </div>

        {resendMessage && (
          <p className="text-center text-sm text-[#3d7b74]">{resendMessage}</p>
        )}

        {/* Help text */}
        <p className="text-center text-sm text-[#8891c9] mt-6">
          You can reach us if you have any questions
        </p>

        {/* Contact links */}
        <div className="flex justify-center gap-4 mt-2">
          <button className="text-[#7286d3] hover:text-[#479880] text-sm">
            Help Center
          </button>
          <span className="text-[#b8a4e3]">•</span>
          <button className="text-[#7286d3] hover:text-[#479880] text-sm">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
