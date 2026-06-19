export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sentinel-app relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(41,141,255,0.18) 0%, transparent 55%), radial-gradient(ellipse 35% 25% at 100% 60%, rgba(0,46,106,0.45) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      {children}
    </div>
  );
}
