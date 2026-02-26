export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.brand}>InklusiJobs</h1>
          <h2 style={styles.title}>Privacy Policy</h2>
          <p style={styles.meta}>Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: January 1, 2025</p>
        </div>

        <div style={styles.body}>

          <p style={styles.intro}>
            InklusiJobs ("we", "our", or "us") is committed to protecting the privacy of our users,
            especially Persons with Disabilities (PWDs) who use our platform to build skills and find
            employment opportunities. This Privacy Policy explains what information we collect, how we
            use it, and your rights regarding your personal data.
          </p>

          <Section title="1. Who We Are">
            <p>
              InklusiJobs is an accessibility-first employment platform based in the Philippines,
              designed to help Persons with Disabilities become verified, job-ready professionals
              through personalized learning paths, portfolio-based challenges, and AI-driven skill
              verification.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>Contact:</strong> steviesummer612@gmail.com<br />
              <strong>Website:</strong> https://inklusijobs.vercel.app
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <SubHeading>2.1 Information You Provide</SubHeading>
            <ul style={styles.list}>
              <li>Name, email address, and password when you create an account</li>
              <li>Professional profile information (headline, bio, skills, availability)</li>
              <li>Disability type and accessibility preferences (optional — you choose what to share)</li>
              <li>Portfolio work, challenge submissions, and uploaded files</li>
              <li>Communication preferences and notification settings</li>
            </ul>
            <SubHeading>2.2 Information Collected Automatically</SubHeading>
            <ul style={styles.list}>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Device and browser information</li>
              <li>IP address and approximate location</li>
              <li>Challenge submission timestamps and evaluation results</li>
            </ul>
            <SubHeading>2.3 Third-Party Integrations</SubHeading>
            <ul style={styles.list}>
              <li><strong>Notion:</strong> If you choose to connect your Notion account, we access your Notion workspace solely to create and update your personal tracker page. We do not read, store, or share any other content from your Notion workspace.</li>
              <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your name and email address only.</li>
              <li><strong>Supabase:</strong> We use Supabase to securely store your account data and files.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul style={styles.list}>
              <li>To create and manage your account</li>
              <li>To generate your personalized learning roadmap using AI</li>
              <li>To evaluate your challenge submissions and provide feedback</li>
              <li>To build and display your public portfolio (if you choose to make it public)</li>
              <li>To match your verified skills with employer job listings</li>
              <li>To sync your progress to your connected Notion workspace (if you opt in)</li>
              <li>To send notifications about your submissions, reviews, and job opportunities</li>
              <li>To improve the platform and fix issues</li>
            </ul>
          </Section>

          <Section title="4. Sensitive Information — Disability Data">
            <p>
              We treat disability-related information with the highest level of care. Disclosing your
              disability type and accessibility needs is <strong>entirely optional</strong>. This
              information is used solely to:
            </p>
            <ul style={styles.list}>
              <li>Adapt the platform interface to your accessibility needs (WCAG 2.1 AA)</li>
              <li>Provide more relevant job and resource recommendations</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              We will never share your disability information with employers or third parties without
              your explicit written consent. You can update or remove this information at any time
              from your profile settings.
            </p>
          </Section>

          <Section title="5. Notion Integration — Your Data">
            <p>
              When you connect your Notion account through InklusiJobs:
            </p>
            <ul style={styles.list}>
              <li>We create a personal tracker page inside <strong>your own Notion workspace</strong></li>
              <li>We write your challenge progress, scores, and roadmap phases to that page</li>
              <li>We store a Notion access token in our database to enable automatic updates</li>
              <li>We do <strong>not</strong> read any other pages or content in your Notion workspace</li>
              <li>You can disconnect Notion at any time from your dashboard settings</li>
              <li>Disconnecting revokes our access immediately</li>
            </ul>
          </Section>

          <Section title="6. Data Sharing">
            <p>We do not sell your personal data. We only share data in these limited cases:</p>
            <ul style={styles.list}>
              <li><strong>Employers:</strong> Only your public portfolio and verified skills — never your disability data, contact details, or private information unless you apply to their job listing</li>
              <li><strong>Service providers:</strong> Supabase (database), Vercel (hosting), Google (OAuth), Notion (optional integration) — all bound by their own privacy policies</li>
              <li><strong>Legal requirements:</strong> If required by Philippine law or court order</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <ul style={styles.list}>
              <li>Your account data is retained as long as your account is active</li>
              <li>If you delete your account, your personal data is permanently deleted within 30 days</li>
              <li>Portfolio submissions and challenge results may be retained in anonymized form for platform improvement</li>
            </ul>
          </Section>

          <Section title="8. Your Rights (Under Philippine Data Privacy Act of 2012 — RA 10173)">
            <ul style={styles.list}>
              <li><strong>Right to be informed</strong> — know what data we collect and why</li>
              <li><strong>Right to access</strong> — request a copy of your personal data</li>
              <li><strong>Right to correct</strong> — update inaccurate or incomplete data</li>
              <li><strong>Right to erasure</strong> — request deletion of your personal data</li>
              <li><strong>Right to data portability</strong> — receive your data in a usable format</li>
              <li><strong>Right to object</strong> — opt out of certain data processing activities</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:steviesummer612@gmail.com" style={styles.link}>
                steviesummer612@gmail.com
              </a>
              . We will respond within 15 business days.
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We implement industry-standard security measures including encrypted data transmission
              (HTTPS), secure authentication via Supabase Auth, and role-based access controls.
              However, no system is 100% secure. If you believe your account has been compromised,
              contact us immediately.
            </p>
          </Section>

          <Section title="10. Children's Privacy">
            <p>
              InklusiJobs is not intended for users under 18 years of age. We do not knowingly
              collect personal data from minors. If you believe a minor has created an account,
              please contact us and we will delete the account promptly.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by email or by displaying a notice on the platform. Continued use of
              InklusiJobs after changes take effect means you accept the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              For any privacy-related questions or requests:
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>InklusiJobs</strong><br />
              Email: <a href="mailto:steviesummer612@gmail.com" style={styles.link}>steviesummer612@gmail.com</a><br />
              Website: <a href="https://inklusijobs.vercel.app" style={styles.link}>https://inklusijobs.vercel.app</a><br />
              Philippines
            </p>
          </Section>

        </div>

        <div style={styles.footer}>
          <p>© 2025 InklusiJobs. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
            <span style={styles.dot}>·</span>
            <a href="/terms" style={styles.footerLink}>Terms of Use</a>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        fontSize: 18, fontWeight: 700, color: "#1e3d28",
        marginBottom: 12, paddingBottom: 6,
        borderBottom: "1px solid #d4e8d8",
      }}>
        {title}
      </h3>
      <div style={{ color: "#475569", fontSize: 15, lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  );
}

