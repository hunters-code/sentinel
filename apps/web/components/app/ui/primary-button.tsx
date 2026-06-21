import { cn } from "@/lib/cn";

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-sui-blue px-7 py-3.5 font-display text-base font-semibold tracking-[-0.02em] text-content-persistent-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bg-accent focus-visible:outline-offset-[3px] disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
