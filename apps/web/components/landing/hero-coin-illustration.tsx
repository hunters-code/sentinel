import Image from "next/image";

const COINS = [
  {
    id: "btc",
    src: "/illustrations/btc-3d-glass.svg",
    className:
      "absolute bottom-0 left-1/2 z-[4] w-[46%] max-w-[280px] -translate-x-1/2 md:w-[42%] md:max-w-[320px] lg:w-[38%] lg:max-w-[360px]",
  },
  {
    id: "sui",
    src: "/illustrations/sui-3d-glass.svg",
    className:
      "absolute bottom-[6%] left-[4%] z-[2] w-[30%] max-w-[196px] md:bottom-[8%] md:left-[6%] md:w-[28%] md:max-w-[228px] lg:w-[24%] lg:max-w-[260px]",
  },
  {
    id: "usdc",
    src: "/illustrations/usdc-3d-glass.svg",
    className:
      "absolute bottom-[4%] right-[4%] z-[3] w-[28%] max-w-[188px] md:bottom-[6%] md:right-[6%] md:w-[26%] md:max-w-[220px] lg:w-[22%] lg:max-w-[248px]",
  },
] as const;

export function HeroCoinIllustration() {
  return (
    <figure className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex items-end justify-center overflow-hidden px-6 pb-0 md:px-10">
      <figcaption className="sr-only">
        Stylized glass coins representing Bitcoin, Sui, and USDC covered by Sentinel.
      </figcaption>
      <div
        className="relative mx-auto h-[min(38vh,340px)] w-full max-w-[68rem] [mask-image:linear-gradient(180deg,transparent_0%,black_32%,black_100%)] md:h-[min(42vh,400px)] lg:h-[min(44vh,440px)] lg:max-w-[72rem]"
        aria-hidden
      >
        <div className="absolute bottom-[12%] left-1/2 h-[32%] w-[min(64%,480px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(41,141,255,0.18)_0%,transparent_74%)]" />
        {COINS.map((coin) => (
          <div key={coin.id} className={coin.className}>
            <Image
              src={coin.src}
              alt=""
              width={512}
              height={512}
              className="h-auto w-full drop-shadow-[0_12px_28px_rgba(0,0,0,0.32)] select-none"
              priority
              draggable={false}
            />
          </div>
        ))}
      </div>
    </figure>
  );
}
