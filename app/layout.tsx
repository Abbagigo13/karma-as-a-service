import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karma as a Service — Trustless Reputation for the Autonomous Web",
  description:
    "Karma as a Service is an on-chain reputation oracle built on GenLayer. Multi-platform signals, AI-evaluated by validator consensus, with decay and on-chain appeals.",
  keywords: [
    "GenLayer",
    "reputation",
    "karma",
    "web3",
    "intelligent contracts",
    "oracle",
    "AI validators",
  ],
  openGraph: {
    title: "Karma as a Service",
    description: "Trustless reputation for the autonomous web, built on GenLayer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
