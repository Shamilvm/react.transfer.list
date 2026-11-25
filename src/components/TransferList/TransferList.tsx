import * as React from "react";
import { ActiveFilter, TransferItem, TransferListProps } from "../../types";
import { FilterPanel } from "../FilterPanel/FilterPanel";
import { DropPlacement, ListPanel } from "../ListPanel/ListPanel";
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

const EMPTY_FILTERS: NonNullable<TransferListProps["filters"]> = [];
const NO_ACTIVE_FILTERS: ActiveFilter[] = [];

export function TransferList({
  label,
  remoteUrl,
  fetchFn = defaultFetchFn,
  value,
  onChange,
  filters = EMPTY_FILTERS,
  autocompleteFetchFn = defaultAutocompleteFetchFn,
  className,
  isFilter = true,
  enableOrdering = false,
}: TransferListProps) {
  const defaultFilterValues = React.useMemo(
    () => getDefaultFilterValues(filters),
    [filters],
  );

  const [leftSearch, setLeftSearch] = React.useState("");
  const [rightSearch, setRightSearch] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [draftValues, setDraftValues] = React.useState<Record<string, unknown> | null>(
    null,
  );
  const [appliedValues, setAppliedValues] = React.useState<Record<
    string,
    unknown
  > | null>(null);
  const filterValues = draftValues ?? defaultFilterValues;
  const activeValues = appliedValues ?? defaultFilterValues;
  const appliedFilter = React.useMemo(() => {
    if (!isFilter) return NO_ACTIVE_FILTERS;
    const configured: Record<string, unknown> = Object.create(null);
    for (const { key } of filters) {
      if (Object.prototype.hasOwnProperty.call(activeValues, key)) {
        configured[key] = activeValues[key];
      }
    }
    return buildFilterArray(configured, filters);
  }, [isFilter, activeValues, filters]);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<TransferItem[]>([]);
  const dataRight = React.useMemo(
    () => (value === undefined ? uncontrolledValue : dedupeById(value)),
    [value, uncontrolledValue],
  );
  const [copyPasteMessage, setCopyPasteMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    injectStyles();
  }, []);

  const { dataLeft, loading, error } = useTransferData({
    remoteUrl,
    fetchFn,
    search: leftSearch,
    filter: appliedFilter,
    filterConfigs: filters,
    dataRight,
  });

  const filteredRight = React.useMemo(
    () => filterBySearch(dataRight, rightSearch),
    [dataRight, rightSearch],
  );

  const updateRight = (items: TransferItem[]) => {
    const next = dedupeById(items);
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  const handleToggle = (item: TransferItem) => {
    const isInRight = dataRight.some((selected) => selected.id === item.id);
    updateRight(
      isInRight
        ? dataRight.filter((selected) => selected.id !== item.id)
        : [...dataRight, item],
    );
  };

  const handleReorder = (
    item: TransferItem,
    target: TransferItem,
    placement: DropPlacement,
  ) => {
    if (item === target) return;
    const reordered = filteredRight.filter((visible) => visible !== item);
    const targetIndex = reordered.indexOf(target);
    if (targetIndex === -1 || reordered.length === filteredRight.length) return;
    reordered.splice(targetIndex + (placement === "after" ? 1 : 0), 0, item);

    const visibleIds = new Set(filteredRight.map(({ id }) => id));
    let visibleIndex = 0;
    updateRight(
      dataRight.map((selected) =>
        visibleIds.has(selected.id) ? reordered[visibleIndex++] : selected,
      ),
    );
  };

  const handleAllRight = () => updateRight([...dataRight, ...dataLeft]);
  const handleAllLeft = () => {
    const visibleIds = new Set(filteredRight.map(({ id }) => id));
    updateRight(dataRight.filter(({ id }) => !visibleIds.has(id)));
  };

  const handleFilterChange = (key: string, val: unknown) => {
    setDraftValues((prev) => ({ ...(prev ?? defaultFilterValues), [key]: val }));
  };

  const handleApplyFilters = () => {
    setAppliedValues(filterValues);
    setShowFilters(false);
  };

  const handleDeleteFilterChip = (key: string) => {
    setDraftValues((prev) => ({ ...(prev ?? defaultFilterValues), [key]: undefined }));
    setAppliedValues((prev) => ({ ...(prev ?? defaultFilterValues), [key]: undefined }));
  };

  const handleClearAll = () => {
    setDraftValues({});
    setAppliedValues({});
  };

  const handleResetFilters = () => setDraftValues(null);

  const messageTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(() => () => clearTimeout(messageTimer.current), []);

  const showCopyPasteMessage = (message: string) => {
    setCopyPasteMessage(message);
    clearTimeout(messageTimer.current);
    messageTimer.current = setTimeout(() => setCopyPasteMessage(null), 2500);
  };

  const applyPastedItems = (items: TransferItem[]) => {
    const selectedIds = new Set(dataRight.map(({ id }) => id));
    const additions = dedupeById(items).filter(({ id }) => !selectedIds.has(id));
    if (additions.length > 0) updateRight([...dataRight, ...additions]);
    showCopyPasteMessage(`Pasted ${additions.length} item(s)`);
  };

  const latestApplyPastedItems = React.useRef(applyPastedItems);
  React.useEffect(() => {
    latestApplyPastedItems.current = applyPastedItems;
  });

  const handleCopyRight = async () => {
    setTransferListClipboard(dataRight);
    try {
      await copyToClipboard(JSON.stringify(dataRight, null, 2));
      showCopyPasteMessage(`Copied ${dataRight.length} item(s)`);
    } catch {
      showCopyPasteMessage(`Copied ${dataRight.length} item(s) within this page`);
    }
  };

  const handlePasteRight = async () => {
    let text: string;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      const fromMemory = getTransferListClipboard();
      if (fromMemory?.length) latestApplyPastedItems.current(fromMemory);
      else showCopyPasteMessage("Failed to read the clipboard");
      return;
    }

    let parsed: TransferItem[];
    try {
      parsed = parseTransferItems(JSON.parse(text));
    } catch {
      parsed = [];
    }

    if (parsed.length === 0) {
      showCopyPasteMessage("No valid items in clipboard");
      return;
    }

    latestApplyPastedItems.current(parsed);
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
                {getChipLabel(f, filters, activeValues)}
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
          onReorder={enableOrdering ? handleReorder : undefined}
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
