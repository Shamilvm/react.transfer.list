export type TransferItem = {
  id: string | number;
  text: string;
  media?: string;
};

/** Mirrors appForms field controllers — usable as filter field types */
export type FilterOptionType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "autocomplete"
  | "checkbox"
  | "switch"
  | "radio"
  | "date"
  | "time"
  | "datetime"
  | "slider"
  | "tags"
  | "color"
  | "chip";

export type FilterOption = {
  label: string;
  value: string;
};

export type ListFetchParams = {
  search?: string;
  limit?: number;
  page?: number;
};

export type FilterConfig = {
  type: FilterOptionType;
  label: string;
  key: string;
  options?: FilterOption[];
  /** API list URL — e.g. `apiSelectLink("admin/group")` */
  remoteUrl?: string;
  defaultValue?: unknown;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  multiple?: boolean;
  /** Page size for remote list APIs (default 50) */
  limit?: number;
  /** Grid column span (1 or 2) inside the filter panel */
  colSpan?: 1 | 2;
};

export type ActiveFilter = Record<string, unknown>;

export type FetchFn = (
  url: string,
  params: { search?: string; filter?: ActiveFilter[] },
) => Promise<TransferItem[]>;

export type AutocompleteFetchFn = (
  url: string,
  params?: ListFetchParams,
) => Promise<FilterOption[]>;

export type TransferListProps = {
  label: string;
  remoteUrl: string | TransferItem[];
  fetchFn?: FetchFn;
  value?: TransferItem[];
  onChange?: (items: TransferItem[]) => void;
  filters?: FilterConfig[];
  autocompleteFetchFn?: AutocompleteFetchFn;
  className?: string;
  isFilter?: boolean;
};

export type FilterPanelProps = {
  filters: FilterConfig[];
  filterValues: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onApply: () => void;
  onReset: () => void;
  autocompleteFetchFn?: AutocompleteFetchFn;
};
