import { AuthProvider } from "@/components/landing/AuthProvider";
import { AuthModalProvider } from "@/components/landing/AuthModalContext";
import "./globals.css";

export const metadata = {
  title: "InklusiJobs",
  description: "Built for PWDs. Powered by AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AuthModalProvider>
            {children}
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}