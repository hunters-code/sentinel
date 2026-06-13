import { Header } from "@/components/Header";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main>
        <h1>Policy receipt</h1>
        <p style={{ color: "var(--muted)" }}>Policy ID: {id}</p>

        <section
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 16,
            marginTop: 16,
          }}
        >
          <p>Coverage: —</p>
          <p>Trigger: —</p>
          <p>Expiry: —</p>
          <p>Premium paid: —</p>
          <p>Status: ACTIVE</p>
        </section>
      </main>
    </>
  );
}
