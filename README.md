# react-transfer-list

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
npm install react-transfer-list
```

## Quick start

### Static data

Pass an array as `remoteUrl` when you already have items in memory:

```tsx
import { useState } from "react";
import TransferList from "react-transfer-list";
import type { TransferItem } from "react-transfer-list";

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
import TransferList, { defaultFetchFn } from "react-transfer-list";

<TransferList
  label="Employees"
  remoteUrl="/api/employees/list"
  fetchFn={defaultFetchFn}
  value={selected}
  onChange={setSelected}
/>
```

`defaultFetchFn` sends `search` and `filter` query params and accepts either a raw array or `{ data: [...] }` in the JSON response.

## Filters

Enable the filter panel with `isFilter` and a `filters` config:

```tsx
import TransferList, { defaultAutocompleteFetchFn } from "react-transfer-list";

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
/>
```

Supported filter field types: `text`, `number`, `textarea`, `select`, `autocomplete`, `checkbox`, `switch`, `radio`, `date`, `time`, `datetime`, `slider`, `tags`, `color`, `chip`.

## Custom fetch functions

### List fetch (`FetchFn`)

```tsx
import type { FetchFn } from "react-transfer-list";

const fetchFn: FetchFn = async (url, { search, filter }) => {
  const response = await fetch(`${url}?search=${search ?? ""}`);
  const json = await response.json();
  return json.data;
};
```

### Autocomplete fetch (`AutocompleteFetchFn`)

Use `mapToFilterOptions` to normalize API rows shaped as `{ id, text }` or `{ label, value }`:

```tsx
import { mapToFilterOptions } from "react-transfer-list";
import type { AutocompleteFetchFn } from "react-transfer-list";

const autocompleteFetchFn: AutocompleteFetchFn = async (url, params) => {
  const response = await fetch(
    `${url}?search=${params?.search ?? ""}&limit=${params?.limit ?? 50}`,
  );
  const json = await response.json();
  return mapToFilterOptions(json.data ?? json);
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Base label for both panels (e.g. `"Users"` → `"Users excluded"` / `"Users included"`) |
| `remoteUrl` | `string \| TransferItem[]` | — | API URL or static item list for the left panel |
| `fetchFn` | `FetchFn` | `defaultFetchFn` | Loads available items when `remoteUrl` is a string |
| `value` | `TransferItem[]` | — | Controlled list of included (right-side) items |
| `onChange` | `(items: TransferItem[]) => void` | — | Called when the included list changes |
| `filters` | `FilterConfig[]` | `[]` | Filter field definitions |
| `autocompleteFetchFn` | `AutocompleteFetchFn` | `defaultAutocompleteFetchFn` | Loads remote options for select/autocomplete filters |
| `className` | `string` | — | Extra class on the root element |
| `isFilter` | `boolean` | `true` | Show filter toggle and filter panel |

### `TransferItem`

```ts
type TransferItem = {
  id: string | number;
  text: string;
  media?: string; // optional avatar URL
};
```

## Exported helpers

| Export | Description |
|--------|-------------|
| `defaultFetchFn` | Default GET fetch for list endpoints |
| `defaultAutocompleteFetchFn` | Default GET fetch for paginated option lists |
| `mapToFilterOptions` | Maps API rows to `{ label, value }` |
| `dedupeById` | Deduplicates items by `id` |
| `parseTransferItems` | Parses and validates clipboard JSON |
| `buildFilterArray` | Builds active filter payload from form values |
| `copyToClipboard` | Copies text to the clipboard |
| `setTransferListClipboard` / `getTransferListClipboard` | In-memory clipboard shared between list instances |

Types are exported from the package entry: `TransferItem`, `TransferListProps`, `FilterConfig`, `FetchFn`, `AutocompleteFetchFn`, and others.

## Local demo

Clone the repo and run the demo app (uses live `src/`, not the built `dist/`):

```bash
npm install
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

## License

MIT — see [LICENSE](LICENSE).
