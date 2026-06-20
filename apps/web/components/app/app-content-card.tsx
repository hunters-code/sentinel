import { cn } from "@/lib/cn";

export function AppContentCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("app-content-card", className)}>{children}</div>;
}
