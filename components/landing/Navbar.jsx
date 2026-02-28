"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

const NAV_LINKS = [
  { label: "Home",          href: "/" },
  { label: "Find Work",     href: "/find-work" },
  { label: "For Employers", href: "/employers" },
  { label: "Resources",     href: "/learn" },
  { label: "Our Mission",   href: "/about" },
];

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrolled,   setScrolled]    = useState(false);
  const [activeItem, setActiveItem]  = useState("Home");

  const { openRoleSelector, openSignIn } = useAuthModalContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = () => openSignIn();
    window.addEventListener("inklusijobs:open-modal", handler);
    return () => window.removeEventListener("inklusijobs:open-modal", handler);
  }, [openSignIn]);

  const handleNavClick = (label) => {
    setMenuOpen(false);
    setActiveItem(label);
  };

  return (
    <>
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-7xl z-50 transition-all duration-300`}>
        <div className={`bg-white rounded-2xl px-10 py-4 flex items-center justify-between transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.18)] border border-gray-100`}>

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setActiveItem("Home")}
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
          >
            <Image
              src="/images/logo.png"
              alt="InklusiJobs"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive   = activeItem === label;
              const isEmployer = label === "For Employers";
              const baseClass  = `relative px-4 py-2 rounded-lg text-base font-bold font-['Lexend'] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400`;

              if (isEmployer) {
                return (
                  <li key={label}>
                    <Link
                      href="/employers"
                      onClick={() => handleNavClick(label)}
                      aria-label="Learn about InklusiJobs for employers"
                      className={`${baseClass} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-800 hover:bg-slate-100 hover:text-slate-900"}`}
                    >
                      {label}
                      {isActive && <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-slate-800 rounded-full" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => handleNavClick(label)}
                    className={`${baseClass} ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    {label}
                    {isActive && <span className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-slate-800 rounded-full" aria-hidden="true" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => { openSignIn(); setMenuOpen(false); }}
              aria-label="Log in to your account"
              className="px-5 py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 text-base font-semibold font-['Lexend'] hover:bg-slate-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            >
              Log In
            </button>
            <button
              onClick={() => { openRoleSelector(); setMenuOpen(false); }}
              aria-label="Sign up for an account"
              className="px-5 py-2.5 bg-[#0F5C6E] hover:bg-[#0a4557] rounded-xl text-white text-base font-semibold font-['Lexend'] transition-all duration-200 shadow-[0_0_16px_rgba(15,92,110,0.4)] hover:shadow-[0_0_20px_rgba(15,92,110,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white border border-gray-100 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
            {NAV_LINKS.map(({ label, href }) => {
              const isEmployer = label === "For Employers";
              const isActive   = activeItem === label;

              if (isEmployer) {
                return (
                  <Link
                    key={label}
                    href="/employers"
                    onClick={() => handleNavClick(label)}
                    className={`px-3 py-2.5 rounded-xl text-base font-semibold font-['Lexend'] transition-colors ${isActive ? "bg-slate-100 text-slate-900" : "text-slate-800 hover:bg-slate-100"}`}
                    aria-label="Learn about InklusiJobs for employers"
                  >
                    {label}
                  </Link>
                );
              }

              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => handleNavClick(label)}
                  className={`px-3 py-2.5 rounded-xl text-base font-['Lexend'] transition-colors ${isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"}`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Mobile CTAs */}
            <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-gray-100">
              <button
                onClick={() => { openSignIn(); setMenuOpen(false); }}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-slate-700 text-sm font-medium font-['Lexend'] hover:bg-slate-50 transition-colors text-center"
              >
                Log In
              </button>
              <button
                onClick={() => { openRoleSelector(); setMenuOpen(false); }}
                className="w-full px-4 py-2.5 bg-[#0F5C6E] hover:bg-[#0a4557] rounded-xl text-white text-sm font-semibold font-['Lexend'] transition-colors text-center"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}