import Link from "next/link";
import { Reveal } from "@/components/reveal";

const PILLARS = [
  {
    id: "plain",
    title: "Plain language, real cover",
    detail:
      "Under the hood it's a downside position — but you never touch a strike ladder. You get a premium, a trigger, a payout, and a receipt. Risk, spoken the way you actually think about it.",
  },
  {
    id: "audit",
    title: "A price you can audit",
    detail:
      "The premium comes straight from the live market — fair value plus a small spread, shown in full before you sign. Never a black-box number we invent.",
  },
  {
    id: "paid",
    title: "Paid without a claim",
    detail:
      "A vault on Sui always takes the other side. The instant your window settles in your favor, the payout fires on-chain — nothing to file, no one to call.",
  },
] as const;

export function LandingWhy() {
  return (
    <section id="why" className="landing-why" aria-labelledby="why-heading">
      <div className="landing-why-glow" aria-hidden />
      <div className="landing-why-inner">
        <Reveal className="landing-why-head">
          <h2 id="why-heading" className="landing-why-title">
            Insurance that explains itself.
          </h2>
          <p className="landing-why-lead">
            Crypto protection usually hides behind an options desk and a wall of jargon. Sentinel
            shows you the trigger, the payout, and the price up front — then pays you the moment the
            market proves you right.
          </p>
        </Reveal>

        <ul className="landing-why-pillars">
          {PILLARS.map((pillar, index) => (
            <li key={pillar.id} className="landing-why-pillar">
              <Reveal style={{ transitionDelay: `${index * 90}ms` }}>
                <h3 className="landing-why-pillar-title">{pillar.title}</h3>
                <p className="landing-why-pillar-detail">{pillar.detail}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="landing-why-foot">
          <Link href="/app" className="landing-why-cta">
            Get a quote
            <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
