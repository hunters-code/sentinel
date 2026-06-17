import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

// Low-fi: variants/sizes are accepted for API compatibility but not styled.
type ButtonVariant = "default" | "neutral" | "lime" | "yellow" | "reverse" | "noShadow";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type = "button", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn("btn", fullWidth && "btn--full", className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
