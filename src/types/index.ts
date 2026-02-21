export type TransferItem = {
    id: string | number;
    text: string;
    media?: string;
};

export type FilterOptionType = "checkbox" | "radio" | "autocomplete" | "text";

export type FilterOption = {
    label: string;
    value: string;
};

export type FilterConfig = {
    type: FilterOptionType;
    label: string;
    key: string;
    options?: FilterOption[];
    remoteUrl?: string; // for autocomplete remote fetch
    defaultValue?: any;
};

export type ActiveFilter = Record<string, any>;

export type FetchFn = (url: string, params: { search?: string; filter?: ActiveFilter[] }) => Promise<TransferItem[]>;

export type AutocompleteFetchFn = (url: string, search?: string) => Promise<FilterOption[]>;

export type TransferListProps = {
    label: string;
    remoteUrl: string;
    fetchFn: FetchFn;
    value?: TransferItem[];
    onChange?: (items: TransferItem[]) => void;
    filters?: FilterConfig[];
    autocompleteFetchFn?: AutocompleteFetchFn;
    className?: string;
    isFilter?: boolean;
};

export type FilterPanelProps = {
    filters: FilterConfig[];
    filterValues: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onApply: () => void;
    autocompleteFetchFn?: AutocompleteFetchFn;
};