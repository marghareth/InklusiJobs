"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import RoleSelector from "./RoleSelector";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState("signin");
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const handler = () => {
      setSelectedRole(null);
      setAuthTab("signin");
      setAuthOpen(true);
    };
    window.addEventListener("inklusijobs:open-modal", handler);
    return () => window.removeEventListener("inklusijobs:open-modal", handler);
  }, []);

  const handleLogIn = () => {
    setSelectedRole(null);
    setAuthTab("signin");
    setAuthOpen(true);
    setMenuOpen(false);
  };

  const handleGetStarted = () => {
    setRoleOpen(true);
    setMenuOpen(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRoleOpen(false);
    setAuthTab("signup");
    setAuthOpen(true);
  };

  const closeAll = () => {
    setRoleOpen(false);
    setAuthOpen(false);
  };

  return (
    <>
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-50">
        <div
          className="rounded-2xl px-6 py-2 flex items-center justify-between"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 2px 24px rgba(15,92,110,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E] rounded-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.png"
              alt="InklusiJobs logo"
              style={{ height: "35px", width: "auto" }}
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-2" role="list">
            {["Home", "Find Work", "For Employers", "Learn", "About"].map((item) => (
              <li key={item}>
                <Link
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-[#0F5C6E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E] rounded-md px-3 py-2"
                  style={{
                    color: "#1A3A5C",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "15px",
                    fontWeight: "700",
                    display: "block",
                  }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogIn}
              className="px-5 py-2.5 rounded-xl border transition-all hover:bg-[#0F5C6E] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E]"
              style={{
                borderColor: "#0F5C6E",
                color: "#0F5C6E",
                background: "transparent",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              Log In
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2.5 rounded-xl transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E]"
              style={{
                background: "#0F5C6E",
                color: "#FFFFFF",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F5C6E] rounded-md p-1"
            style={{ color: "#1A3A5C" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden mt-2 rounded-2xl px-6 py-4 flex flex-col gap-4"
            style={{ background: "#FFFFFF", boxShadow: "0 4px 24px rgba(15,92,110,0.12)" }}
          >
            {["Home", "Find Work", "For Employers", "Learn", "About"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
                className="hover:text-[#0F5C6E] transition-colors"
                style={{
                  color: "#1A3A5C",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2" style={{ borderTop: "1px solid #E8EDF3" }}>
              <button
                onClick={handleLogIn}
                className="w-full px-4 py-2.5 rounded-xl border"
                style={{
                  borderColor: "#0F5C6E",
                  color: "#0F5C6E",
                  background: "transparent",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Log In
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full px-4 py-2.5 rounded-xl"
                style={{
                  background: "#0F5C6E",
                  color: "#FFFFFF",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <RoleSelector isOpen={roleOpen} onClose={closeAll} onSelectRole={handleRoleSelect} />
      <AuthModal isOpen={authOpen} onClose={closeAll} defaultTab={authTab} role={selectedRole} />
    </>
  );
}