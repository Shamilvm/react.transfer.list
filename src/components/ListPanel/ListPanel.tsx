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

export type DropPlacement = "before" | "after";

type ListPanelProps = {
  items: TransferItem[];
  title: string;
  count: number;
  totalCount?: number;
  showCount?: boolean;
  isRight?: boolean;
  onToggleItem: (item: TransferItem) => void;
  onMoveAll: () => void;
  onReorder?: (
    item: TransferItem,
    target: TransferItem,
    placement: DropPlacement,
  ) => void;
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
  onReorder,
  loading = false,
  error = null,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onCopy,
  onPaste,
  copyPasteMessage,
}: ListPanelProps) {
  const [dragged, setDragged] = React.useState<TransferItem | null>(null);
  const [drop, setDrop] = React.useState<{
    target: TransferItem;
    placement: DropPlacement;
  } | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const pendingFocusId = React.useRef<TransferItem["id"] | null>(null);
  const rowRefs = React.useRef(new Map<TransferItem["id"], HTMLButtonElement>());
  const draggedIndex = dragged ? items.indexOf(dragged) : -1;

  const endDrag = () => {
    setDragged(null);
    setDrop(null);
  };

  React.useLayoutEffect(() => {
    const id = pendingFocusId.current;
    if (id == null) return;
    pendingFocusId.current = null;
    rowRefs.current.get(id)?.focus();
  }, [items]);

  // A drop that would leave the item where it already is shows no indicator.
  const isNoopDrop = (index: number, placement: DropPlacement) =>
    draggedIndex === -1 ||
    index === draggedIndex ||
    (placement === "after" && index === draggedIndex - 1) ||
    (placement === "before" && index === draggedIndex + 1);

  const moveBy = (item: TransferItem, index: number, delta: -1 | 1) => {
    const target = items[index + delta];
    if (!onReorder || !target) return;
    pendingFocusId.current = item.id;
    onReorder(item, target, delta < 0 ? "before" : "after");
    setAnnouncement(
      `${item.text} moved to position ${index + delta + 1} of ${items.length}`,
    );
  };

  const moveAllDisabled = loading || count === 0;
  const displayCount =
    showCount && totalCount != null && totalCount !== count
      ? `${count} / ${totalCount}`
      : showCount
        ? String(count)
        : null;
  const hasToolbar = Boolean(onSearchChange || onCopy || onPaste);
  const copyPasteFailed = !!copyPasteMessage?.match(/^(Failed|No valid)/);

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
            {isRight ? (search?.trim() ? "Remove matches" : "Remove all") : "Move all"}
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
                  aria-label={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="stl-list-panel__search"
                />
                {search && (
                  <button
                    type="button"
                    aria-label={`Clear ${isRight ? "selected" : "available"} search`}
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
          <ol className="stl-list-panel__items">
            {items.map((item, index) => {
              const dropPlacement =
                drop?.target === item && !isNoopDrop(index, drop.placement)
                  ? drop.placement
                  : undefined;

              return (
                <li
                  key={item.id}
                  className={onReorder ? "stl-list-panel__ordered-row" : undefined}
                  data-dragging={dragged === item || undefined}
                  data-drop={dropPlacement}
                  onDragOver={(event) => {
                    if (!onReorder || draggedIndex === -1) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    const rect = event.currentTarget.getBoundingClientRect();
                    const placement: DropPlacement =
                      event.clientY < rect.top + rect.height / 2 ? "before" : "after";
                    if (drop?.target !== item || drop.placement !== placement) {
                      setDrop({ target: item, placement });
                    }
                  }}
                  onDrop={(event) => {
                    if (!onReorder || !dragged) return;
                    event.preventDefault();
                    if (dropPlacement) onReorder(dragged, item, dropPlacement);
                    endDrag();
                  }}
                >
                  {onReorder && (
                    <span
                      className="stl-list-panel__drag-handle"
                      aria-hidden="true"
                      title="Drag to reorder"
                      draggable={items.length > 1}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", "");
                        const row = event.currentTarget.parentElement;
                        if (row) event.dataTransfer.setDragImage?.(row, 24, 20);
                        setDragged(item);
                      }}
                      onDragEnd={endDrag}
                    >
                      <span className="stl-list-panel__drag-grip" />
                    </span>
                  )}
                  <button
                    type="button"
                    ref={(node) => {
                      if (node) rowRefs.current.set(item.id, node);
                      else rowRefs.current.delete(item.id);
                    }}
                    aria-label={isRight ? `Remove ${item.text}` : `Move ${item.text}`}
                    aria-keyshortcuts={
                      onReorder ? "Alt+ArrowUp Alt+ArrowDown" : undefined
                    }
                    className={`stl-list-panel__row${isRight ? " stl-list-panel__row--right" : ""}`}
                    onClick={() => onToggleItem(item)}
                    onKeyDown={(event) => {
                      if (!onReorder || !event.altKey) return;
                      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                        event.preventDefault();
                        moveBy(item, index, event.key === "ArrowUp" ? -1 : 1);
                      }
                    }}
                  >
                    {onReorder && (
                      <span className="stl-list-panel__position" aria-hidden="true">
                        {index + 1}
                      </span>
                    )}
                    {item.media ? (
                      <img src={item.media} alt="" className="stl-list-panel__avatar" />
                    ) : (
                      <span
                        className={`stl-list-panel__avatar-fallback${isRight ? " stl-list-panel__avatar-fallback--right" : ""}`}
                      >
                        {item.text?.charAt(0).toUpperCase()}
                      </span>
                    )}

                    <span className="stl-list-panel__item-text">{item.text}</span>

                    {!onReorder && (
                      <span
                        aria-hidden="true"
                        className={`stl-list-panel__row-action${isRight ? " stl-list-panel__row-action--remove" : ""}`}
                      >
                        {isRight ? <XMarkIcon /> : <ChevronDoubleRightIcon />}
                      </span>
                    )}
                  </button>
                  {onReorder && (
                    <>
                      <div className="stl-list-panel__order-controls">
                        <button
                          type="button"
                          aria-label={`Move ${item.text} up`}
                          title="Move up (Alt+↑)"
                          disabled={index === 0}
                          onClick={() => moveBy(item, index, -1)}
                        >
                          <span
                            className="stl-list-panel__order-chevron"
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${item.text} down`}
                          title="Move down (Alt+↓)"
                          disabled={index === items.length - 1}
                          onClick={() => moveBy(item, index, 1)}
                        >
                          <span
                            className="stl-list-panel__order-chevron"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      <span
                        aria-hidden="true"
                        className="stl-list-panel__row-action stl-list-panel__row-action--remove stl-list-panel__row-action--ordered"
                        onClick={() => onToggleItem(item)}
                      >
                        <XMarkIcon />
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {onReorder && (
        <div className="stl-visually-hidden" aria-live="polite">
          {announcement}
        </div>
      )}
    </div>
  );
}
