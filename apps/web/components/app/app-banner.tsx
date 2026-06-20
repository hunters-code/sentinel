"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

export function AppBanner() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="app-banner">

    </div>
  );
}
