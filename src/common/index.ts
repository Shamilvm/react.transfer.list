import * as React from "react";
import { TransferItem, FetchFn, ActiveFilter } from "../types";

type UseTransferDataProps = {
    remoteUrl: string;
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
            const result = await fetchFn(remoteUrl, { search, filter });
            if (result) {
                const dataNotInRight = result.filter(
                    (item) => !dataRight.some((rightItem) => rightItem.id === item.id)
                );
                setDataLeft(dataNotInRight);
            }
        } catch (err: any) {
            setError(err?.message ?? "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [remoteUrl, fetchFn, search, filter, dataRight]);

    React.useEffect(() => {
        fetchData();
    }, [search, filter]);

    return { dataLeft, setDataLeft, loading, error, refetch: fetchData };
}