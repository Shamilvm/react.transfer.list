import { useState } from "react";
import TransferList, {
  defaultAutocompleteFetchFn,
  mapToFilterOptions,
} from "@smart/react-transfer-list";
import type {
  TransferItem,
  FetchFn,
  AutocompleteFetchFn,
} from "@smart/react-transfer-list";

const MOCK_EMPLOYEES: TransferItem[] = [
  { id: 1, text: "Alice Johnson", media: "https://i.pravatar.cc/40?img=1" },
  { id: 2, text: "Bob Smith", media: "https://i.pravatar.cc/40?img=2" },
  { id: 3, text: "Carol White", media: "https://i.pravatar.cc/40?img=3" },
  { id: 4, text: "David Brown", media: "https://i.pravatar.cc/40?img=4" },
  { id: 5, text: "Eva Martinez", media: "https://i.pravatar.cc/40?img=5" },
  { id: 6, text: "Frank Lee", media: "https://i.pravatar.cc/40?img=6" },
  { id: 7, text: "Grace Kim", media: "https://i.pravatar.cc/40?img=7" },
  { id: 8, text: "Henry Wilson", media: "https://i.pravatar.cc/40?img=8" },
  { id: 9, text: "Isla Davis", media: "https://i.pravatar.cc/40?img=9" },
  { id: 10, text: "Jack Turner", media: "https://i.pravatar.cc/40?img=10" },
];

const ALL_GROUPS = [
  { id: "eng", text: "Engineering" },
  { id: "sales", text: "Sales" },
  { id: "hr", text: "HR" },
  { id: "ops", text: "Operations" },
  { id: "finance", text: "Finance" },
];

const mockFetchFn: FetchFn = async (_url, { search, filter }) => {
  let data = [...MOCK_EMPLOYEES];

  const statusFilter = filter?.find((f) => "status" in f)?.status as
    | string[]
    | undefined;
  if (statusFilter?.length) {
    data = data.filter((item) => {
      const isActive = Number(item.id) <= 7;
      return statusFilter.includes(isActive ? "active" : "inactive");
    });
  }

  if (search) {
    const lower = search.toLowerCase();
    data = data.filter((item) => item.text.toLowerCase().includes(lower));
  }

  return data;
};

/** Mirrors app's `axiosGet({ url: apiSelectLink(...), params: { search, limit } })` */
const mockAutocompleteFetchFn: AutocompleteFetchFn = async (_url, params) => {
  const search = params?.search?.toLowerCase() ?? "";
  const limit = params?.limit ?? 50;
  const page = params?.page ?? 1;

  let data = ALL_GROUPS;
  if (search) {
    data = data.filter((g) => g.text.toLowerCase().includes(search));
  }

  const start = (page - 1) * limit;
  return mapToFilterOptions(data.slice(start, start + limit));
};

/**
 * In CRM app, wire like this:
 *
 * import { axiosGet } from "@function/service";
 * import { apiSelectLink } from "@function/service/functions";
 * import { mapToFilterOptions } from "@smart/react-transfer-list";
 *
 * const appAutocompleteFetchFn: AutocompleteFetchFn = async (url, params) => {
 *   const data = await axiosGet({
 *     url,
 *     params: { search: params?.search ?? "", limit: params?.limit ?? 50 },
 *   });
 *   return mapToFilterOptions(data);
 * };
 */

export default function App() {
  const [selected, setSelected] = useState<TransferItem[]>([]);

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 4 }}>Transfer List Demo</h2>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>
        Selected: {selected.length} item(s)
      </p>

      <TransferList
        label="Employees"
        remoteUrl="/mock/employees"
        fetchFn={mockFetchFn}
        value={selected}
        onChange={setSelected}
        isFilter
        autocompleteFetchFn={mockAutocompleteFetchFn}
        filters={[
          {
            type: "autocomplete",
            key: "group",
            label: "Group",
            remoteUrl: "/api/admin/group/list",
            limit: 50,
            colSpan: 2,
          },
          {
            type: "select",
            key: "department",
            label: "Department",
            remoteUrl: "/api/admin/department/list",
            limit: 30,
          },
          {
            type: "checkbox",
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            defaultValue: ["active"],
          },
        ]}
      />
    </div>
  );
}
