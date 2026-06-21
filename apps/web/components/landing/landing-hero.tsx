import { HeroCoinIllustration } from "@/components/landing/hero-coin-illustration";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { HeroIntro } from "@/components/landing/hero-intro";
import { SuiGradientBackdrop } from "@/components/landing/sui-gradient-backdrop";

export function LandingHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden px-5 md:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-sui-black" aria-hidden>
        <SuiGradientBackdrop
          variant="primary"
          overlay="hero"
          priority
          drift
          imageClassName="object-cover object-[center_42%] md:object-[center_38%]"
        />
        <div className="absolute inset-0 landing-hero-vignette" />
      </div>

      <HeroCoinIllustration />

      <div className="relative z-[2] mx-auto flex w-full max-w-container flex-1 flex-col items-center justify-center py-[4.75rem] pb-[calc(4.75rem+min(34vh,300px))] md:pb-[calc(4.75rem+min(38vh,340px))]">
        <div className="relative z-[1] w-full max-w-[56rem] text-center lg:max-w-[48rem]">
          <HeroHeadline />
          <HeroIntro />
        </div>
      </div>
    </section>
  );
}
