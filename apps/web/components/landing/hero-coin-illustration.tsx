import Image from "next/image";
import { cn } from "@/lib/cn";

const COINS = [
  {
    id: "btc",
    src: "/illustrations/btc-3d-glass.svg",
    wrap: "absolute bottom-0 left-1/2 z-[3] w-[min(78vw,440px)] -translate-x-1/2 md:w-[min(56vw,500px)] lg:w-[min(48vw,540px)]",
    motion: "animate-landing-coin-float",
  },
  {
    id: "sui",
    src: "/illustrations/sui-3d-glass.svg",
    wrap: "absolute bottom-[6%] left-[-2%] z-[1] w-[min(52vw,280px)] md:bottom-[8%] md:left-[2%] md:w-[min(38vw,320px)] lg:left-[6%]",
    motion: "animate-landing-coin-float-sui",
  },
  {
    id: "usdc",
    src: "/illustrations/usdc-3d-glass.svg",
    wrap: "absolute bottom-[4%] right-[-2%] z-[2] w-[min(48vw,260px)] md:bottom-[7%] md:right-[2%] md:w-[min(36vw,300px)] lg:right-[6%]",
    motion: "animate-landing-coin-float-usdc",
  },
] as const;

export function HeroCoinIllustration() {
  return (
    <figure
      className="absolute inset-x-0 bottom-0 h-[min(60vh,560px)] overflow-hidden [mask-image:linear-gradient(180deg,transparent_0%,black_30%,black_100%)] md:h-[min(64vh,620px)] lg:h-[min(68vh,680px)]"
      aria-hidden
    >
      <figcaption className="sr-only">
        Stylized glass coins representing Bitcoin, Sui, and USDC covered by Sentinel.
      </figcaption>
      <div className="relative mx-auto h-full w-full max-w-[80rem] px-4 md:px-10">
        <div className="absolute bottom-[14%] left-1/2 h-[42%] w-[min(88%,600px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(41,141,255,0.28)_0%,transparent_74%)]" />
        <div className="relative h-full w-full opacity-40">
          {COINS.map((coin) => (
            <div key={coin.id} className={coin.wrap}>
              <div className={cn(coin.motion, "motion-reduce:animate-none")}>
                <Image
                  src={coin.src}
                  alt=""
                  width={512}
                  height={512}
                  className="h-auto w-full drop-shadow-[0_20px_48px_rgba(0,0,0,0.5)] select-none"
                  priority
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
