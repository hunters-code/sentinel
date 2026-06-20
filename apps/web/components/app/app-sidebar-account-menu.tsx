"use client";

import { useDisconnectWallet } from "@mysten/dapp-kit";
import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { shortAddr } from "@/lib/format";

export function AppSidebarAccountMenu({ address }: { address: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { mutate: disconnect } = useDisconnectWallet();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleDisconnect() {
    disconnect();
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="app-sidebar-account-menu">
      <button
        type="button"
        className="app-sidebar-bottom-account-trigger"
        title={address}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="app-sidebar-bottom-account">{shortAddr(address)}</span>
        <ChevronUp
          size={14}
          strokeWidth={2}
          className={cn("app-sidebar-account-chevron", open && "app-sidebar-account-chevron-open")}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="app-sidebar-account-dropdown" role="menu">
          <button
            type="button"
            role="menuitem"
            className="app-sidebar-account-dropdown-item"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
