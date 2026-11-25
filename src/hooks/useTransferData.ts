import * as React from "react";
import { ActiveFilter, FetchFn, FilterConfig, TransferItem } from "../types";
import { excludeByIds, filterBySearch } from "../utils/items";
import { filterLocalItems } from "../utils/filters";
import { useDebouncedValue } from "./useDebouncedValue";

type UseTransferDataProps = {
  remoteUrl: string | TransferItem[];
  fetchFn: FetchFn;
  search: string;
  filter: ActiveFilter[];
  filterConfigs: FilterConfig[];
  dataRight: TransferItem[];
};

type RemoteResult = {
  request: (signal: AbortSignal) => Promise<TransferItem[]>;
  items: TransferItem[];
  error: string | null;
};

export function useTransferData({
  remoteUrl,
  fetchFn,
  search,
  filter,
  filterConfigs,
  dataRight,
}: UseTransferDataProps) {
  const debouncedSearch = useDebouncedValue(search);
  const [result, setResult] = React.useState<RemoteResult | null>(null);

  const request = React.useMemo(() => {
    if (typeof remoteUrl !== "string" || search !== debouncedSearch) return null;

    const queryFilter = [...filter];
    if (dataRight.length > 0) {
      queryFilter.push({ selectedIds: dataRight.map((item) => item.id) });
    }

    return async (signal: AbortSignal) =>
      fetchFn(remoteUrl, { search, filter: queryFilter, signal });
  }, [remoteUrl, fetchFn, search, debouncedSearch, filter, dataRight]);

  React.useEffect(() => {
    if (!request) return;

    const controller = new AbortController();
    request(controller.signal).then(
      (items) => {
        if (!controller.signal.aborted) {
          setResult({ request, items: Array.isArray(items) ? items : [], error: null });
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error ? error.message : "Failed to fetch data";
          setResult({ request, items: [], error: message });
        }
      },
    );
    return () => controller.abort();
  }, [request]);

  if (Array.isArray(remoteUrl)) {
    return {
      dataLeft: filterLocalItems(
        filterBySearch(excludeByIds(remoteUrl, dataRight), search),
        filter,
        filterConfigs,
      ),
      loading: false,
      error: null,
    };
  }

  const current = result?.request === request ? result : null;
  return {
    dataLeft: current ? excludeByIds(current.items, dataRight) : [],
    loading: current === null,
    error: current?.error ?? null,
  };
}
