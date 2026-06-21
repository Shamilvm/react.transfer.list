import { FetchFn } from "../types";

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
