import { cn } from "@/lib/cn";

export function AppContentCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col rounded-[1.25rem] border border-card-border bg-card-fill py-6 px-5 pb-7 shadow-[inset_0_1px_0_theme(colors.card-accent)] md:p-8 md:pb-9",
        className,
      )}
    >
      {children}
    </div>
  );
}
