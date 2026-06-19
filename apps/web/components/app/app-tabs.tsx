"use client";

export type AppTab = "cover" | "history" | "wallet";

const TABS: { id: AppTab; label: string }[] = [
  { id: "cover", label: "Cover" },
  { id: "history", label: "History" },
  { id: "wallet", label: "Wallet" },
];

export function AppTabs({
  tab,
  onTabChange,
}: {
  tab: AppTab;
  onTabChange: (tab: AppTab) => void;
}) {
  return (
    <nav
      className="mb-8 flex gap-1 rounded-xl border p-1"
      style={{ borderColor: "var(--sui-line)", background: "rgba(255,255,255,0.03)" }}
      aria-label="App menu"
    >
      {TABS.map(({ id, label }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-current={active ? "page" : undefined}
            className="min-h-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={
              active
                ? { background: "var(--sui-blue-darker)", color: "var(--sui-white)" }
                : { color: "var(--sui-steel)" }
            }
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
