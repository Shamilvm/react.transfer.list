import * as React from "react";
import { AutocompleteFetchFn, FilterOption } from "../types";
import {
  defaultAutocompleteFetchFn,
  mergeFilterOptions,
  useDebouncedValue,
} from "./listFetch";

type UseRemoteListOptionsProps = {
  remoteUrl?: string;
  staticOptions?: FilterOption[];
  fetchFn?: AutocompleteFetchFn;
  search?: string;
  limit?: number;
  enabled?: boolean;
  selected?: FilterOption[];
};

export function useRemoteListOptions({
  remoteUrl,
  staticOptions = [],
  fetchFn = defaultAutocompleteFetchFn,
  search = "",
  limit = 50,
  enabled = true,
  selected = [],
}: UseRemoteListOptionsProps) {
  const [options, setOptions] = React.useState<FilterOption[]>(staticOptions);
  const [loading, setLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const selectedRef = React.useRef(selected);
  selectedRef.current = selected;

  const debouncedSearch = useDebouncedValue(search, 300);

  React.useEffect(() => {
    if (!remoteUrl) {
      setOptions(staticOptions);
      setHasMore(false);
    }
  }, [remoteUrl, staticOptions]);

  const fetchPage = React.useCallback(
    async (pageNum: number, append: boolean) => {
      if (!remoteUrl || !enabled) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        const result = await fetchFn(remoteUrl, {
          search: debouncedSearch,
          limit,
          page: pageNum,
        });

        if (controller.signal.aborted) return;

        setOptions((prev) =>
          mergeFilterOptions(
            append ? prev : [],
            result,
            selectedRef.current,
          ),
        );
        setHasMore(result.length >= limit);
        setPage(pageNum);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Failed to load options";
        setError(message);
        if (!append) {
          setOptions(mergeFilterOptions(selectedRef.current));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [remoteUrl, enabled, fetchFn, debouncedSearch, limit],
  );

  React.useEffect(() => {
    if (!remoteUrl) return;
    setPage(1);
    fetchPage(1, false);
  }, [remoteUrl, debouncedSearch, limit, enabled, fetchPage]);

  const loadMore = React.useCallback(() => {
    if (!hasMore || loading || loadingMore) return;
    fetchPage(page + 1, true);
  }, [hasMore, loading, loadingMore, fetchPage, page]);

  const refresh = React.useCallback(() => {
    setPage(1);
    fetchPage(1, false);
  }, [fetchPage]);

  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  return {
    options: remoteUrl ? options : staticOptions,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}

export function getListLimit(config: { limit?: number }): number {
  return config.limit ?? 50;
}
