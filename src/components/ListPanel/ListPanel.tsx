import * as React from "react";
import { TransferItem } from "../../types";
import {
  ChevronDoubleRightIcon,
  CopyIcon,
  ExcludedPanelIcon,
  IncludedPanelIcon,
  PasteIcon,
  SearchIcon,
  XMarkIcon,
} from "../../icons";

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
  const hasToolbar = Boolean(onSearchChange || onCopy || onPaste);
  const copyPasteFailed = copyPasteMessage?.toLowerCase().includes("fail") ?? false;

  return (
    <div
      className={`stl-list-panel${isRight ? " stl-list-panel--right" : " stl-list-panel--left"}`}
    >
      <div className="stl-list-panel__header">
        <div
          className={`stl-list-panel__header-row${hasToolbar ? " stl-list-panel__header-row--with-toolbar" : ""}`}
        >
          <div className="stl-list-panel__title">
            <span
              className={`stl-list-panel__badge${isRight ? " stl-list-panel__badge--right" : ""}`}
            >
              {isRight ? <IncludedPanelIcon /> : <ExcludedPanelIcon />}
            </span>
            <span>
              {title}
              {displayCount != null && (
                <span className="stl-list-panel__count">({displayCount})</span>
              )}
            </span>
          </div>

          <button
            type="button"
            className={`stl-list-panel__move-all${isRight ? " stl-list-panel__move-all--remove" : ""}`}
            onClick={onMoveAll}
            disabled={moveAllDisabled}
          >
            {isRight ? "Remove all" : "Move all"}
            {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
          </button>
        </div>

        {hasToolbar && (
          <div className="stl-list-panel__toolbar-row">
            {onSearchChange && (
              <div className="stl-list-panel__search-wrap">
                <span className="stl-list-panel__search-icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="stl-list-panel__search"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onSearchChange("")}
                    className="stl-list-panel__search-clear"
                  >
                    ×
                  </button>
                )}
              </div>
            )}

            {(onCopy || onPaste) && (
              <div className="stl-list-panel__toolbar">
                {onCopy && (
                  <button
                    type="button"
                    onClick={onCopy}
                    title="Copy selected items as JSON"
                    className="stl-toolbar-btn"
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
                    className="stl-toolbar-btn stl-toolbar-btn--paste"
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
            className={`stl-copy-paste-message${copyPasteFailed ? " stl-copy-paste-message--error" : " stl-copy-paste-message--success"}`}
          >
            {copyPasteMessage}
          </div>
        )}
      </div>

      {error && <div className="stl-list-panel__error">{error}</div>}

      <div className="stl-list-scroll stl-list-panel__body">
        {loading ? (
          <div className="stl-list-panel__empty">Loading...</div>
        ) : items.length === 0 ? (
          <div className="stl-list-panel__empty stl-list-panel__empty--muted">
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
                className={`stl-list-panel__row${isRight ? " stl-list-panel__row--right" : ""}`}
                onClick={() => onToggleItem(item)}
              >
                {item.media ? (
                  <img
                    src={item.media}
                    alt={item.text}
                    className="stl-list-panel__avatar"
                  />
                ) : (
                  <div
                    className={`stl-list-panel__avatar-fallback${isRight ? " stl-list-panel__avatar-fallback--right" : ""}`}
                  >
                    {item.text?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="stl-list-panel__item-text">{item.text}</div>

                <div
                  className={`stl-list-panel__row-action${isRight ? " stl-list-panel__row-action--remove" : ""}`}
                >
                  {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
