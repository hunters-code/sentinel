import { cn } from "@/lib/cn";

const cardClass =
  "rounded-2xl border border-card-border bg-card-fill p-6 shadow-[inset_0_1px_0_theme(colors.card-accent)] md:p-8";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(cardClass, className)}>{children}</div>;
}
