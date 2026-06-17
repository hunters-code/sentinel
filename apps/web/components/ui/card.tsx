import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Low-fi: plain bordered boxes. Variants accepted for API compatibility only.

export function Card({
  className,
  hover,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div className={cn("box", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn(className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("muted", className)} {...props}>
      {children}
    </p>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("row", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBadge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
  variant?: "default" | "neutral" | "lime" | "yellow" | "violet" | "pink";
}) {
  return <span className={cn("tag", className)}>{children}</span>;
}
