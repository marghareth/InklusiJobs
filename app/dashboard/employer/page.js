/**
 * app/dashboard/employer/page.js
 * Route: /dashboard/employer
 *
 * Stub — replace with EmployerLayout when ready to build.
 */

export const metadata = {
  title: "Employer Dashboard | InklusiJobs",
  description: "Manage your job postings and applicants",
};

export default function EmployerDashboardPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #080b14 0%, #0d1023 40%, #0a0f1e 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        textAlign: "center",
        padding: "48px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px",
        maxWidth: "400px",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>💼</div>
        <h2 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "22px",
          fontWeight: "800",
          background: "linear-gradient(90deg,#f1f5f9,#a5b4fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "10px",
        }}>
          Employer Dashboard
        </h2>
        <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
          Manage job postings, review applicants, and track your hiring pipeline.
        </p>
        <span style={{
          display: "inline-block",
          padding: "8px 20px",
          borderRadius: "10px",
          background: "rgba(109,40,217,0.15)",
          border: "1px solid rgba(109,40,217,0.3)",
          fontSize: "12px",
          fontWeight: "600",
          color: "#a78bfa",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}>
          Coming Soon
        </span>
      </div>
    </div>
  );
}