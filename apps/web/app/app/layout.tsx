export default function AppRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="blue-dark min-h-dvh bg-sui-black">
      {children}
    </div>
  );
}
