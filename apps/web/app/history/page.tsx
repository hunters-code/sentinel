"use client";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { Header } from "@/components/Header";

export default function HistoryPage() {
  const account = useCurrentAccount();

  return (
    <>
      <Header />
      <main>
        <h1>History</h1>
        {account ? (
          <p style={{ color: "var(--muted)" }}>No policies yet.</p>
        ) : (
          <p style={{ color: "var(--muted)" }}>
            Connect your wallet to see past policies.
          </p>
        )}
      </main>
    </>
  );
}
