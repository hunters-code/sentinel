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
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-xs font-medium leading-[1.2] text-content-persistent-white opacity-[0.92] transition-opacity duration-150 hover:opacity-100"
        title={address}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {shortAddr(address)}
        </span>
        <ChevronUp
          size={14}
          strokeWidth={2}
          className={cn(
            "shrink-0 opacity-60 transition-[transform,opacity] duration-150",
            open && "opacity-90",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          className="absolute inset-x-0 bottom-[calc(100%+0.5rem)] z-20 rounded-xl border border-border-neutral bg-sui-black p-1 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            className="block w-full cursor-pointer rounded-lg border-none bg-transparent py-2 px-2.5 text-left text-xs font-medium leading-[1.2] text-content-persistent-white transition-colors duration-150 hover:bg-white/[0.08]"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        </div>
      ) : null}
    </div>
  );
}
