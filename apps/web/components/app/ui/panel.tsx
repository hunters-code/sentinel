import { cn } from "@/lib/cn";

const cardClass = "rounded-2xl border p-6 md:p-8";
const cardStyle = {
  borderColor: "var(--sui-line)",
  background: "rgba(255, 255, 255, 0.04)",
};

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(cardClass, className)} style={cardStyle}>
      {children}
    </div>
  );
}
