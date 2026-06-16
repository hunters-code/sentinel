"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export const brutalEase = [0.16, 1, 0.3, 1] as const;
export const brutalSpring = { type: "spring" as const, stiffness: 380, damping: 22 };

function useMotionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

function useSafeMotion(reduce: boolean | null) {
  const ready = useMotionReady();
  return !ready || !!reduce;
}

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  once = true,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  const skip = useSafeMotion(reduce);

  if (skip) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, margin: "-72px" }}
      transition={{ ...brutalSpring, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type HeroRevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  x?: number;
};

export function HeroReveal({
  children,
  className,
  delay = 0,
  y = 32,
  x = 0,
  ...props
}: HeroRevealProps) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ ...brutalSpring, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: brutalSpring,
  },
};

const staggerItemReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export function Stagger({
  children,
  className,
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ready = useMotionReady();
  const reduce = useReducedMotion();

  if (!ready || reduce) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={reduce ? staggerItemReduced : staggerItem}
    >
      {children}
    </motion.div>
  );
}

export function PopCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const skip = useSafeMotion(reduce);

  if (skip) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ ...brutalSpring, delay }}
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
    >
      {children}
    </motion.div>
  );
}

export function BarFill({
  className,
  widthPct,
  delay = 0,
}: {
  className?: string;
  widthPct: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const skip = useSafeMotion(reduce);

  if (skip) {
    return <div className={className} style={{ width: `${widthPct}%` }} />;
  }

  return (
    <motion.div
      className={className}
      initial={{ width: 0 }}
      whileInView={{ width: `${widthPct}%` }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, delay, ease: brutalEase }}
    />
  );
}

export function MotionNav({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <header className={className}>{children as ReactNode}</header>;
  }

  return (
    <motion.header
      className={className}
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: brutalEase }}
    >
      {children}
    </motion.header>
  );
}

/** Pop when numeric/text value changes — quote premium, coverage, etc. */
export function ValuePop({
  value,
  className,
  children,
}: {
  value: string | number;
  className?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <span className={className}>{children ?? value}</span>;
  }

  return (
    <motion.span
      key={String(value)}
      className={className}
      initial={{ scale: 0.82, opacity: 0, y: 6 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={brutalSpring}
    >
      {children ?? value}
    </motion.span>
  );
}

/** Stamp badges that gently wiggle — PAID, expiry, floor tags */
export function StampWiggle({
  children,
  className,
  deg = 3,
}: {
  children: ReactNode;
  className?: string;
  deg?: number;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      animate={{ rotate: [-deg, deg, -deg] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

/** Brutal preset / chip button with tap feedback */
export function MotionChip({
  children,
  className,
  onClick,
  active,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96, x: 2, y: 2 }}
      animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={active ? { duration: 0.35 } : { duration: 0.2 }}
    >
      {children}
    </motion.button>
  );
}

/** CTA / primary action with subtle idle pulse */
export function PulseWrap({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ready = useMotionReady();

  if (!ready || reduce) {
    return <div className={className}>{children as ReactNode}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ scale: [1, 1.015, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
