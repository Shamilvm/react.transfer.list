import { AutocompleteFetchFn, FilterOption } from "../types";
import { withQueryParams } from "./query";

/** Maps `{ id, text }` or `{ label, value }` API rows to FilterOption */
export function mapToFilterOptions(data: unknown): FilterOption[] {
  if (!Array.isArray(data)) return [];

  return data
    .map((item): FilterOption | null => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;

      if (record.value != null && record.label != null) {
        return {
          value: String(record.value),
          label: String(record.label),
        };
      }

      if (record.id != null && record.text != null) {
        return {
          value: String(record.id),
          label: String(record.text),
        };
      }

      return null;
    })
    .filter((item): item is FilterOption => item != null);
}

export function mergeFilterOptions(...groups: FilterOption[][]): FilterOption[] {
  const seen = new Set<string>();
  const merged: FilterOption[] = [];

  for (const group of groups) {
    for (const option of group) {
      if (seen.has(option.value)) continue;
      seen.add(option.value);
      merged.push(option);
    }
  }

  return merged;
}

/** Default fetch for paginated `/list` endpoints */
export const defaultAutocompleteFetchFn: AutocompleteFetchFn = async (
  url,
  params = {},
) => {
  const query = new URLSearchParams();
  const search = params.search?.trim() ?? "";

  if (params.search !== undefined) query.set("search", search);
  query.append("limit", String(params.limit ?? 50));
  if (params.page !== undefined) {
    query.append("page", String(params.page));
  }

  const response = await fetch(withQueryParams(url, query), {
    method: "GET",
    signal: params.signal,
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (Array.isArray(result)) return mapToFilterOptions(result);
  if (Array.isArray(result?.data)) return mapToFilterOptions(result.data);
  return [];
};
