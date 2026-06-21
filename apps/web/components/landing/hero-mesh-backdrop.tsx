"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const MESH_BLOBS = [
  {
    id: "a",
    className:
      "left-[-18%] top-[-8%] h-[min(72vw,520px)] w-[min(72vw,520px)] bg-[radial-gradient(circle,rgba(92,169,255,0.42)_0%,rgba(41,141,255,0.18)_38%,transparent_68%)]",
    motion: "animate-hero-mesh-a",
  },
  {
    id: "b",
    className:
      "right-[-14%] top-[4%] h-[min(64vw,460px)] w-[min(64vw,460px)] bg-[radial-gradient(circle,rgba(41,141,255,0.36)_0%,rgba(0,46,106,0.14)_42%,transparent_70%)]",
    motion: "animate-hero-mesh-b",
  },
  {
    id: "c",
    className:
      "left-[22%] top-[18%] h-[min(58vw,400px)] w-[min(58vw,400px)] bg-[radial-gradient(circle,rgba(23,89,196,0.28)_0%,rgba(0,20,40,0.12)_45%,transparent_72%)]",
    motion: "animate-hero-mesh-c",
  },
  {
    id: "d",
    className:
      "bottom-[-12%] left-[-10%] h-[min(70vw,500px)] w-[min(70vw,500px)] bg-[radial-gradient(circle,rgba(0,46,106,0.55)_0%,rgba(0,20,40,0.22)_40%,transparent_68%)]",
    motion: "animate-hero-mesh-d",
  },
  {
    id: "e",
    className:
      "bottom-[8%] right-[8%] h-[min(52vw,380px)] w-[min(52vw,380px)] bg-[radial-gradient(circle,rgba(92,169,255,0.22)_0%,rgba(41,141,255,0.08)_48%,transparent_74%)]",
    motion: "animate-hero-mesh-e",
  },
] as const;

export function HeroMeshBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden bg-sui-black" aria-hidden>
      <div className="absolute inset-0 bg-landing-hero-mesh-base" />
      <div className="absolute inset-0 bg-landing-hero-mesh-tint opacity-90" />
      {MESH_BLOBS.map((blob) => (
        <div
          key={blob.id}
          className={cn(
            "pointer-events-none absolute rounded-full blur-[88px] will-change-transform md:blur-[104px]",
            blob.className,
            !reduce && blob.motion,
            reduce && "motion-reduce:animate-none",
          )}
        />
      ))}
      <div className="absolute inset-0 bg-landing-hero-vignette" />
    </div>
  );
}
