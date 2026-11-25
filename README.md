# @veeyem/react-transfer-list

A React dual-list (transfer list) component with search, configurable filters, remote data fetching, and copy/paste support.

## Features

- Two-panel picker: move items between **excluded** and **included** lists
- Search on both sides
- Optional filter panel (text, select, autocomplete, checkbox, and more)
- Remote list loading via pluggable `fetchFn` / `autocompleteFetchFn`
- Copy/paste selected items as JSON
- Zero runtime dependencies (React peer deps only)
- Styles injected automatically on first render

## Requirements

- React 18 or 19
- React DOM 18 or 19

## Installation

```bash
npm install @veeyem/react-transfer-list
```

## Quick start

### Static data

Pass an array as `remoteUrl` when you already have items in memory:

```tsx
import { useState } from "react";
import TransferList from "@veeyem/react-transfer-list";
import type { TransferItem } from "@veeyem/react-transfer-list";

const users: TransferItem[] = [
  { id: 1, text: "Alice" },
  { id: 2, text: "Bob" },
];

export function Example() {
  const [selected, setSelected] = useState<TransferItem[]>([]);

  return (
    <TransferList
      label="Users"
      remoteUrl={users}
      value={selected}
      onChange={setSelected}
      isFilter={false}
    />
  );
}
```

### Remote API

Pass a URL and optional custom fetch function:

```tsx
import TransferList, { defaultFetchFn } from "@veeyem/react-transfer-list";

<TransferList
  label="Employees"
  remoteUrl="/api/employees/list"
  fetchFn={defaultFetchFn}
  value={selected}
  onChange={setSelected}
/>;
```

`defaultFetchFn` sends `search` and `filter` query params and accepts either a raw array or `{ data: [...] }` in the JSON response.

## Filters

Enable the filter panel with `isFilter` and a `filters` config:

```tsx
import TransferList, { defaultAutocompleteFetchFn } from "@veeyem/react-transfer-list";

<TransferList
  label="Employees"
  remoteUrl="/api/employees/list"
  value={selected}
  onChange={setSelected}
  isFilter
  autocompleteFetchFn={defaultAutocompleteFetchFn}
  filters={[
    {
      type: "autocomplete",
      key: "group",
      label: "Group",
      remoteUrl: "/api/groups/list",
      limit: 50,
      colSpan: 2,
    },
    {
      type: "checkbox",
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ]}
/>;
```

For a local array, a filter's `key` identifies a property on each item, including any extra properties passed with the item. Text and textarea filters use case-insensitive substring matching. Other filters match exact values, and a multi-value filter matches if any selected value is present. Items must match every applied filter. Clearing search keeps the applied filters, and setting `isFilter={false}` suspends them until filters are enabled again.

Remote select, autocomplete, checkbox, chip, and radio fields accept a `remoteUrl` and a page size via `limit`. **Load more** adds another page when the previous page is full.

Supported filter field types: `text`, `number`, `textarea`, `select`, `autocomplete`, `checkbox`, `switch`, `radio`, `date`, `time`, `datetime`, `slider`, `tags`, `color`, `chip`.

## Custom fetch functions

### List fetch (`FetchFn`)

```tsx
import type { FetchFn } from "@veeyem/react-transfer-list";

const fetchFn: FetchFn = async (url, { search, filter, signal }) => {
  const endpoint = new URL(url, window.location.href);
  endpoint.searchParams.set("search", search ?? "");
  endpoint.searchParams.set("filter", JSON.stringify(filter ?? []));
  const response = await fetch(endpoint, { signal });
  const json = await response.json();
  return json.data;
};
```

### Autocomplete fetch (`AutocompleteFetchFn`)

Use `mapToFilterOptions` to normalize API rows shaped as `{ id, text }` or `{ label, value }`:

```tsx
import { mapToFilterOptions } from "@veeyem/react-transfer-list";
import type { AutocompleteFetchFn } from "@veeyem/react-transfer-list";

const autocompleteFetchFn: AutocompleteFetchFn = async (url, params) => {
  const endpoint = new URL(url, window.location.href);
  endpoint.searchParams.set("search", params?.search ?? "");
  endpoint.searchParams.set("limit", String(params?.limit ?? 50));
  endpoint.searchParams.set("page", String(params?.page ?? 1));
  const response = await fetch(endpoint, { signal: params?.signal });
  const json = await response.json();
  return mapToFilterOptions(json.data ?? json);
};
```

