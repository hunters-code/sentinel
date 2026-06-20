"use client";

import type { LucideIcon } from "lucide-react";

export type AppFeatureCardItem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function AppFeatureCards({ items }: { items: AppFeatureCardItem[] }) {
  return (
    <ul className="m-0 mb-6 flex w-full list-none flex-col gap-2 self-stretch p-0">
      {items.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex min-h-[3.75rem] w-full items-stretch overflow-hidden rounded-2xl border border-card-border bg-card-fill text-left transition-[border-color,box-shadow] duration-150 hover:border-[rgba(77,162,255,0.55)] hover:shadow-[inset_0_1px_0_theme(colors.card-accent)]"
        >
          <div
            className="flex w-[3.75rem] shrink-0 items-center justify-center border-r border-separator bg-card-accent text-bg-accent"
            aria-hidden
          >
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-[0.15rem] py-3 px-4">
            <h3 className="m-0 text-[0.8125rem] font-semibold leading-[1.3] text-content-primary">
              {title}
            </h3>
            <p className="m-0 text-[0.8125rem] leading-[1.45] text-content-secondary">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
