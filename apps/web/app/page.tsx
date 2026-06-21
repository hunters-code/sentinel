import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHowSection } from "@/components/landing/landing-how-section";
import { LandingStackSection } from "@/components/landing/landing-stack-section";
import { LandingCtaSection } from "@/components/landing/landing-cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="landing-sui min-h-screen bg-sui-black font-body text-content-primary antialiased [--tw-ring-offset-color:var(--color-background-persistent-dark)] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-sui-blue [&_a:focus-visible]:outline-offset-[3px] [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-sui-blue [&_button:focus-visible]:outline-offset-[3px] [&_h1]:font-display [&_h1]:font-normal [&_h1]:text-balance [&_h2]:font-display [&_h2]:font-normal [&_h2]:text-balance [&_h3]:font-display [&_h3]:font-normal [&_h3]:tracking-[-0.02em]">
      <LandingHeader />
      <main id="main-content">
        <LandingHero />
        <LandingHowSection />
        <LandingStackSection />
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
