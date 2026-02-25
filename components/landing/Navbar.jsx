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
      <nav className="absolute top-10 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-50">
        <div className="bg-[#1E293B] rounded-xl px-6 py-4 flex items-center justify-between backdrop-blur-xl">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
          >
            <span className="text-white text-lg font-semibold font-['Lexend']">
              Inklusi<span className="text-blue-400">Jobs</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-6" role="list">
            {["Home", "Find Work", "For Employers", "Learn", "About"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={
                      item === "Home"
                        ? "/"
                        : `/${item.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-[#FAF9F8] text-base font-normal font-['Lexend'] leading-tight hover:text-blue-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-1"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogIn}
              className="w-32 px-4 py-2.5 bg-[#0023FF] rounded-xl text-white text-sm font-medium font-['Roboto'] uppercase tracking-tight text-center hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Log In
            </button>
            <button
              onClick={handleGetStarted}
              className="w-32 px-4 py-2.5 bg-white rounded-xl text-[#232F74] text-sm font-medium font-['Roboto'] uppercase tracking-tight text-center hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#232F74]"
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-2 bg-[#1E293B] rounded-xl px-6 py-4 flex flex-col gap-4">
            {["Home", "Find Work", "For Employers", "Learn", "About"].map(
              (item) => (
                <Link
                  key={item}
                  href={
                    item === "Home"
                      ? "/"
                      : `/${item.toLowerCase().replace(" ", "-")}`
                  }
                  className="text-[#FAF9F8] text-lg font-['Lexend'] hover:text-blue-300 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </Link>
              ),
            )}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-600">
              <button
                onClick={handleLogIn}
                className="w-full px-4 py-2.5 bg-[#0023FF] rounded-xl text-white text-sm font-medium font-['Roboto'] uppercase text-center"
              >
                Log In
              </button>
              <button
                onClick={handleGetStarted}
                className="w-full px-4 py-2.5 bg-white rounded-xl text-[#232F74] text-sm font-medium font-['Roboto'] uppercase text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      <RoleSelector
        isOpen={roleOpen}
        onClose={closeAll}
        onSelectRole={handleRoleSelect}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={closeAll}
        defaultTab={authTab}
        role={selectedRole}
      />
    </>
  );
}
