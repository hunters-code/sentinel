import { HeroCoinIllustration } from "@/components/landing/hero-coin-illustration";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden px-6 md:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-sui-black" aria-hidden>
        <div className="absolute inset-0 landing-hero-backdrop-base" />
        <div className="absolute -inset-[12%]">
          <span className="absolute left-[-6%] top-[12%] h-[min(44vw,480px)] w-[min(44vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(41,141,255,0.28)_0%,rgba(41,141,255,0)_70%)]" />
          <span className="absolute bottom-[8%] right-[-4%] h-[min(40vw,440px)] w-[min(40vw,440px)] rounded-full bg-[radial-gradient(circle,rgba(23,89,196,0.22)_0%,rgba(23,89,196,0)_72%)]" />
        </div>
        <div className="absolute inset-0 landing-hero-vignette" />
      </div>

      <HeroCoinIllustration />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center py-[4.75rem] pb-[calc(4.75rem+min(34vh,300px))] md:pb-[calc(4.75rem+min(38vh,340px))]">
        <div className="relative z-[1] w-full max-w-[56rem] text-center lg:max-w-[64rem]">
          <HeroHeadline />

          <p className="mx-auto mt-6 max-w-[65ch] text-center text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-[1.6] text-content-secondary text-pretty">
            Cover your crypto against a sharp drop. Cross the <strong className="font-semibold text-content-primary">2%</strong>{" "}
            trigger and you&apos;re <strong className="font-semibold text-content-primary">paid automatically</strong> —{" "}
            <strong className="font-semibold text-content-primary">one tap</strong>, no paperwork.
          </p>

          <div className="mt-8 inline-flex justify-center">
            <QuoteCtaButton href="/app" quiet />
          </div>
        </div>
      </div>
    </section>
  );
}
