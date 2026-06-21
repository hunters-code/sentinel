"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { LANDING_EASE, LANDING_VIEWPORT, landingFadeUp, landingFadeUpBlur } from "@/lib/landing-motion";

type LandingRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
};

export function LandingReveal({ children, className, delay = 0, blur = false }: LandingRevealProps) {
  const reduce = useReducedMotion();
  const variants = blur ? landingFadeUpBlur : landingFadeUp;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={LANDING_VIEWPORT}
      variants={variants}
      transition={{ delay, ease: LANDING_EASE }}
    >
      {children}
    </motion.div>
  );
}
