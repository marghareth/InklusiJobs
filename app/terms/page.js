import Link from "next/link";

export default function TermsOfUse() {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* Back Button Bar */}
        <div style={styles.backBar}>
          <Link href="/" style={styles.backButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.brand}>InklusiJobs</h1>
          <h2 style={styles.title}>Terms of Use</h2>
          <p style={styles.meta}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
        </div>

        <div style={styles.body}>

          <p style={styles.intro}>
            Welcome to InklusiJobs. By accessing or using our platform, you agree to be bound by
            these Terms of Use. Please read them carefully. If you do not agree, do not use
            InklusiJobs.
          </p>

          <Section title="1. About InklusiJobs">
            <p>
              InklusiJobs is an accessibility-first employment platform based in the Philippines
              that helps Persons with Disabilities (PWDs) build verified skills through personalized
              learning roadmaps, portfolio challenges, and AI-driven evaluation. We connect verified
              workers with employers who value inclusive hiring.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: "#0A2E38" }}>Contact:</strong> <span style={{ color: "#475569" }}>steviesummer612@gmail.com</span><br />
              <strong style={{ color: "#0A2E38" }}>Website:</strong>{" "}
              <a href="https://inklusijobs.vercel.app" style={styles.link}>https://inklusijobs.vercel.app</a>
            </p>
          </Section>

          <Section title="2. Eligibility">
            <ul style={styles.list}>
              <li>You must be at least 18 years old to use InklusiJobs</li>
              <li>You must be a human — automated account creation is not permitted</li>
              <li>You must provide accurate and truthful information when registering</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
            </ul>
          </Section>

          <Section title="3. User Accounts">
            <ul style={styles.list}>
              <li>You may only create one account per person</li>
              <li>You are responsible for all activity that occurs under your account</li>
              <li>You must notify us immediately at steviesummer612@gmail.com if you suspect unauthorized access to your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
            </ul>
          </Section>

          <Section title="4. Worker Accounts">
            <p>As a worker on InklusiJobs, you agree to:</p>
            <ul style={styles.list}>
              <li>Submit only your own original work for challenge evaluations</li>
              <li>Not misrepresent your skills, experience, or disability status</li>
              <li>Not attempt to manipulate or game the AI evaluation system</li>
              <li>Keep your profile information accurate and up to date</li>
              <li>Understand that AI evaluation scores are automated and may not be perfect — you may appeal by contacting us</li>
            </ul>
          </Section>

          <Section title="5. Employer Accounts">
            <p>As an employer on InklusiJobs, you agree to:</p>
            <ul style={styles.list}>
              <li>Post only genuine, available job opportunities</li>
              <li>Not discriminate against workers based on their disability type</li>
              <li>Respect workers' privacy — do not contact workers outside of the platform without their consent</li>
              <li>Comply with Philippine labor laws including the Magna Carta for Disabled Persons (RA 7277)</li>
              <li>Not use worker data for any purpose other than recruitment</li>
            </ul>
          </Section>

          <Section title="6. Notion Integration">
            <p>
              InklusiJobs offers an optional Notion integration that creates a personal tracker
              page in your own Notion workspace. By connecting your Notion account:
            </p>
            <ul style={styles.list}>
              <li>You authorize InklusiJobs to create and update a tracker page in your Notion workspace</li>
              <li>You understand that InklusiJobs will write your challenge progress and scores to this page automatically</li>
              <li>You can disconnect this integration at any time from your dashboard settings</li>
              <li>InklusiJobs will not read, modify, or delete any other content in your Notion workspace</li>
              <li>Notion's own Terms of Service also apply to your Notion account</li>
            </ul>
          </Section>

          <Section title="7. Intellectual Property">
            <SubHeading>Your Content</SubHeading>
            <p>
              You retain ownership of all work you submit as portfolio challenges. By submitting,
              you grant InklusiJobs a limited, non-exclusive license to display your work on your
              public portfolio (if you choose to make it public) and to use it for AI evaluation
              purposes.
            </p>
            <SubHeading>Our Content</SubHeading>
            <p style={{ marginTop: 12 }}>
              All platform content — including the InklusiJobs name, logo, challenge designs,
              roadmap templates, and software — is owned by InklusiJobs. You may not copy,
              reproduce, or redistribute our content without written permission.
            </p>
          </Section>

          <Section title="8. AI Evaluation">
            <ul style={styles.list}>
              <li>Challenge submissions are evaluated by an AI system — results are automated and may occasionally be imperfect</li>
              <li>AI scores and feedback are provided for educational purposes to help you improve</li>
              <li>You may resubmit challenges to improve your score</li>
              <li>We do not guarantee that AI evaluations are error-free</li>
              <li>Attempting to manipulate, deceive, or jailbreak the AI evaluation system is strictly prohibited and may result in account suspension</li>
            </ul>
          </Section>

          <Section title="9. Prohibited Conduct">
            <p>You must not:</p>
            <ul style={styles.list}>
              <li>Use InklusiJobs for any unlawful purpose</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Submit false, misleading, or plagiarized content</li>
              <li>Attempt to access other users' accounts or data</li>
              <li>Use bots, scrapers, or automated tools to interact with the platform</li>
              <li>Reverse engineer, decompile, or tamper with the platform's code or systems</li>
              <li>Post spam, advertisements, or irrelevant content</li>
              <li>Impersonate another person or organization</li>
            </ul>
          </Section>

          <Section title="10. Disability Data and Non-Discrimination">
            <p>InklusiJobs is built for Persons with Disabilities. We are committed to:</p>
            <ul style={styles.list}>
              <li>Treating all users with dignity and respect regardless of disability type</li>
              <li>Never using disability information to discriminate or limit opportunities</li>
              <li>Maintaining WCAG 2.1 AA accessibility standards across the platform</li>
              <li>Complying with the Magna Carta for Disabled Persons (RA 7277) and the Philippine Data Privacy Act (RA 10173)</li>
            </ul>
          </Section>

          <Section title="11. Disclaimers">
            <ul style={styles.list}>
              <li>InklusiJobs is provided "as is" — we do not guarantee uninterrupted or error-free service</li>
              <li>We do not guarantee employment outcomes — we provide tools and verification, not job placement guarantees</li>
              <li>AI-generated roadmaps and evaluations are tools to guide your learning, not professional career advice</li>
              <li>Third-party services (Notion, Supabase, Google) operate under their own terms and we are not responsible for their availability or actions</li>
            </ul>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              To the maximum extent permitted by Philippine law, InklusiJobs and its team shall
              not be liable for any indirect, incidental, or consequential damages arising from
              your use of the platform, including but not limited to loss of data, loss of
              employment opportunities, or service interruptions.
            </p>
          </Section>

          <Section title="13. Termination">
            <ul style={styles.list}>
              <li>You may delete your account at any time from your account settings</li>
              <li>We may suspend or terminate your account if you violate these Terms</li>
              <li>Upon termination, your personal data will be deleted within 30 days per our Privacy Policy</li>
              <li>Sections 7, 11, and 12 survive termination</li>
            </ul>
          </Section>

          <Section title="14. Changes to These Terms">
            <p>
              We may update these Terms from time to time. We will notify you of significant
              changes by email or by displaying a notice on the platform at least 7 days before
              the changes take effect. Continued use of InklusiJobs after changes means you
              accept the updated Terms.
            </p>
          </Section>

          <Section title="15. Governing Law">
            <p>
              These Terms are governed by the laws of the Republic of the Philippines. Any
              disputes shall be resolved under Philippine jurisdiction. Users outside the
              Philippines access InklusiJobs voluntarily and are responsible for compliance
              with their local laws.
            </p>
          </Section>

          <Section title="16. Contact Us">
            <p>For any questions about these Terms:</p>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: "#0A2E38" }}>InklusiJobs</strong><br />
              Email: <a href="mailto:steviesummer612@gmail.com" style={styles.link}>steviesummer612@gmail.com</a><br />
              Website: <a href="https://inklusijobs.vercel.app" style={styles.link}>https://inklusijobs.vercel.app</a><br />
              Philippines
            </p>
          </Section>

          {/* Bottom back button */}
          <div style={{ textAlign: "center", paddingTop: 16, paddingBottom: 8 }}>
            <Link href="/" style={styles.backButtonBottom}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Home
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={{ margin: 0 }}>© 2025 InklusiJobs. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
            <span style={{ color: "rgba(125,220,232,0.3)" }}>·</span>
            <a href="/terms" style={styles.footerLink}>Terms of Use</a>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontSize: 17,
        fontWeight: 700,
        color: "#0A2E38",
        marginBottom: 12,
        paddingBottom: 10,
        borderBottom: "1px solid #e2e8f0",
        fontFamily: "'Lexend', sans-serif",
      }}>
        {title}
      </h3>
      <div style={{ color: "#475569", fontSize: 15, lineHeight: 1.75, fontFamily: "'Lexend', sans-serif" }}>
        {children}
      </div>
    </div>
  );
}

