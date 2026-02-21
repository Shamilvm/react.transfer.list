import * as React from "react";
import { TransferItem } from "../types";

/* ─────────────────────────────────────────────
   Icons
───────────────────────────────────────────── */

function ChevronDoubleRightIcon() {
    return (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
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
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    );
}

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type ListPanelProps = {
    items: TransferItem[];
    title: string;
    count: number;
    showCount?: boolean;
    isRight?: boolean;
    onToggleItem: (item: TransferItem) => void;
    onMoveAll: () => void;
    loading?: boolean;
};

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export function ListPanel({
    items,
    title,
    count,
    showCount,
    isRight = false,
    onToggleItem,
    onMoveAll,
    loading = false,
}: ListPanelProps) {
    return (
        <div
            style={{
                width: "100%",
                maxHeight: 500,
                overflow: "auto",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
            }}
        >
            {/* ─── Header ───────────────── */}
            <div
                style={{
                    padding: 16,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "sticky",
                    top: 0,
                    background: "#fff",
                    zIndex: 1,
                }}
            >
                <div style={{ fontWeight: 600 }}>
                    {title} {showCount && `(${count})`}
                </div>

                <button
                    onClick={onMoveAll}
                    disabled={items.length === 0}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: items.length === 0 ? "not-allowed" : "pointer",
                        color: isRight ? "#dc2626" : "#7c3aed",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 13,
                    }}
                >
                    {isRight ? "Remove all" : "Move all"}
                    {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
                </button>
            </div>

            {/* ─── Content ───────────────── */}
            {loading ? (
                <div
                    style={{
                        padding: 40,
                        textAlign: "center",
                        fontSize: 14,
                        color: "#666",
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
                        color: "#999",
                    }}
                >
                    {isRight ? "No items selected" : "No items available"}
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
                                padding: "10px 14px",
                                borderBottom: "1px solid #f2f2f2",
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "#f9f9f9")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "white")
                            }
                        >
                            {/* Avatar */}
                            {item.media ? (
                                <img
                                    src={item.media}
                                    alt={item.text}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        flexShrink: 0,
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: "50%",
                                        background: "#e5e7eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        color: "#555",
                                        flexShrink: 0,
                                    }}
                                >
                                    {item.text?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Text */}
                            <div style={{ flex: 1 }}>{item.text}</div>

                            {/* Action Icon */}
                            <div style={{ color: "#666", display: "flex" }}>
                                {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}