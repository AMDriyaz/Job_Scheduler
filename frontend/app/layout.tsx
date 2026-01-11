import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Scheduler & Automation Dashboard",
  description: "Efficiently manage, track, and automate background jobs and webhooks with our real-time Job Scheduler Dashboard.",
  keywords: ["job scheduler", "automation", "background tasks", "cron jobs", "dashboard", "workflow", "webhooks"],
  authors: [{ name: "Job Scheduler Team" }],
  creator: "Job Scheduler Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://job-scheduler.example.com",
    title: "Job Scheduler & Automation Dashboard",
    description: "Manage background jobs and workflows in real-time.",
    siteName: "Job Scheduler",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Scheduler & Automation Dashboard",
    description: "Manage background jobs and workflows in real-time.",
    creator: "@jobscheduler",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
