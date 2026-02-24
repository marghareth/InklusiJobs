import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1E293B] py-16 px-6 md:px-20" role="contentinfo">
      <div className="max-w-340 mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <p className="text-white text-xl font-semibold font-['Lexend'] mb-3">
              Inklusi<span className="text-blue-400">Jobs</span>
            </p>
            <p className="text-white/60 text-sm font-['Lexend'] leading-relaxed max-w-xs mb-4">
              Helping Persons with Disabilities become verified, job-ready professionals in the Philippines.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold bg-green-900/50 text-green-300 border border-green-700 rounded-full px-3 py-1">
                ✓ WCAG 2.1 AA
              </span>
              <span className="text-xs font-semibold bg-blue-900/50 text-blue-300 border border-blue-700 rounded-full px-3 py-1">
                🇵🇭 RA 7277 Aligned
              </span>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-white text-sm font-semibold font-['Lexend'] uppercase tracking-widest mb-4">
              Platform
            </h3>
            <ul className="space-y-2" role="list">
              {["Find Work", "For Employers", "Skill Challenges", "Portfolio", "Roadmap"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm font-['Lexend'] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-white text-sm font-semibold font-['Lexend'] uppercase tracking-widest mb-4">
              Company
            </h3>
            <ul className="space-y-2" role="list">
              {["About", "Learn", "Privacy Policy", "Terms of Service", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-white/60 text-sm font-['Lexend'] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm font-['Lexend']">
            © 2026 InklusiJobs · SDG 8 — Decent Work & Economic Growth
          </p>
          <p className="text-white/40 text-sm font-['Lexend']">
            Built with ♿ accessibility first
          </p>
        </div>
      </div>
    </footer>
  );
}