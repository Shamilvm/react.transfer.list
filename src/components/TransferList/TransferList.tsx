import * as React from "react";
import { ActiveFilter, TransferItem, TransferListProps } from "../../types";
import { FilterPanel } from "../FilterPanel/FilterPanel";
import { ListPanel } from "../ListPanel/ListPanel";
import {
  buildFilterArray,
  dedupeById,
  defaultAutocompleteFetchFn,
  defaultFetchFn,
  copyToClipboard,
  getTransferListClipboard,
  setTransferListClipboard,
  filterBySearch,
  getChipLabel,
  getDefaultFilterValues,
  parseTransferItems,
} from "../../utils";
import { useTransferData } from "../../hooks";
import { injectStyles } from "../../styles/injectStyles";
import { FilterToggleIcon } from "../../icons";

export function TransferList({
  label,
  remoteUrl,
  fetchFn = defaultFetchFn,
  value,
  onChange,
  filters = [],
  autocompleteFetchFn = defaultAutocompleteFetchFn,
  className,
  isFilter = true,
}: TransferListProps) {
  const defaultFilterValues = React.useMemo(
    () => getDefaultFilterValues(filters),
    [filters],
  );

  const [leftSearch, setLeftSearch] = React.useState("");
  const [rightSearch, setRightSearch] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterValues, setFilterValues] =
    React.useState<Record<string, unknown>>(defaultFilterValues);
  const [appliedFilter, setAppliedFilter] = React.useState<ActiveFilter[]>(() =>
    isFilter ? buildFilterArray(defaultFilterValues, filters) : [],
  );
  const [dataRight, setDataRight] = React.useState<TransferItem[]>(() =>
    dedupeById(value ?? []),
  );
  const [copyPasteMessage, setCopyPasteMessage] = React.useState<string | null>(null);

  const initialized = React.useRef(false);
  const didMount = React.useRef(false);

  React.useEffect(() => {
    injectStyles();
  }, []);

  React.useEffect(() => {
    if (!initialized.current && Array.isArray(value) && value.length > 0) {
      initialized.current = true;
      setDataRight(dedupeById(value));
    }
  }, [value]);

  React.useEffect(() => {
    if (didMount.current) {
      onChange?.(dataRight);
    } else {
      didMount.current = true;
    }
  }, [dataRight, onChange]);

  const prevLeftSearch = React.useRef(leftSearch);
  React.useEffect(() => {
    if (!isFilter) return;
    if (prevLeftSearch.current && !leftSearch) {
      const defaults = getDefaultFilterValues(filters);
      setFilterValues(defaults);
      setAppliedFilter(buildFilterArray(defaults, filters));
    }
    prevLeftSearch.current = leftSearch;
  }, [leftSearch, isFilter, filters]);

  const { dataLeft, setDataLeft, loading, error } = useTransferData({
    remoteUrl,
    fetchFn,
    search: leftSearch,
    filter: appliedFilter,
    dataRight,
  });

  const filteredRight = React.useMemo(
    () => filterBySearch(dataRight, rightSearch),
    [dataRight, rightSearch],
  );

  const updateRight = React.useCallback(
    (updater: (prev: TransferItem[]) => TransferItem[]) => {
      setDataRight((prev) => dedupeById(updater(prev)));
    },
    [],
  );

  const handleToggle = (item: TransferItem) => {
    const isInRight = dataRight.some((r) => r.id === item.id);
    if (isInRight) {
      updateRight((prev) => prev.filter((e) => e.id !== item.id));
      setDataLeft((prev) => dedupeById([...prev, item]));
    } else {
      updateRight((prev) => [...prev, item]);
      setDataLeft((prev) => prev.filter((e) => e.id !== item.id));
    }
  };

  const handleAllRight = () => {
    updateRight((prev) => [...prev, ...dataLeft]);
    setDataLeft([]);
  };

  const handleAllLeft = () => {
    setDataLeft((prev) => dedupeById([...prev, ...dataRight]));
    updateRight(() => []);
  };

  const handleFilterChange = (key: string, val: unknown) => {
    setFilterValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleApplyFilters = () => {
    setAppliedFilter(buildFilterArray(filterValues, filters));
    setShowFilters(false);
  };

  const handleDeleteFilterChip = (key: string) => {
    const next = { ...filterValues };
    delete next[key];
    setFilterValues(next);
    setAppliedFilter(buildFilterArray(next, filters));
  };

  const handleClearAll = () => {
    setFilterValues({});
    setAppliedFilter([]);
  };

  const handleResetFilters = () => {
    const defaults = getDefaultFilterValues(filters);
    setFilterValues(defaults);
  };

  const showCopyPasteMessage = (message: string) => {
    setCopyPasteMessage(message);
    setTimeout(() => setCopyPasteMessage(null), 2500);
  };

  const applyPastedItems = (items: TransferItem[]) => {
    const parsed = dedupeById(items);
    if (parsed.length === 0) return null;

    const pastedIds = new Set(parsed.map((item) => item.id));
    updateRight((prev) => [...prev, ...parsed]);
    setDataLeft((prev) => prev.filter((item) => !pastedIds.has(item.id)));
    return parsed.length;
  };

  const handleCopyRight = async () => {
    const text = JSON.stringify(dataRight, null, 2);
    setTransferListClipboard(dataRight);

    try {
      await copyToClipboard(text);
      showCopyPasteMessage(`Copied ${dataRight.length} item(s)`);
    } catch {
      showCopyPasteMessage(`Copied ${dataRight.length} item(s)`);
    }
  };

  const handlePasteRight = async () => {
    const fromMemory = getTransferListClipboard();
    if (fromMemory?.length) {
      const count = applyPastedItems(fromMemory);
      if (count != null) {
        showCopyPasteMessage(`Pasted ${count} item(s)`);
        return;
      }
    }

    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseTransferItems(JSON.parse(text));
      if (parsed.length === 0) {
        showCopyPasteMessage("No valid items in clipboard");
        return;
      }

      const count = applyPastedItems(parsed);
      if (count != null) {
        showCopyPasteMessage(`Pasted ${count} item(s)`);
      }
    } catch {
      showCopyPasteMessage(
        "Failed to paste — copy from another list first, or ensure clipboard has valid JSON",
      );
    }
  };

  const activeChips = appliedFilter.filter((f) => {
    const key = Object.keys(f)[0];
    const val = f[key];
    if (key === "selectedIds") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return val != null && val !== "";
  });

  return (
    <div className={className ? `${className} stl-root` : "stl-root"}>
      {isFilter && filters.length > 0 && (
        <div className="stl-filter-toggle-wrap">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`stl-filter-toggle${showFilters ? " stl-filter-toggle--open" : ""}`}
          >
            <FilterToggleIcon open={showFilters} />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {activeChips.length > 0 && (
              <span className="stl-filter-toggle-badge">{activeChips.length}</span>
            )}
          </button>
        </div>
      )}

      {isFilter && showFilters && (
        <FilterPanel
          filters={filters}
          filterValues={filterValues}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          autocompleteFetchFn={autocompleteFetchFn}
        />
      )}

      {isFilter && activeChips.length > 0 && (
        <div className="stl-chips">
          {activeChips.map((f) => {
            const key = Object.keys(f)[0];
            return (
              <div key={key} className="stl-chip">
                {getChipLabel(f, filters, filterValues)}
                <button
                  type="button"
                  onClick={() => handleDeleteFilterChip(key)}
                  className="stl-chip-remove"
                >
                  ×
                </button>
              </div>
            );
          })}

          <button type="button" onClick={handleClearAll} className="stl-clear-all">
            Clear all
          </button>
        </div>
      )}

      <div className="stl-panels">
        <ListPanel
          items={dataLeft}
          title={`${label} excluded`}
          count={dataLeft.length}
          isRight={false}
          onToggleItem={handleToggle}
          onMoveAll={handleAllRight}
          loading={loading}
          error={error}
          search={leftSearch}
          onSearchChange={setLeftSearch}
          searchPlaceholder="Search available..."
        />

        <ListPanel
          items={filteredRight}
          title={`${label} included`}
          count={filteredRight.length}
          totalCount={dataRight.length}
          showCount
          isRight
          onToggleItem={handleToggle}
          onMoveAll={handleAllLeft}
          search={rightSearch}
          onSearchChange={setRightSearch}
          searchPlaceholder="Search selected..."
          onCopy={handleCopyRight}
          onPaste={handlePasteRight}
          copyPasteMessage={copyPasteMessage}
        />
      </div>
    </div>
  );
}

export default TransferList;
