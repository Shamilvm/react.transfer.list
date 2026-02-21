import * as React from "react";
import { ActiveFilter, TransferItem, TransferListProps } from "../types";
import { FilterPanel } from "./FilterPanel";
import { ListPanel } from "./ListPanel";
import { useTransferData } from "../common";

function FilterIcon({ open }: { open: boolean }) {
    return open ? (
        <span style={{ fontSize: 12 }}>▲</span>
    ) : (
        <span style={{ fontSize: 12 }}>▼</span>
    );
}

export function TransferList({ label,
    remoteUrl,
    fetchFn,
    value,
    onChange,
    filters = [],
    autocompleteFetchFn,
    className,
    isFilter = true, }: TransferListProps) {
    const [search, setSearch] = React.useState("");
    const [showFilters, setShowFilters] = React.useState(false)
    const [filterValues, setFilterValues] = React.useState<Record<string, any>>(() => {
        // apply defaultValues from filter configs
        const defaults: Record<string, any> = {};
        filters.forEach((f) => {
            if (f.defaultValue !== undefined) defaults[f.key] = f.defaultValue;
        });
        return defaults;
    });

    const [appliedFilter, setAppliedFilter] = React.useState<ActiveFilter[]>([]);

    const [dataRight, setDataRight] = React.useState<TransferItem[]>(value ?? []);

    // sync value initially
    React.useEffect(() => {
        if (value) setDataRight(value);
    }, []);

    // fetch left data
    const { dataLeft, setDataLeft, loading } = useTransferData({
        remoteUrl,
        fetchFn,
        // search: debouncedSearch,
        search: search,
        filter: appliedFilter,
        dataRight,
    });

    // handlers 

    const handleToggle = (item: TransferItem) => {
        const isInRight = dataRight.some((r) => r.id === item.id);
        if (isInRight) {
            setDataRight((prev) => prev.filter((e) => e.id !== item.id));
            setDataLeft((prev) => [...prev, item]);
        } else {
            setDataRight((prev) => [...prev, item]);
            setDataLeft((prev) => prev.filter((e) => e.id !== item.id));
        }
    };

    const handleAllRight = () => {
        setDataRight((prev) => [...prev, ...dataLeft]);
        setDataLeft([]);
    };

    const handleAllLeft = () => {
        setDataLeft((prev) => [...prev, ...dataRight]);
        setDataRight([]);
    };
    const handleFilterChange = (key: string, val: any) => {
        setFilterValues((prev) => ({ ...prev, [key]: val }));
    };

    const handleApplyFilters = () => {
        // setAppliedFilter(buildFilterArray(filterValues));
        setShowFilters(false);
    };

    const handleDeleteFilterChip = (key: string) => {
        const next = { ...filterValues };
        delete next[key];
        setFilterValues(next);
        // setAppliedFilter(buildFilterArray(next));
    };

    const handleClearAll = () => {
        setFilterValues({});
        setAppliedFilter([]);
    };


    // chip labels
    const activeChips = appliedFilter.filter((f) => {
        const key = Object.keys(f)[0];
        return key !== "selectedIds";
    });

    const getChipLabel = (filterObj: ActiveFilter): string => {
        const key = Object.keys(filterObj)[0];
        const val = filterObj[key];
        const config = filters.find((f: any) => f.key === key);
        const displayKey = config?.label ?? key;
        const displayVal = Array.isArray(val) ? val.join(", ") : val;
        return `${displayKey}: ${displayVal}`;
    };

    return (
        <div className={className} style={{ width: "100%", padding: 20 }}>
            {/* Search + Filter Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        padding: "6px 10px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        width: 260,
                    }}
                />

                {isFilter && filters.length > 0 && (
                    <button
                        onClick={() => setShowFilters((v) => !v)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 4,
                            border: "1px solid #ccc",
                            background: "#f5f5f5",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        Filter <FilterIcon open={showFilters} />
                    </button>
                )}
            </div>

            {/* Filter Panel */}
            {isFilter && showFilters && (
                <FilterPanel
                    filters={filters}
                    filterValues={filterValues}
                    onChange={handleFilterChange}
                    onApply={handleApplyFilters}
                    autocompleteFetchFn={autocompleteFetchFn}
                />
            )}

            {/* Active Filter Chips */}
            {isFilter && activeChips.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0" }}>
                    {activeChips.map((f) => {
                        const key = Object.keys(f)[0];
                        return (
                            <div
                                key={key}
                                style={{
                                    padding: "4px 8px",
                                    background: "#eee",
                                    borderRadius: 16,
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                {getChipLabel(f)}
                                <span
                                    style={{ cursor: "pointer", fontWeight: "bold" }}
                                    onClick={() => handleDeleteFilterChip(key)}
                                >
                                    ×
                                </span>
                            </div>
                        );
                    })}

                    <button
                        onClick={handleClearAll}
                        style={{
                            border: "none",
                            background: "transparent",
                            color: "red",
                            cursor: "pointer",
                            fontSize: 12,
                        }}
                    >
                        Clear all
                    </button>
                </div>
            )}

            {/* Transfer Lists */}
            <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <ListPanel
                    items={dataLeft}
                    title={`${label} (available)`}
                    count={dataLeft.length}
                    isRight={false}
                    onToggleItem={handleToggle}
                    onMoveAll={handleAllRight}
                    loading={loading}
                />

                <ListPanel
                    items={dataRight}
                    title={`${label} (selected)`}
                    count={dataRight.length}
                    showCount
                    isRight
                    onToggleItem={handleToggle}
                    onMoveAll={handleAllLeft}
                />
            </div>
        </div>
    )
}