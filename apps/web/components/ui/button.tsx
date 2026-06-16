import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "default" | "neutral" | "lime" | "yellow" | "reverse" | "noShadow";
type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  default:
    "bg-cyan-200 text-black border-2 border-black hover:bg-cyan-300 hover:shadow-brutal-btn active:bg-cyan-400",
  neutral:
    "bg-white text-black border-2 border-black shadow-brutal hover:shadow-brutal-hover",
  lime: "bg-lime-200 text-black border-2 border-black hover:bg-lime-300 hover:shadow-brutal-btn active:bg-lime-400",
  yellow:
    "bg-yellow-300 text-black border-2 border-black hover:bg-yellow-400 hover:shadow-brutal-btn active:bg-yellow-400",
  reverse:
    "bg-cyan-200 text-black border-2 border-black hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-brutal",
  noShadow: "bg-cyan-200 text-black border-2 border-black",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-8 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      fullWidth,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-base font-base whitespace-nowrap",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
