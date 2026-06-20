import { cn } from "@/lib/cn";

export function Muted({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <p id={id} className={cn("text-sm leading-relaxed text-content-secondary", className)}>
      {children}
    </p>
  );
}
