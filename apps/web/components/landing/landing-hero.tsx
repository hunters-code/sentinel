import { HeroCoinIllustration } from "@/components/landing/hero-coin-illustration";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { HeroIntro } from "@/components/landing/hero-intro";
import { HeroMeshBackdrop } from "@/components/landing/hero-mesh-backdrop";

export function LandingHero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col justify-center overflow-hidden px-5 pb-14 pt-[5.25rem] md:px-10 md:pb-20 md:pt-[5.5rem]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <HeroMeshBackdrop />
        <HeroCoinIllustration />
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-container">
        <div className="relative mx-auto w-full max-w-[56rem] text-center lg:max-w-[48rem]">
          <HeroHeadline />
          <HeroIntro />
        </div>
      </div>
    </section>
  );
}