function SubHeading({ children }) {
  return (
    <p style={{ fontWeight: 700, color: "#1e3d28", marginTop: 14, marginBottom: 6 }}>
      {children}
    </p>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 20px",
    fontFamily: "'Inter', 'Arial', sans-serif",
  },
  wrapper: {
    maxWidth: 760,
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  header: {
    background: "#1e3d28",
    padding: "40px 48px",
    textAlign: "center",
  },
  brand: {
    fontSize: 14, fontWeight: 700, color: "#a7f3d0",
    letterSpacing: "0.15em", margin: "0 0 12px",
  },
  title: {
    fontSize: 32, fontWeight: 800, color: "#ffffff",
    margin: "0 0 10px",
  },
  meta: {
    fontSize: 13, color: "#6ee7b7", margin: 0,
  },
  body: {
    padding: "40px 48px",
  },
  intro: {
    fontSize: 15, color: "#475569", lineHeight: 1.8,
    marginBottom: 32, padding: "16px 20px",
    background: "#f0f7f1", borderLeft: "4px solid #3d6b47",
    borderRadius: "0 8px 8px 0",
  },
  list: {
    paddingLeft: 20, margin: "8px 0",
    color: "#475569", fontSize: 15, lineHeight: 2,
  },
  link: { color: "#3d6b47", fontWeight: 600 },
  footer: {
    background: "#f8fafc", borderTop: "1px solid #e2e8f0",
    padding: "20px 48px", textAlign: "center",
    fontSize: 13, color: "#94a3b8",
  },
  footerLinks: { marginTop: 6, display: "flex", justifyContent: "center", gap: 12 },
  footerLink: { color: "#3d6b47", fontWeight: 600, textDecoration: "none" },
  dot: { color: "#94a3b8" },
};