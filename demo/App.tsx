import React, { useState } from "react";
import { TransferList } from "@smart/react-transfer-list";
import type {
  TransferItem,
  FetchFn,
  AutocompleteFetchFn,
} from "@smart/react-transfer-list";

// ── Mock Data ──────────────────────────────────────────────────────────────
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

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState<TransferItem[]>([]);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        padding: "0 16px",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 4 }}>Transfer List Demo</h2>

      <TransferList
        label="Employees"
        remoteUrl="http://hrapi.localhost.mee:4015/sample-list"
        value={selected}
        onChange={setSelected}
        isFilter
        filters={[
          {
            type: "radio",
            key: "gender",
            label: "Gender",
            options: [
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ],
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
          {
            type: "checkbox",
            key: "employeeType",
            label: "Employee Type",
            options: [
              { label: "Staff", value: "staff" },
              { label: "Domestic Worker", value: "dw" },
            ],
            defaultValue: ["staff"],
          },
        ]}
      />
    </div>
  );
}
