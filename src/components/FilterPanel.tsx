import * as React from "react";
import { FilterPanelProps } from "../types";
import { FilterField } from "./filter/FilterField";

function hasFilterValue(val: unknown): boolean {
  if (val == null) return false;
  if (val === "") return false;
  if (Array.isArray(val) && val.length === 0) return false;
  if (typeof val === "boolean") return val;
  return true;
}

export function FilterPanel({
  filters,
  filterValues,
  onChange,
  onApply,
  onReset,
  autocompleteFetchFn,
}: FilterPanelProps) {
  const hasAnyFilter = filters.some((f) => hasFilterValue(filterValues[f.key]));

  return (
    <div
      style={{
        marginTop: 12,
        marginBottom: 12,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
          Filters
        </div>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          {filters.length} field{filters.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Scrollable fields grid */}
      <div
        className="stl-filter-scroll"
        style={{
          maxHeight: 360,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 16,
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
        }}
      >
        <div
          className="stl-filter-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {filters.map((config) => (
            <div
              key={config.key}
              style={{
                gridColumn: config.colSpan === 2 ? "1 / -1" : undefined,
                padding: 12,
                borderRadius: 8,
                border: "1px solid #f3f4f6",
                background: "#fcfcfd",
              }}
            >
              <FilterField
                config={config}
                value={filterValues[config.key]}
                onChange={(val) => onChange(config.key, val)}
                autocompleteFetchFn={autocompleteFetchFn}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          background: "#fafafa",
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#374151",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          type="button"
          disabled={!hasAnyFilter}
          onClick={onApply}
          style={{
            padding: "7px 16px",
            borderRadius: 8,
            border: "none",
            background: hasAnyFilter ? "#0baae9" : "#d1d5db",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: hasAnyFilter ? "pointer" : "not-allowed",
            boxShadow: hasAnyFilter ? "0 1px 3px rgba(11,170,233,0.35)" : "none",
          }}
        >
          Apply Filters
        </button>
      </div>

      <style>{`
        .stl-filter-scroll::-webkit-scrollbar { width: 6px; }
        .stl-filter-scroll::-webkit-scrollbar-track { background: transparent; }
        .stl-filter-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 999px;
        }
        @media (max-width: 640px) {
          .stl-filter-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
