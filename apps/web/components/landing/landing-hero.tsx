import { HeroCoinIllustration } from "@/components/landing/hero-coin-illustration";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden px-6 md:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-sui-black" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_120%,#042848_0%,transparent_58%),linear-gradient(180deg,#000000_0%,#010610_45%,#001428_100%)]" />
        <div className="absolute -inset-[12%]">
          <span className="absolute left-[-6%] top-[12%] h-[min(44vw,480px)] w-[min(44vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(41,141,255,0.28)_0%,rgba(41,141,255,0)_70%)]" />
          <span className="absolute bottom-[8%] right-[-4%] h-[min(40vw,440px)] w-[min(40vw,440px)] rounded-full bg-[radial-gradient(circle,rgba(23,89,196,0.22)_0%,rgba(23,89,196,0)_72%)]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_42%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.4)_100%),linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.06)_40%,rgba(0,0,0,0)_64%,rgba(0,0,0,0.14)_100%)]" />
      </div>

      <HeroCoinIllustration />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center py-[4.75rem] pb-[calc(4.75rem+min(34vh,300px))] md:pb-[calc(4.75rem+min(38vh,340px))]">
        <div className="relative z-[1] w-full max-w-[56rem] text-center lg:max-w-[64rem]">
          <HeroHeadline />

          <p className="mx-auto mt-6 max-w-[65ch] text-center text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-[1.6] text-white/84 text-pretty">
            Cover your crypto against a sharp drop. Cross the <strong className="font-semibold text-white">2%</strong>{" "}
            trigger and you&apos;re <strong className="font-semibold text-white">paid automatically</strong> —{" "}
            <strong className="font-semibold text-white">one tap</strong>, no paperwork.
          </p>

          <div className="mt-8 inline-flex justify-center">
            <QuoteCtaButton href="/app" quiet />
          </div>
        </div>
      </div>
    </section>
  );
}
