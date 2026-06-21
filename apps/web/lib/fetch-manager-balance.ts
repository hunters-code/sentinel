import type { SuiClient } from "@mysten/sui/client";
import { DUSDC_TYPE, DUSDC_UNIT } from "@sentinel/shared";

type MoveFields = Record<string, unknown>;

function asFields(value: unknown): MoveFields | null {
  if (value == null || typeof value !== "object") return null;
  const record = value as MoveFields;
  return record.fields && typeof record.fields === "object"
    ? (record.fields as MoveFields)
    : record;
}

function nestedId(value: unknown): string | null {
  const fields = asFields(value);
  const id = fields?.id;
  if (typeof id === "string") return id;
  const nested = asFields(id);
  return typeof nested?.id === "string" ? nested.id : null;
}

/** Reads dUSDC balance held in a PredictManager's embedded balance manager bag. */
export async function fetchManagerBalanceUsd(
  client: SuiClient,
  managerId: string,
): Promise<number> {
  const obj = await client.getObject({
    id: managerId,
    options: { showContent: true },
  });

  const managerFields = asFields(obj.data?.content);
  const balanceManager = asFields(managerFields?.balance_manager);
  const balancesBag = asFields(balanceManager?.balances);
  const bagId = nestedId(balancesBag?.id ?? balancesBag);

  if (!bagId) return 0;

  const dynamicFields = await client.getDynamicFields({ parentId: bagId });
  const dusdcMarker = `::${DUSDC_TYPE.split("::").slice(-2).join("::")}`;

  for (const entry of dynamicFields.data) {
    const objectType = entry.objectType ?? "";
    if (!objectType.includes("dusdc::DUSDC") && !objectType.includes(dusdcMarker)) continue;

    const balanceField = await client.getObject({
      id: entry.objectId,
      options: { showContent: true },
    });
    const value = asFields(balanceField.data?.content)?.value;
    if (value == null) continue;
    return Number(value) / DUSDC_UNIT;
  }

  return 0;
}
