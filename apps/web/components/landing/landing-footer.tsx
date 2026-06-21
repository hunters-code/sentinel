export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--color-chrome-border)] bg-sui-black px-6 py-8 text-sm text-sui-steel md:px-10">
      <div className="mx-auto flex w-full max-w-container flex-col justify-between gap-3 md:flex-row md:items-center">
        <p className="m-0">Sentinel is a parametric coverage interface built on DeepBook Predict.</p>
        <p className="m-0">Coverage window follows oracle expiry, not a guaranteed fixed duration.</p>
      </div>
    </footer>
  );
}
