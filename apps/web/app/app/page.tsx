import { Suspense } from "react";
import AppPageClient from "./app-page-client";

export default function AppPage() {
  return (
    <Suspense>
      <AppPageClient />
    </Suspense>
  );
}
