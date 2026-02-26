import React, { useState } from "react";
import { TransferList } from "@smart/react-transfer-list";
import type { TransferItem, FetchFn, AutocompleteFetchFn } from "@smart/react-transfer-list";

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

const MOCK_DEPARTMENTS = [
    { label: "Engineering", value: "engineering" },
    { label: "HR", value: "hr" },
    { label: "Finance", value: "finance" },
    { label: "Marketing", value: "marketing" },
];

// ── Mock fetchFn ───────────────────────────────────────────────────────────
const fetchFn: FetchFn = async (_url: any, params: any) => {
    await new Promise((r) => setTimeout(r, 400));

    let results = [...MOCK_EMPLOYEES];

    if (params.search) {
        results = results.filter((e) =>
            e.text.toLowerCase().includes(params.search!.toLowerCase())
        );
    }

    const selectedIds =
        params.filter?.find((f) => f.selectedIds)?.selectedIds ?? [];
    results = results.filter((e) => !selectedIds.includes(e.id));

    return results;
};

// ── Mock autocompleteFetchFn ───────────────────────────────────────────────
const autocompleteFetchFn: AutocompleteFetchFn = async (_url: any, search: any) => {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_DEPARTMENTS.filter((d) =>
        d.label.toLowerCase().includes((search ?? "").toLowerCase())
    );
};

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
    const [selected, setSelected] = useState<TransferItem[]>([]);

    return (
        <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
            <h2 style={{ marginBottom: 4 }}>TransferList Demo</h2>
            <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
                Selected IDs: {selected.map((e) => e.id).join(", ") || "none"}
            </p>

            <TransferList
                label="Employees"
                remoteUrl="/api/employees"
                fetchFn={fetchFn}
                value={selected}
                onChange={setSelected}
                isFilter
                filters={[
                    {
                        type: "autocomplete",
                        key: "department",
                        label: "Department",
                        remoteUrl: "/api/departments",
                    },
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
                autocompleteFetchFn={autocompleteFetchFn}
            />
        </div>
    );
}