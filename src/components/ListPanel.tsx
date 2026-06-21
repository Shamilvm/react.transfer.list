import * as React from "react";
import { TransferItem } from "../types";

function ChevronDoubleRightIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="9" r="5.5" />
      <path d="M14 14l3 3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M5 13H4a1.5 1.5 0 01-1.5-1.5V4A1.5 1.5 0 014 2.5h7.5A1.5 1.5 0 0113 4v1" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.5h6l1 2H6l1-2z" />
      <rect x="5" y="5.5" width="10" height="11" rx="1.5" />
    </svg>
  );
}

type ListPanelProps = {
  items: TransferItem[];
  title: string;
  count: number;
  totalCount?: number;
  showCount?: boolean;
  isRight?: boolean;
  onToggleItem: (item: TransferItem) => void;
  onMoveAll: () => void;
  loading?: boolean;
  error?: string | null;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  onCopy?: () => void;
  onPaste?: () => void;
  copyPasteMessage?: string | null;
};

const panelStyle: React.CSSProperties = {
  width: "100%",
  maxHeight: 500,
  display: "flex",
  flexDirection: "column",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
  overflow: "hidden",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const scrollBodyStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  overflowX: "hidden",
  scrollbarWidth: "thin",
  scrollbarColor: "#d1d5db transparent",
};

const toolbarBtnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "5px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#fff",
  color: "#374151",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  transition: "background 0.15s, border-color 0.15s, color 0.15s",
  lineHeight: 1.2,
};

export function ListPanel({
  items,
  title,
  count,
  totalCount,
  showCount,
  isRight = false,
  onToggleItem,
  onMoveAll,
  loading = false,
  error = null,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onCopy,
  onPaste,
  copyPasteMessage,
}: ListPanelProps) {
  const moveAllDisabled = (totalCount ?? count) === 0;
  const displayCount =
    showCount && totalCount != null && totalCount !== count
      ? `${count} / ${totalCount}`
      : showCount
        ? String(count)
        : null;

  return (
    <div style={panelStyle}>
      {/* Fixed header — does not scroll */}
      <div
        style={{
          flexShrink: 0,
          padding: "12px 14px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginBottom: onSearchChange || onCopy || onPaste ? 10 : 0,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
            {title}
            {displayCount != null && (
              <span style={{ fontWeight: 500, color: "#6b7280", marginLeft: 4 }}>
                ({displayCount})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onMoveAll}
            disabled={moveAllDisabled}
            style={{
              border: "none",
              background: "transparent",
              cursor: moveAllDisabled ? "not-allowed" : "pointer",
              color: isRight ? "#dc2626" : "#7c3aed",
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 500,
              opacity: moveAllDisabled ? 0.45 : 1,
              padding: "2px 4px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {isRight ? "Remove all" : "Move all"}
            {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
          </button>
        </div>

        {(onSearchChange || onCopy || onPaste) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {onSearchChange && (
              <div
                style={{
                  position: "relative",
                  flex: "1 1 140px",
                  minWidth: 120,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "7px 30px 7px 32px",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    fontSize: 13,
                    color: "#111827",
                    outline: "none",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#93c5fd";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onSearchChange("")}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "#f3f4f6",
                      color: "#6b7280",
                      borderRadius: "50%",
                      width: 18,
                      height: 18,
                      fontSize: 12,
                      lineHeight: 1,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {(onCopy || onPaste) && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexShrink: 0,
                  padding: 2,
                  borderRadius: 8,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              >
                {onCopy && (
                  <button
                    type="button"
                    onClick={onCopy}
                    title="Copy selected items as JSON"
                    style={toolbarBtnBase}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f9ff";
                      e.currentTarget.style.borderColor = "#bae6fd";
                      e.currentTarget.style.color = "#0369a1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.color = "#374151";
                    }}
                  >
                    <CopyIcon />
                    Copy
                  </button>
                )}
                {onPaste && (
                  <button
                    type="button"
                    onClick={onPaste}
                    title="Paste items from clipboard JSON"
                    style={{
                      ...toolbarBtnBase,
                      border: "none",
                      borderRadius: 6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0fdf4";
                      e.currentTarget.style.color = "#15803d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.color = "#374151";
                    }}
                  >
                    <PasteIcon />
                    Paste
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {copyPasteMessage && (
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: copyPasteMessage.toLowerCase().includes("fail")
                ? "#dc2626"
                : "#059669",
              padding: "4px 8px",
              borderRadius: 6,
              background: copyPasteMessage.toLowerCase().includes("fail")
                ? "#fef2f2"
                : "#ecfdf5",
            }}
          >
            {copyPasteMessage}
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            flexShrink: 0,
            padding: "10px 14px",
            fontSize: 13,
            color: "#dc2626",
            background: "#fef2f2",
            borderBottom: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* Scrollable list body only */}
      <div style={scrollBodyStyle} className="stl-list-scroll">
        {loading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              fontSize: 14,
              color: "#6b7280",
            }}
          >
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              fontSize: 14,
              color: "#9ca3af",
            }}
          >
            {isRight
              ? search
                ? "No matching items"
                : "No items selected"
              : search
                ? "No matching items"
                : "No items available"}
          </div>
        ) : (
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleItem(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 14px",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.media ? (
                  <img
                    src={item.media}
                    alt={item.text}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 12,
                      color: "#555",
                      flexShrink: 0,
                    }}
                  >
                    {item.text?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#111827",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </div>

                <div
                  style={{
                    color: "#9ca3af",
                    display: "flex",
                    flexShrink: 0,
                  }}
                >
                  {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .stl-list-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .stl-list-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .stl-list-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 999px;
        }
        .stl-list-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
