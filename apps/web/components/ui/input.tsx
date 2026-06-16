import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2 rounded-base border-2 border-black bg-white px-4 shadow-brutal focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2">
        <input
          ref={ref}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent py-3 font-heading text-2xl font-heading tabular-nums",
            "placeholder:text-black/40 focus:outline-none",
            className,
          )}
          {...props}
        />
        {suffix ? (
          <span className="text-sm font-base text-black/60">{suffix}</span>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
