import * as React from "react";
import { FilterPanelProps } from "../types";

export function FilterPanel({
    filters,
    filterValues,
    onChange,
    onApply,
    autocompleteFetchFn,
}: FilterPanelProps) {
    const hasAnyFilter = filters.some((f) => {
        const val = filterValues[f.key];
        if (Array.isArray(val)) return val.length > 0;
        return !!val;
    });

    return (
        <div
            style={{
                padding: 16,
                marginTop: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "#fafafa",
            }}
        >
            {filters.map((config) => {
                const value = filterValues[config.key];

                //autocomplete 
                if (config.type === "autocomplete") {
                    return (
                        <div
                            key={config.key}
                            style={{ display: "flex", gap: 16, alignItems: "center" }}
                        >
                            <div style={{ minWidth: 120, fontWeight: 500 }}>
                                {config.label}
                            </div>

                            <RemoteAutocomplete
                                config={config}
                                value={value ?? []}
                                onChange={(val) => onChange(config.key, val)}
                                autocompleteFetchFn={autocompleteFetchFn}
                            />
                        </div>
                    );
                }

                //radio
                if (config.type === "radio") {
                    return (
                        <div
                            key={config.key}
                            style={{ display: "flex", gap: 16, alignItems: "center" }}
                        >
                            <div style={{ minWidth: 120, fontWeight: 500 }}>
                                {config.label}
                            </div>

                            <div style={{ display: "flex", gap: 16 }}>
                                {config.options?.map((opt) => (
                                    <label key={opt.value} style={{ cursor: "pointer" }}>
                                        <input
                                            type="radio"
                                            name={config.key}
                                            value={opt.value}
                                            checked={value === opt.value}
                                            onChange={(e) =>
                                                onChange(config.key, e.target.value)
                                            }
                                        />{" "}
                                        {opt.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                }

                // checkbox
                if (config.type === "checkbox") {
                    return (
                        <div
                            key={config.key}
                            style={{ display: "flex", gap: 16, alignItems: "center" }}
                        >
                            <div style={{ minWidth: 120, fontWeight: 500 }}>
                                {config.label}
                            </div>

                            <div style={{ display: "flex", gap: 24 }}>
                                {config.options?.map((opt) => {
                                    const checked = Array.isArray(value)
                                        ? value.includes(opt.value)
                                        : false;

                                    return (
                                        <label key={opt.value} style={{ cursor: "pointer" }}>
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={(e) => {
                                                    const current: string[] = Array.isArray(value)
                                                        ? value
                                                        : [];

                                                    const next = e.target.checked
                                                        ? [...current, opt.value]
                                                        : current.filter((v) => v !== opt.value);

                                                    onChange(config.key, next);
                                                }}
                                            />{" "}
                                            {opt.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }

                return null;
            })}

            {/* Apply Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    disabled={!hasAnyFilter}
                    onClick={onApply}
                    style={{
                        padding: "6px 16px",
                        borderRadius: 20,
                        border: "none",
                        background: hasAnyFilter ? "#6b46c1" : "#ccc",
                        color: "white",
                        cursor: hasAnyFilter ? "pointer" : "not-allowed",
                        fontSize: 13,
                    }}
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );
}