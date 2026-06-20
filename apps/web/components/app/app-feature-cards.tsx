"use client";

import type { LucideIcon } from "lucide-react";

export type AppFeatureCardItem = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function AppFeatureCards({ items }: { items: AppFeatureCardItem[] }) {
  return (
    <ul className="app-feature-cards">
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title} className="app-feature-card">
          <div className="app-feature-card-icon-wrap" aria-hidden>
            <Icon size={20} strokeWidth={1.75} />
          </div>
          <div className="app-feature-card-content">
            <h3 className="app-feature-card-title">{title}</h3>
            <p className="app-feature-card-body">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
