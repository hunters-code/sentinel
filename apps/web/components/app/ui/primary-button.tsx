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
        "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-action-primary px-7 py-3.5 text-base font-medium text-content-persistent-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
