export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blue-dark h-dvh overflow-hidden bg-bg-primary bg-[radial-gradient(ellipse_120%_70%_at_50%_110%,rgba(77,162,255,0.14)_0%,transparent_58%)]">
      {children}
    </div>
  );
}
