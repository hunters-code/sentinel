import { cn } from "@/lib/cn";

const cardClass = "app-panel rounded-2xl p-6 md:p-8";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(cardClass, className)}>{children}</div>;
}
