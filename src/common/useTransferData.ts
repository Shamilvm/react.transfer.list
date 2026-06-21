import * as React from "react";
import {
  ActiveFilter,
  FetchFn,
  TransferItem,
} from "../types";
import { defaultFetchFn, excludeByIds, filterBySearch } from "./utils";

type UseTransferDataProps = {
  remoteUrl: string | TransferItem[];
  fetchFn: FetchFn;
  search: string;
  filter: ActiveFilter[];
  dataRight: TransferItem[];
};

export function useTransferData({
  remoteUrl,
  fetchFn,
  search,
  filter,
  dataRight,
}: UseTransferDataProps) {
  const [dataLeft, setDataLeft] = React.useState<TransferItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (Array.isArray(remoteUrl)) {
        const available = excludeByIds(remoteUrl, dataRight);
        setDataLeft(filterBySearch(available, search));
        return;
      }

      const queryFilter: ActiveFilter[] = [...filter];
      const rightItemIds = dataRight.map((item) => item.id);

      if (rightItemIds.length > 0) {
        queryFilter.push({ selectedIds: rightItemIds });
      }

      const result = await fetchFn(remoteUrl, {
        search,
        filter: queryFilter,
      });

      const data = Array.isArray(result) ? result : [];
      setDataLeft(excludeByIds(data, dataRight));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(message);
      setDataLeft([]);
    } finally {
      setLoading(false);
    }
  }, [remoteUrl, fetchFn, search, filter, dataRight]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dataLeft, setDataLeft, loading, error, refetch: fetchData };
}
