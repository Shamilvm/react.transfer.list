import {
  ActiveFilter,
  FetchFn,
  FilterConfig,
  FilterOption,
  TransferItem,
} from "../types";

export function dedupeById(items: TransferItem[]): TransferItem[] {
  const seen = new Set<string | number>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function filterBySearch(
  items: TransferItem[],
  search: string,
): TransferItem[] {
  if (!search.trim()) return items;
  const lower = search.toLowerCase();
  return items.filter((item) =>
    item.text?.toString().toLowerCase().includes(lower),
  );
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
  return candidate.id != null && typeof candidate.text === "string";
}

export function parseTransferItems(data: unknown): TransferItem[] {
  if (!Array.isArray(data)) return [];
  return dedupeById(data.filter(isValidTransferItem));
}

export function buildFilterArray(
  filterValues: Record<string, unknown>,
  filters: FilterConfig[],
): ActiveFilter[] {
  return Object.entries(filterValues)
    .filter(([, val]) => {
      if (val == null) return false;
      if (val === "") return false;
      if (val === false) return false;
      if (Array.isArray(val) && val.length === 0) return false;
      return true;
    })
    .map(([key, val]) => {
      const config = filters.find((f) => f.key === key);
      if (config?.type === "autocomplete" && Array.isArray(val)) {
        return {
          [key]: (val as FilterOption[]).map((option) => option.value),
        };
      }
      return { [key]: val };
    });
}

export function getDefaultFilterValues(
  filters: FilterConfig[],
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  filters.forEach((filter) => {
    if (filter.defaultValue !== undefined) {
      defaults[filter.key] = filter.defaultValue;
    }
  });
  return defaults;
}

export function getChipLabel(
  filterObj: ActiveFilter,
  filters: FilterConfig[],
  filterValues: Record<string, unknown>,
): string {
  const key = Object.keys(filterObj)[0];
  const val = filterObj[key];
  const config = filters.find((f) => f.key === key);
  const displayKey = config?.label ?? key;

  if (config?.type === "autocomplete") {
    const selected = filterValues[key];
    if (Array.isArray(selected)) {
      const labels = (selected as FilterOption[])
        .map((option) => option.label)
        .join(", ");
      return `${displayKey}: ${labels}`;
    }
  }

  if (
    config?.options &&
    (config.type === "select" ||
      config.type === "radio" ||
      (config.type === "chip" && !config.multiple)) &&
    typeof val === "string"
  ) {
    const label =
      config.options.find((o) => o.value === val)?.label ?? val;
    return `${displayKey}: ${label}`;
  }

  if (config?.type === "chip" && config.multiple && Array.isArray(val)) {
    const labels = (val as string[])
      .map((v) => config.options?.find((o) => o.value === v)?.label ?? v)
      .join(", ");
    return `${displayKey}: ${labels}`;
  }

  if (config?.type === "switch") {
    return `${displayKey}: ${val ? "Yes" : "No"}`;
  }

  if (config?.type === "color" && typeof val === "string") {
    return `${displayKey}: ${val}`;
  }

  if (config?.type === "checkbox" && Array.isArray(val)) {
    const labels = (val as string[])
      .map((v) => config.options?.find((o) => o.value === v)?.label ?? v)
      .join(", ");
    return `${displayKey}: ${labels}`;
  }

  const displayVal = Array.isArray(val) ? val.join(", ") : String(val ?? "");
  return `${displayKey}: ${displayVal}`;
}

export const defaultFetchFn: FetchFn = async (url, { search, filter }) => {
  const filterParams = new URLSearchParams();
  filterParams.append("search", search ?? "");
  filterParams.append("filter", JSON.stringify(filter ?? []));

  const response = await fetch(`${url}?${filterParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  return [];
};
