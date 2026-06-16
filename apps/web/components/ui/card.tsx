import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  hover = true,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-base border-2 border-black bg-white py-6 font-base text-foreground shadow-brutal",
        hover && "transition-shadow hover:shadow-brutal-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b-2 border-black px-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-heading text-xl leading-none", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-base leading-relaxed text-foreground/80", className)} {...props}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 border-t-2 border-black px-6 pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBadge({
  className,
  children,
  variant = "neutral",
}: {
  className?: string;
  children: ReactNode;
  variant?: "default" | "neutral" | "lime" | "yellow" | "violet" | "pink";
}) {
  const tones: Record<string, string> = {
    default: "bg-cyan-200 text-black",
    neutral: "bg-white text-black",
    lime: "bg-lime-300 text-black",
    yellow: "bg-yellow-300 text-black",
    violet: "bg-violet-200 text-black",
    pink: "bg-pink-200 text-black",
  };

  return (
    <span
      className={cn(
        "inline-block w-fit rounded-base border-2 border-black px-2.5 py-0.5 text-xs font-base",
        tones[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
