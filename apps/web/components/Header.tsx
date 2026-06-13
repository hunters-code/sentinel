"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ConnectButton } from "@mysten/dapp-kit";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "grid",
            placeItems: "center",
            width: 28,
            height: 28,
            borderRadius: 8,
            color: "#fff",
            background: "linear-gradient(150deg, var(--indigo), var(--periwinkle))",
          }}
        >
          <ShieldCheck size={17} strokeWidth={2.4} />
        </span>
        Sentinel
      </Link>
      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link href="/history" style={{ color: "var(--muted)", fontWeight: 500 }}>
          History
        </Link>
        <ConnectButton />
      </nav>
    </header>
  );
}
