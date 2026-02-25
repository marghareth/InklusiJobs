"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthModalContext } from "@/components/landing/AuthModalContext";

export default function HeroSection() {
  const { openRoleSelector } = useAuthModalContext();

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-b from-transparent to-[#F7F6F4]" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 md:px-20 pt-24">
        <h1
          id="hero-heading"
          className="text-white font-['Lexend'] font-normal leading-[1.1] text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl"
        >
          Equal Opportunity<br />
          Starts with<br />
          Equal Access
        </h1>

        <p className="text-white/75 font-['Lexend'] text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
          InklusiJobs connects persons with disabilities to verified, inclusive employers — with the tools and support to grow your career.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {/* Same flow as Navbar "Get Started" → RoleSelector → AuthModal */}
          <button
            onClick={openRoleSelector}
            className="inline-flex items-center justify-center bg-[#0023FF] hover:bg-blue-700 text-white font-['Lexend'] font-semibold text-base px-8 py-3.5 rounded-xl transition-colors duration-200"
          >
            Get Started Free
          </button>
          <Link
            href="/find-work"
            className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white font-['Lexend'] font-semibold text-base px-8 py-3.5 rounded-xl backdrop-blur-sm transition-colors duration-200"
          >
            Browse Jobs →
          </Link>
        </div>

        <p className="text-white/50 font-['Lexend'] text-sm mt-8">
          Trusted by 500+ PWD job seekers and 120+ inclusive employers across the Philippines.
        </p>
      </div>
    </section>
  );
}