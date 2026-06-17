"use client";

// Low-fi: all motion removed. These are plain passthrough wrappers kept so
// existing imports keep working. Re-introduce animation when rebuilding.

import type { ReactNode } from "react";

type DivProps = {
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
};

function passthroughDiv(props: DivProps) {
  const { children, className } = props;
  return <div className={className}>{children}</div>;
}

export function Reveal(props: DivProps) {
  return passthroughDiv(props);
}

export function HeroReveal(props: DivProps) {
  return passthroughDiv(props);
}

export function Stagger({ children, className }: { children: ReactNode; className?: string; stagger?: number }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function PopCard({ children, className }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={className}>{children}</div>;
}

export function BarFill({ className, widthPct }: { className?: string; widthPct: number; delay?: number }) {
  return <div className={className} style={{ width: `${widthPct}%` }} />;
}

export function MotionNav({ children, className }: { children: ReactNode; className?: string }) {
  return <header className={className}>{children}</header>;
}

export function ValuePop({
  value,
  className,
  children,
}: {
  value: string | number;
  className?: string;
  children?: ReactNode;
}) {
  return <span className={className}>{children ?? value}</span>;
}

export function StampWiggle({ children, className }: { children: ReactNode; className?: string; deg?: number }) {
  return <span className={className}>{children}</span>;
}

export function MotionChip({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

export function PulseWrap({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
