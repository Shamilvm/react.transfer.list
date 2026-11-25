import { TransferItem } from "../types";

export function dedupeById(items: TransferItem[]): TransferItem[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function filterBySearch(items: TransferItem[], search: string): TransferItem[] {
  if (!search.trim()) return items;
  const lower = search.toLowerCase();
  return items.filter((item) => item.text?.toString().toLowerCase().includes(lower));
}

export function excludeByIds(
  items: TransferItem[],
  excluded: TransferItem[],
): TransferItem[] {
  const excludedIds = new Set(excluded.map((item) => item.id));
  return items.filter((item) => !excludedIds.has(item.id));
}

export function isValidTransferItem(item: unknown): item is TransferItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as TransferItem;
  return (
    (typeof candidate.id === "string" ||
      (typeof candidate.id === "number" && Number.isFinite(candidate.id))) &&
    typeof candidate.text === "string" &&
    (candidate.media === undefined || typeof candidate.media === "string")
  );
}

export function parseTransferItems(data: unknown): TransferItem[] {
  if (!Array.isArray(data)) return [];
  return dedupeById(data.filter(isValidTransferItem));
}
