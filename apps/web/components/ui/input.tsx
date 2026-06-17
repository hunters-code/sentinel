import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, ref) => {
    return (
      <div className="field">
        <input ref={ref} className={cn(className)} {...props} />
        {suffix ? <span className="muted">{suffix}</span> : null}
      </div>
    );
  },
);

Input.displayName = "Input";
