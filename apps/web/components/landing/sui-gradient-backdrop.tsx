import Image from "next/image";
import { cn } from "@/lib/cn";

const GRADIENTS = {
  primary: "/gradients/sui/primary-gradient.jpg",
  secondaryPanel: "/gradients/sui/secondary-gradient-panel.png",
  secondaryStack: "/gradients/sui/secondary-gradient-stack.jpg",
} as const;

type SuiGradientVariant = keyof typeof GRADIENTS;

type SuiGradientBackdropProps = {
  variant: SuiGradientVariant;
  overlay?: "hero" | "panel" | "section" | "none";
  drift?: boolean;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export function SuiGradientBackdrop({
  variant,
  overlay = "none",
  drift = false,
  className,
  imageClassName,
  priority = false,
}: SuiGradientBackdropProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div className={cn("relative h-full w-full", drift && "animate-landing-gradient-drift motion-reduce:animate-none")}>
        <Image
          src={GRADIENTS[variant]}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          draggable={false}
          className={cn("object-cover", imageClassName)}
        />
      </div>
      {overlay === "hero" ? <div className="absolute inset-0 bg-landing-sui-hero-overlay" /> : null}
      {overlay === "panel" ? <div className="absolute inset-0 bg-landing-sui-panel-overlay" /> : null}
      {overlay === "section" ? <div className="absolute inset-0 bg-landing-sui-section-overlay" /> : null}
    </div>
  );
}

export { GRADIENTS as SUI_GRADIENT_ASSETS };
