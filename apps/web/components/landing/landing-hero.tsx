import { HeroCoinIllustration } from "@/components/landing/hero-coin-illustration";
import { HeroHeadline } from "@/components/landing/hero-headline";
import { QuoteCtaButton } from "@/components/header/quote-cta-button";

export function LandingHero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden px-6 md:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-sui-black" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_120%,#042848_0%,transparent_58%),linear-gradient(180deg,#000000_0%,#010610_45%,#001428_100%)]" />
        <div className="absolute -inset-[20%] translate-z-0 blur-[72px] motion-reduce:blur-0">
          <span className="absolute left-[-8%] top-[8%] h-[min(52vw,560px)] w-[min(52vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(41,141,255,0.62)_0%,rgba(41,141,255,0)_68%)] motion-safe:animate-hero-mesh-a motion-reduce:animate-none" />
          <span className="absolute right-[-10%] top-[-6%] h-[min(48vw,520px)] w-[min(48vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(92,169,255,0.48)_0%,rgba(92,169,255,0)_70%)] motion-safe:animate-hero-mesh-b motion-reduce:animate-none" />
          <span className="absolute bottom-[-4%] left-[18%] h-[min(58vw,640px)] w-[min(58vw,640px)] rounded-full bg-[radial-gradient(circle,rgba(23,89,196,0.55)_0%,rgba(23,89,196,0)_72%)] motion-safe:animate-hero-mesh-c motion-reduce:animate-none" />
          <span className="absolute bottom-[10%] right-[8%] h-[min(44vw,480px)] w-[min(44vw,480px)] rounded-full bg-[radial-gradient(circle,rgba(0,46,106,0.72)_0%,rgba(0,46,106,0)_68%)] motion-safe:animate-hero-mesh-d motion-reduce:animate-none" />
          <span className="absolute left-[42%] top-[36%] h-[min(36vw,400px)] w-[min(36vw,400px)] rounded-full bg-[radial-gradient(circle,rgba(125,247,82,0.12)_0%,rgba(125,247,82,0)_72%)] motion-safe:animate-hero-mesh-e motion-reduce:animate-none" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_42%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%),linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_38%,rgba(0,0,0,0)_62%,rgba(0,0,0,0.12)_100%)]" />
      </div>

      <HeroCoinIllustration />

      <div className="relative z-[2] mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center py-[4.75rem] pb-[calc(4.75rem+min(34vh,300px))] md:pb-[calc(4.75rem+min(38vh,340px))]">
        <div className="relative z-[1] w-full max-w-[56rem] text-center lg:max-w-[64rem]">
          <HeroHeadline />

          <p
            className="mx-auto mt-6 max-w-[65ch] text-center text-[clamp(1.0625rem,1.8vw,1.375rem)] leading-[1.6] text-white/84 text-pretty motion-safe:animate-sentinel-rise motion-reduce:animate-none"
            style={{ animationDelay: "0.38s" }}
          >
            Cover your crypto against a sharp drop. Cross the <strong className="font-semibold text-white">2%</strong>{" "}
            trigger and you&apos;re <strong className="font-semibold text-white">paid automatically</strong> —{" "}
            <strong className="font-semibold text-white">one tap</strong>, no paperwork.
          </p>

          <div
            className="mt-8 inline-flex justify-center motion-safe:animate-sentinel-rise motion-reduce:animate-none"
            style={{ animationDelay: "0.58s" }}
          >
            <QuoteCtaButton href="/app" />
          </div>
        </div>
      </div>
    </section>
  );
}
