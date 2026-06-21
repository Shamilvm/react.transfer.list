import * as React from "react";
import { AutocompleteFetchFn, FilterConfig } from "../../types";
import { defaultAutocompleteFetchFn } from "../../utils";
import { getListLimit, useRemoteListOptions } from "../../hooks";
import { ChevronDownIcon } from "../../icons";
import { DropdownOptionRow } from "../filter/MultiSelect";
import { FloatingDropdown } from "../filter/FloatingDropdown";
import { inputStyle } from "../filter/fieldStyles";

export function RemoteSelect({
  config,
  value,
  onChange,
  autocompleteFetchFn = defaultAutocompleteFetchFn,
}: {
  config: FilterConfig;
  value: string;
  onChange: (val: string) => void;
  autocompleteFetchFn?: AutocompleteFetchFn;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = React.useMemo(() => {
    if (!value) return null;
    return (
      (config.options ?? []).find((o) => o.value === value) ?? {
        value,
        label: value,
      }
    );
  }, [value, config.options]);

  const selectedForMerge = selectedOption ? [selectedOption] : [];

  const { options, loading, loadingMore, hasMore, error, loadMore } =
    useRemoteListOptions({
      remoteUrl: config.remoteUrl,
      staticOptions: config.options ?? [],
      fetchFn: autocompleteFetchFn,
      search: config.remoteUrl ? inputValue : "",
      limit: getListLimit(config),
      enabled: open,
      selected: selectedForMerge,
    });

  const displayLabel =
    options.find((o) => o.value === value)?.label ?? selectedOption?.label ?? "";

  const filteredOptions = config.remoteUrl
    ? options
    : options.filter((opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase()));

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setFocused(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleListScroll = () => {
    const el = listRef.current;
    if (!el || !hasMore || loadingMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setFocused(true);
        }}
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          textAlign: "left",
          borderColor: focused || open ? "#60a5fa" : "#cbd5e1",
          boxShadow: focused || open ? "0 0 0 3px rgba(59,130,246,0.14)" : "none",
          color: value ? "#111827" : "#9ca3af",
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value ? displayLabel : (config.placeholder ?? `Select ${config.label}`)}
        </span>
        <span
          style={{
            color: "#9ca3af",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            display: "flex",
          }}
        >
          <ChevronDownIcon />
        </span>
      </button>

      <FloatingDropdown anchorRef={containerRef} dropdownRef={dropdownRef} open={open}>
        <div
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: 10,
            background: "#fff",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: 8 }}>
            <input
              type="text"
              value={inputValue}
              placeholder="Search..."
              style={{ ...inputStyle, width: "100%" }}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                fontSize: 12,
                color: "#dc2626",
                background: "#fef2f2",
              }}
            >
              {error}
            </div>
          )}

          <div
            ref={listRef}
            onScroll={handleListScroll}
            style={{ maxHeight: 220, overflowY: "auto" }}
          >
            <DropdownOptionRow
              label="— None —"
              selected={!value}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            />

            {loading && filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                Loading...
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <DropdownOptionRow
                  key={opt.value}
                  label={opt.label}
                  selected={value === opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                />
              ))
            )}

            {loadingMore && (
              <div
                style={{
                  padding: 10,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                Loading more...
              </div>
            )}

            {hasMore && !loadingMore && filteredOptions.length > 0 && (
              <button
                type="button"
                onClick={loadMore}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "none",
                  borderTop: "1px solid #f3f4f6",
                  background: "#fafafa",
                  color: "#0baae9",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Load more
              </button>
            )}
          </div>
        </div>
      </FloatingDropdown>
    </div>
  );
}
