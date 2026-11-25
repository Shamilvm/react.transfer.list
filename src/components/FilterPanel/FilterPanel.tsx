import * as React from "react";
import { FilterPanelProps } from "../../types";
import { ApplyIcon, FilterPanelIcon, ResetIcon } from "../../icons";
import { FilterField } from "../filter/FilterField";

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
  const activeCount = filters.filter((f) => hasFilterValue(filterValues[f.key])).length;

  return (
    <div className="stl-filter-panel">
      <div className="stl-filter-panel__header">
        <div className="stl-filter-panel__title">
          <span className="stl-filter-panel__icon">
            <FilterPanelIcon />
          </span>
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="stl-filter-panel__active-badge">{activeCount} active</span>
          )}
        </div>
        <span className="stl-filter-panel__meta">
          {filters.length} field{filters.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="stl-filter-scroll">
        <div className="stl-filter-grid">
          {filters.map((config) => {
            const isActive = hasFilterValue(filterValues[config.key]);
            return (
              <div
                key={config.key}
                className={`stl-filter-field${config.colSpan === 2 ? " stl-filter-field--wide" : ""}${isActive ? " stl-filter-field--active" : ""}`}
              >
                <FilterField
                  config={config}
                  value={filterValues[config.key]}
                  onChange={(val) => onChange(config.key, val)}
                  autocompleteFetchFn={autocompleteFetchFn}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="stl-filter-panel__footer">
        <p className="stl-filter-panel__footer-hint">
          {activeCount > 0
            ? `${activeCount} filter${activeCount !== 1 ? "s" : ""} ready to apply`
            : "Set filter values, then apply to update results"}
        </p>
        <div className="stl-filter-panel__footer-actions">
          <button
            type="button"
            className="stl-filter-btn stl-filter-btn--reset"
            onClick={onReset}
          >
            <ResetIcon />
            Reset all
          </button>
          <button
            type="button"
            className="stl-filter-btn stl-filter-btn--apply"
            onClick={onApply}
          >
            <ApplyIcon />
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
