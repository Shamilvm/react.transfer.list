import * as React from "react";
import { chipStyle, inlineSearchStyle } from "../../styles/tokens";
import { CheckIcon } from "../../icons";

export function SelectionChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span style={chipStyle}>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{
          border: "none",
          background: "#bae6fd",
          color: "#0369a1",
          borderRadius: "50%",
          width: 16,
          height: 16,
          fontSize: 12,
          lineHeight: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: 0,
        }}
      >
        ×
      </button>
    </span>
  );
}

type MultiSelectBoxProps = {
  children: React.ReactNode;
  focused?: boolean;
  onClick?: () => void;
  minHeight?: number;
};

export function MultiSelectBox({
  children,
  focused = false,
  onClick,
  minHeight = 40,
}: MultiSelectBoxProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 6,
        padding: "6px 8px",
        minHeight,
        borderRadius: 8,
        border: `1px solid ${focused ? "#60a5fa" : "#cbd5e1"}`,
        background: "#fff",
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.14)" : "none",
        cursor: "text",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
    >
      {children}
    </div>
  );
}

export function MultiSelectToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "6px 12px",
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
        {selectedCount > 0
          ? `${selectedCount} of ${totalCount} selected`
          : `${totalCount} options`}
      </span>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onSelectAll}
          disabled={selectedCount === totalCount}
          style={{
            border: "none",
            background: "transparent",
            color: selectedCount === totalCount ? "#9ca3af" : "#0baae9",
            fontSize: 11,
            fontWeight: 600,
            cursor: selectedCount === totalCount ? "default" : "pointer",
            padding: 0,
          }}
        >
          Select all
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={selectedCount === 0}
          style={{
            border: "none",
            background: "transparent",
            color: selectedCount === 0 ? "#9ca3af" : "#dc2626",
            fontSize: 11,
            fontWeight: 600,
            cursor: selectedCount === 0 ? "default" : "pointer",
            padding: 0,
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function ToggleOptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 12px",
        borderRadius: 8,
        border: selected ? "1px solid #0baae9" : "1px solid #cbd5e1",
        background: selected
          ? "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)"
          : "#fff",
        color: selected ? "#0369a1" : "#334155",
        fontSize: 13,
        fontWeight: selected ? 600 : 500,
        cursor: "pointer",
        transition: "all 0.15s",
        boxShadow: selected ? "0 1px 2px rgba(11,170,233,0.15)" : "none",
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: selected ? "none" : "1.5px solid #d1d5db",
          background: selected ? "#0baae9" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {selected && <CheckIcon size={11} />}
      </span>
      {label}
    </button>
  );
}

export function DropdownOptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        border: "none",
        borderBottom: "1px solid #f3f4f6",
        background: selected ? "#f0f9ff" : "#fff",
        color: selected ? "#0369a1" : "#374151",
        fontSize: 13,
        textAlign: "left",
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = "#f9fafb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = selected ? "#f0f9ff" : "#fff";
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: selected ? "none" : "1.5px solid #d1d5db",
          background: selected ? "#0baae9" : "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {selected && <CheckIcon size={12} />}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
    </button>
  );
}

export { inlineSearchStyle };