function SubHeading({ children }) {
  return (
    <p style={{
      fontWeight: 600,
      color: "#0A7A8F",
      marginTop: 14,
      marginBottom: 6,
      fontFamily: "'Lexend', sans-serif",
    }}>
      {children}
    </p>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "40px 20px",
    fontFamily: "'Lexend', 'Inter', sans-serif",
  },
  wrapper: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  backBar: {
    background: "#0A2E38",
    borderBottom: "1px solid rgba(125,220,232,0.1)",
    padding: "12px 32px",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    color: "#7DDCE8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'Lexend', sans-serif",
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid rgba(125,220,232,0.25)",
    background: "rgba(125,220,232,0.06)",
    transition: "all 0.15s",
  },
  backButtonBottom: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#071E26",
    background: "#7DDCE8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Lexend', sans-serif",
    padding: "11px 28px",
    borderRadius: 10,
    transition: "background 0.15s",
  },
  header: {
    background: "linear-gradient(135deg, #0D3D4D 0%, #0A2E38 100%)",
    borderBottom: "1px solid rgba(125,220,232,0.12)",
    padding: "40px 48px",
    textAlign: "center",
  },
  brand: {
    fontSize: 13,
    fontWeight: 700,
    color: "#7DDCE8",
    letterSpacing: "0.15em",
    margin: "0 0 12px",
    fontFamily: "'Lexend', sans-serif",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "#E0F8FA",
    margin: "0 0 10px",
    fontFamily: "'Lexend', sans-serif",
  },
  meta: {
    fontSize: 13,
    color: "rgba(125,220,232,0.6)",
    margin: 0,
    fontFamily: "'Lexend', sans-serif",
  },
  body: {
    padding: "40px 48px",
  },
  intro: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 1.8,
    marginBottom: 32,
    padding: "16px 20px",
    background: "#f0f9fb",
    borderLeft: "3px solid #7DDCE8",
    borderRadius: "0 8px 8px 0",
    fontFamily: "'Lexend', sans-serif",
  },
  list: {
    paddingLeft: 20,
    margin: "8px 0",
    color: "#475569",
    fontSize: 15,
    lineHeight: 2,
    fontFamily: "'Lexend', sans-serif",
  },
  link: {
    color: "#0A7A8F",
    fontWeight: 600,
    textDecoration: "none",
  },
  footer: {
    background: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
    padding: "20px 48px",
    textAlign: "center",
    fontSize: 13,
    color: "#94a3b8",
    fontFamily: "'Lexend', sans-serif",
  },
  footerLinks: {
    marginTop: 8,
    display: "flex",
    justifyContent: "center",
    gap: 12,
    alignItems: "center",
  },
  footerLink: {
    color: "#0A7A8F",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: 13,
  },
};