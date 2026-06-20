"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const COINS = [
  {
    id: "btc",
    src: "/illustrations/btc-3d-glass.svg",
    alt: "Bitcoin",
    className: "absolute left-1/2 top-[20%] z-[4] w-[32%] max-w-[196px] -translate-x-[106%] -translate-y-1/2 md:w-[24%] md:max-w-[228px] lg:w-[20%]",
    floatDuration: 5.4,
    floatDelay: 0,
    revealDelay: 0.72,
  },
  {
    id: "sui",
    src: "/illustrations/sui-3d-glass.svg",
    alt: "Sui",
    className: "absolute left-1/2 top-[20%] z-[6] w-[34%] max-w-[208px] -translate-x-1/2 -translate-y-[44%] md:w-[26%] md:max-w-[246px] lg:w-[22%]",
    floatDuration: 6,
    floatDelay: 0.35,
    revealDelay: 0.82,
  },
  {
    id: "usdc",
    src: "/illustrations/usdc-3d-glass.svg",
    alt: "USDC",
    className: "absolute left-1/2 top-[20%] z-[4] w-[32%] max-w-[196px] translate-x-[6%] -translate-y-[48%] md:w-[24%] md:max-w-[228px] md:translate-x-[86%] lg:w-[20%]",
    floatDuration: 5.8,
    floatDelay: 0.7,
    revealDelay: 0.92,
  },
] as const;

export function HeroCoinIllustration() {
  const reduce = useReducedMotion();

  return (
    <figure className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[58vh] max-h-[560px] overflow-hidden [mask-image:linear-gradient(to_top,rgba(0,0,0,0.98)_52%,rgba(0,0,0,0)_100%)] md:h-[64vh] lg:h-[68vh]">
      <figcaption className="sr-only">
        Stylized glass coins representing Bitcoin, Sui, and USDC covered by Sentinel.
      </figcaption>
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[62%] h-[340px] w-[92vw] max-w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(32,124,255,0.26)_0%,rgba(12,42,92,0.14)_46%,rgba(0,0,0,0)_74%)] blur-[18px]" />
        {COINS.map((coin) => {
          const image = (
            <Image
              src={coin.src}
              alt=""
              width={512}
              height={512}
              className="h-auto w-full drop-shadow-[0_18px_36px_rgba(0,0,0,0.38)] select-none"
              priority
              draggable={false}
            />
          );

          if (reduce) {
            return (
              <div key={coin.id} className={coin.className}>
                {image}
              </div>
            );
          }

          return (
            <div key={coin.id} className={coin.className}>
              <motion.div
                initial={{ y: 32, filter: "blur(12px)" }}
                animate={{ y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: coin.revealDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
                  transition={{
                    duration: coin.floatDuration,
                    delay: coin.floatDelay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {image}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