## Props

| Prop                  | Type                              | Default                      | Description                                                                           |
| --------------------- | --------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| `label`               | `string`                          | —                            | Base label for both panels (e.g. `"Users"` → `"Users excluded"` / `"Users included"`) |
| `remoteUrl`           | `string \| TransferItem[]`        | —                            | API URL or static item list for the left panel                                        |
| `fetchFn`             | `FetchFn`                         | `defaultFetchFn`             | Loads available items when `remoteUrl` is a string                                    |
| `value`               | `TransferItem[]`                  | —                            | Controlled list of included (right-side) items                                        |
| `onChange`            | `(items: TransferItem[]) => void` | —                            | Called when the included list changes                                                 |
| `filters`             | `FilterConfig[]`                  | `[]`                         | Filter field definitions                                                              |
| `autocompleteFetchFn` | `AutocompleteFetchFn`             | `defaultAutocompleteFetchFn` | Loads remote options for select/autocomplete filters                                  |
| `className`           | `string`                          | —                            | Extra class on the root element                                                       |
| `isFilter`            | `boolean`                         | `true`                       | Show filter toggle and filter panel                                                   |
| `enableOrdering`      | `boolean`                         | `false`                      | Number selected items and enable drag, button and keyboard reordering                            |

### `TransferItem`

```ts
type TransferItem = {
  id: string | number;
  text: string;
  media?: string; // optional avatar URL
};
```

## Exported helpers

| Export                                                  | Description                                       |
| ------------------------------------------------------- | ------------------------------------------------- |
| `defaultFetchFn`                                        | Default GET fetch for list endpoints              |
| `defaultAutocompleteFetchFn`                            | Default GET fetch for paginated option lists      |
| `mapToFilterOptions`                                    | Maps API rows to `{ label, value }`               |
| `dedupeById`                                            | Deduplicates items by `id`                        |
| `parseTransferItems`                                    | Parses and validates clipboard JSON               |
| `buildFilterArray`                                      | Builds active filter payload from form values     |
| `copyToClipboard`                                       | Copies text to the clipboard                      |
| `setTransferListClipboard` / `getTransferListClipboard` | In-memory clipboard shared between list instances |

Types are exported from the package entry: `TransferItem`, `TransferListProps`, `FilterConfig`, `FetchFn`, `AutocompleteFetchFn`, and others.

## Bulk transfers and clipboard

Bulk transfer buttons act on the rows shown in their panel. **Remove matches** keeps selected rows hidden by the active search. In autocomplete, **Select all** adds the currently displayed options and keeps existing selections.

Set `enableOrdering` to number the selected items and reorder them by dragging the grip, using the **Move up** / **Move down** buttons that appear on hover, or pressing <kbd>Alt</kbd>+<kbd>↑</kbd> / <kbd>Alt</kbd>+<kbd>↓</kbd> on a focused row. Drops land above or below the target row depending on the pointer position, and keyboard moves are announced to screen readers. Reordering passes the full selection in its new order to `onChange`. When a search is active, reordering moves visible items among their existing positions and leaves hidden items in their original positions.

Paste reads the system clipboard first and falls back to the shared in-page clipboard if the system clipboard cannot be read. Its status counts only newly added IDs.

## Local demo

Clone the repo and run the demo app. It builds the package first and imports it through the public ESM entry point.

```bash
npm ci
npm run demo
```

Open [http://localhost:3000](http://localhost:3000).

## Development

```bash
npm run build        # Build dist/ for publishing
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Vitest
```

## Release verification

Run `npm run verify` to type-check, lint, run the unit tests, build from a clean `dist/`, install the npm tarball in a temporary consumer, and build the demo against the package entry point. The tarball check imports and renders the component through CommonJS and ESM using the locally installed React peer dependencies.

GitHub Actions runs the same checks on pushes and pull requests with Node.js 22 and 24. `npm pack` rebuilds and verifies the tarball. `npm publish` also runs type-checking, lint, and unit tests before packaging.

## License

MIT — see [LICENSE](LICENSE).
