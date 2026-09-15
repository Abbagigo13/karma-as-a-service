import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { CtaFooter } from "@/components/landing/CtaFooter";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { NetworkPanel } from "@/components/landing/NetworkPanel";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <NetworkPanel />
      <CtaFooter />
    </main>
  );
}
