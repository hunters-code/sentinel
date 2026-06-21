/** Shared easing — expo-out feel, matches sentinel-rise. */
export const LANDING_EASE = [0.22, 1, 0.36, 1] as const;

export const LANDING_VIEWPORT = { once: true, margin: "-12% 0px" as const };

export const landingFadeUp = {
  hidden: { opacity: 1, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: LANDING_EASE },
  },
};

export const landingFadeUpBlur = {
  hidden: { opacity: 1, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: LANDING_EASE },
  },
};

export const landingStaggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

export const landingHeroLine = {
  hidden: { opacity: 1, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.82, ease: LANDING_EASE },
  },
};

export const landingHeroContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

export function landingFloatTransition(index: number, reduce: boolean | null) {
  if (reduce) return undefined;
  return {
    y: [0, -10, 0],
    transition: {
      duration: 4.8 + index * 0.65,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}
