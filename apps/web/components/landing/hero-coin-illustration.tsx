"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const COINS = [
  {
    id: "btc",
    src: "/illustrations/btc-3d-glass.svg",
    alt: "Bitcoin",
    className:
      "absolute bottom-0 left-1/2 z-[4] w-[46%] max-w-[280px] -translate-x-1/2 md:w-[42%] md:max-w-[320px] lg:w-[38%] lg:max-w-[360px]",
    floatDuration: 5.4,
    floatDelay: 0,
    revealDelay: 0.72,
  },
  {
    id: "sui",
    src: "/illustrations/sui-3d-glass.svg",
    alt: "Sui",
    className:
      "absolute bottom-[6%] left-[4%] z-[2] w-[30%] max-w-[196px] md:bottom-[8%] md:left-[6%] md:w-[28%] md:max-w-[228px] lg:w-[24%] lg:max-w-[260px]",
    floatDuration: 6,
    floatDelay: 0.35,
    revealDelay: 0.82,
  },
  {
    id: "usdc",
    src: "/illustrations/usdc-3d-glass.svg",
    alt: "USDC",
    className:
      "absolute bottom-[4%] right-[4%] z-[3] w-[28%] max-w-[188px] md:bottom-[6%] md:right-[6%] md:w-[26%] md:max-w-[220px] lg:w-[22%] lg:max-w-[248px]",
    floatDuration: 5.8,
    floatDelay: 0.7,
    revealDelay: 0.92,
  },
] as const;

export function HeroCoinIllustration() {
  const reduce = useReducedMotion();

  return (
    <figure className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-end justify-center overflow-hidden px-6 pb-0 md:px-10">
      <figcaption className="sr-only">
        Stylized glass coins representing Bitcoin, Sui, and USDC covered by Sentinel.
      </figcaption>
      <div
        className="relative mx-auto h-[min(38vh,340px)] w-full max-w-[68rem] [mask-image:linear-gradient(180deg,transparent_0%,black_32%,black_100%)] md:h-[min(42vh,400px)] lg:h-[min(44vh,440px)] lg:max-w-[72rem]"
        aria-hidden
      >
        <div className="absolute bottom-[12%] left-1/2 h-[38%] w-[min(72%,560px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(41,141,255,0.35)_0%,transparent_72%)] blur-[18px]" />
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
