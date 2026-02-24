import { Lexend, Roboto } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  title: "InklusiJobs",
  description: "Skills that speak louder than credentials",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lexend.variable} ${roboto.variable}`}>
      <body className="antialiased bg-white text-[#000000]">
        {children}
      </body>
    </html>
  );
}