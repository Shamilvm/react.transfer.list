export function withQueryParams(url: string, params: URLSearchParams): string {
  const hashIndex = url.indexOf("#");
  const fragment = hashIndex < 0 ? "" : url.slice(hashIndex);
  const address = hashIndex < 0 ? url : url.slice(0, hashIndex);
  const queryIndex = address.indexOf("?");
  const path = queryIndex < 0 ? address : address.slice(0, queryIndex);
  const query = new URLSearchParams(queryIndex < 0 ? "" : address.slice(queryIndex + 1));

  params.forEach((value, key) => query.set(key, value));
  const search = query.toString();
  return `${path}${search ? `?${search}` : ""}${fragment}`;
}
