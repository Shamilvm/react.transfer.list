import * as React from "react";
import { TransferItem, ActiveFilter } from "../types";

type UseTransferDataProps = {
  remoteUrl: string;
  search: string;
  filter: ActiveFilter[];
  dataRight: TransferItem[];
};

export function useTransferData({
  remoteUrl,
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
      let queryFilter = [];
      const rightItemIds = dataRight?.map((e) => e.id);
      const filterParams = new URLSearchParams();

      for (const element of filter) {
        queryFilter.push(element);
      }

      if (rightItemIds?.length > 0) {
        queryFilter.push({ selectedIds: rightItemIds });
      }

      console.log(queryFilter, "<<<<<<<<<< filter", filter);

      filterParams.append("search", search);
      filterParams.append("filter", JSON.stringify(queryFilter));

      const response = await fetch(`${remoteUrl}?${filterParams.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result?.data?.length > 0) {
        const data = result.data as TransferItem[];
        const dataNotInRight = data.filter(
          (item: TransferItem) =>
            !dataRight.some((rightItem) => rightItem.id === item.id),
        );
        setDataLeft(dataNotInRight);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [remoteUrl, search, filter, dataRight]);

  React.useEffect(() => {
    fetchData();
  }, [search, filter]);

  return { dataLeft, setDataLeft, loading, error, refetch: fetchData };
}
