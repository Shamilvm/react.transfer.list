import { ActiveFilter, FilterConfig, FilterOption, TransferItem } from "../types";

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

export function getDefaultFilterValues(filters: FilterConfig[]): Record<string, unknown> {
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
    const label = config.options.find((o) => o.value === val)?.label ?? val;
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

export function filterLocalItems(
  items: TransferItem[],
  filters: ActiveFilter[],
  configs: FilterConfig[],
): TransferItem[] {
  if (filters.length === 0) return items;

  const types = new Map(configs.map(({ key, type }) => [key, type]));
  const criteria = filters.reduce<[string, unknown][]>((entries, filter) => {
    entries.push(...Object.entries(filter));
    return entries;
  }, []);

  return items.filter((item) =>
    criteria.every(([key, expected]) => {
      if (!Object.prototype.hasOwnProperty.call(item, key)) return false;
      const actual = item[key as keyof TransferItem];
      const type = types.get(key);

      if (type === "text" || type === "textarea") {
        return (
          typeof actual === "string" &&
          actual.toLowerCase().includes(String(expected).trim().toLowerCase())
        );
      }

      const actualValues: unknown[] = Array.isArray(actual) ? actual : [actual];
      const expectedValues: unknown[] = Array.isArray(expected) ? expected : [expected];
      return expectedValues.some((value) => actualValues.includes(value));
    }),
  );
}
