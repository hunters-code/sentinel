"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    id: "quote",
    title: "Quote your cover",
    screen: "Cover",
    detail:
      "Enter what you hold. We size the payout for a 2% drop and show the premium before you sign — no haggling, no hidden fees.",
  },
  {
    id: "receipt",
    title: "Track your receipt",
    screen: "Receipt",
    detail:
      "Watch coverage live. A price line tracks your trigger, and status flips from active to paid the moment the window settles.",
  },
  {
    id: "payout",
    title: "Get paid automatically",
    screen: "History",
    detail:
      "If the trigger hits, payout lands on-chain — no claim to file. One tap sweeps it to your wallet when you're ready.",
  },
] as const;

const STEP_TRANSITION = { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const };

type AppScreenshotProps = {
  activeIndex: number;
  imageSrc?: string;
  imageAlt?: string;
};

function AppScreenshot({ activeIndex, imageSrc, imageAlt }: AppScreenshotProps) {
  const reduceMotion = useReducedMotion();

  return (
    <figure className="landing-app-shot">
      <div className="landing-app-shot-surface">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? "Sentinel app screenshot"}
            width={1000}
            height={600}
            className="landing-app-shot-image"
          />
        ) : (
          STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`landing-app-shot-layer${index === activeIndex ? " is-active" : ""}`}
              aria-hidden={index !== activeIndex}
            >
              <div className="landing-app-shot-placeholder">
                <span className="landing-app-shot-screen-name">{step.screen}</span>
                <span className="landing-app-shot-placeholder-label">{step.title}</span>
                <span className="landing-app-shot-placeholder-hint">App screenshot placeholder</span>
              </div>
            </div>
          ))
        )}
      </div>
      <figcaption className="landing-app-shot-caption">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={STEPS[activeIndex].id}
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={reduceMotion ? { duration: 0 } : STEP_TRANSITION}
          >
            {STEPS[activeIndex].screen} · Sentinel web app
          </motion.span>
        </AnimatePresence>
      </figcaption>
    </figure>
  );
}

type StepDisplayProps = {
  activeIndex: number;
};

function StepDisplay({ activeIndex }: StepDisplayProps) {
  const reduceMotion = useReducedMotion();
  const step = STEPS[activeIndex];

  return (
    <div className="landing-how-step-display" aria-live="polite">
      <div className="landing-how-step-rail" aria-hidden>
        {STEPS.map((item, index) => (
          <span
            key={item.id}
            className={`landing-how-step-rail-item${index === activeIndex ? " is-active" : ""}${index < activeIndex ? " is-complete" : ""}`}
          >
            {index + 1}
          </span>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step.id}
          className="landing-how-step-inner"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -22 }}
          transition={reduceMotion ? { duration: 0 } : STEP_TRANSITION}
        >
          <span className="landing-how-step-number">{activeIndex + 1}</span>
          <div className="landing-how-step-body">
            <h3 className="landing-how-step-name">{step.title}</h3>
            <p className="landing-how-step-detail">{step.detail}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function LandingHowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  const updateActiveStep = useCallback(() => {
    const section = scrollSectionRef.current;
    const root = section?.closest(".landing-how");
    if (!section || !root) return;

    const styles = getComputedStyle(root);
    const navOffset = parseFloat(styles.getPropertyValue("--how-nav-offset")) || 76;
    const headerHeight = parseFloat(styles.getPropertyValue("--how-section-header-height")) || 168;
    const stickyTop = navOffset + headerHeight;
    const stageHeight = window.innerHeight - stickyTop;

    if (stageHeight <= 0) return;

    const totalScroll = section.offsetHeight - stageHeight;
    if (totalScroll <= 0) {
      setActiveIndex(0);
      return;
    }

    const scrolled = Math.min(Math.max(stickyTop - section.getBoundingClientRect().top, 0), totalScroll);
    const progress = scrolled / totalScroll;
    const index = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

    setActiveIndex((current) => (current === index ? current : index));
  }, []);

  useEffect(() => {
    updateActiveStep();
    window.addEventListener("scroll", updateActiveStep, { passive: true });
    window.addEventListener("resize", updateActiveStep);
    return () => {
      window.removeEventListener("scroll", updateActiveStep);
      window.removeEventListener("resize", updateActiveStep);
    };
  }, [updateActiveStep]);

  return (
    <section id="how" className="landing-how" aria-labelledby="how-heading">
      <div className="landing-how-inner">
        <header className="landing-how-header">
          <Reveal>
            <h2 id="how-heading" className="landing-how-title">
              One tap to buy.
              <span className="landing-how-title-accent"> Paid when it settles.</span>
            </h2>
            <p className="landing-how-lead">
              Three steps — quote, receipt, payout. No options desk, no paperwork.
            </p>
          </Reveal>
        </header>

        <div ref={scrollSectionRef} className="landing-how-scroll-section">
          <div className="landing-how-sticky-stage">
            <div className="landing-how-layout">
              <StepDisplay activeIndex={activeIndex} />
              <aside className="landing-how-preview" aria-label="App preview">
                <AppScreenshot activeIndex={activeIndex} />
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
