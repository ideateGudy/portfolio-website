import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ToastViewport } from "@/components/ui/Toast";
import { InteractiveCursor } from "@/components/ui/InteractiveCursor";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Goodnews Azonubi | Backend & DevOps Engineer (Fullstack)",
    template: "%s | Goodnews Azonubi",
  },
  description:
    "Portfolio of Goodnews Azonubi, Backend & DevOps Engineer specializing in scalable server architecture, resilient REST APIs, AWS cloud infrastructure, Docker, CI/CD, and fullstack modern web applications.",
  icons: {
    icon: [
      { url: '/icon', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/icon',
    apple: [
      { url: '/icon', sizes: '48x48', type: 'image/png' },
    ],
  },
};

// Reads the persisted theme synchronously before first paint to completely eliminate theme flashing
const themeInitScript = `
(function () {
  try {
    var raw = localStorage.getItem("theme-storage") || localStorage.getItem("theme");
    var theme = null;
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.state && parsed.state.theme) {
          theme = parsed.state.theme;
        }
      } catch (e) {
        if (raw === "light" || raw === "dark" || raw === "system") {
          theme = raw;
        }
      }
    }
    var resolved = theme === "light" || theme === "dark" 
      ? theme 
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    if (resolved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          {children}
          <ToastViewport />
          <InteractiveCursor />
          <AnalyticsTracker />
        </MotionProvider>
      </body>
    </html>
  );
}
