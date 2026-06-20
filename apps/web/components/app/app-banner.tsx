"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export function AppBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="mx-4 mt-3 mb-2 flex items-center gap-[0.65rem] rounded-xl bg-content-persistent-white py-[0.65rem] px-3.5 text-content-persistent-black [&_p]:m-0 [&_p]:leading-[1.35]">

    </div>
  );
}
