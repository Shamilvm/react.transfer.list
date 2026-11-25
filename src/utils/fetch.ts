import { FetchFn } from "../types";
import { withQueryParams } from "./query";

export const defaultFetchFn: FetchFn = async (url, { search, filter, signal }) => {
  const filterParams = new URLSearchParams();
  filterParams.append("search", search ?? "");
  filterParams.append("filter", JSON.stringify(filter ?? []));

  const response = await fetch(withQueryParams(url, filterParams), {
    method: "GET",
    signal,
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
