import * as React from "react";
import {
  AutocompleteFetchFn,
  FilterConfig,
  FilterOption,
} from "../types";
import {
  defaultAutocompleteFetchFn,
  getListLimit,
  useRemoteListOptions,
} from "../common";
import {
  ChevronDownIcon,
  DropdownOptionRow,
  inlineSearchStyle,
  MultiSelectBox,
  MultiSelectToolbar,
  SelectionChip,
} from "./filter/MultiSelect";

export function RemoteAutocomplete({
  config,
  value,
  onChange,
  autocompleteFetchFn = defaultAutocompleteFetchFn,
}: {
  config: FilterConfig;
  value: FilterOption[];
  onChange: (val: FilterOption[]) => void;
  autocompleteFetchFn?: AutocompleteFetchFn;
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const limit = getListLimit(config);

  const {
    options,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
  } = useRemoteListOptions({
    remoteUrl: config.remoteUrl,
    staticOptions: config.options ?? [],
    fetchFn: autocompleteFetchFn,
    search: config.remoteUrl ? inputValue : "",
    limit,
    enabled: open,
    selected: value,
  });

  const filteredOptions = config.remoteUrl
    ? options
    : options.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()),
      );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: FilterOption) => {
    const exists = value.some((v) => v.value === option.value);
    onChange(
      exists
        ? value.filter((v) => v.value !== option.value)
        : [...value, option],
    );
  };

  const selectAll = () => onChange([...filteredOptions]);
  const clearAll = () => onChange([]);

  const handleListScroll = () => {
    const el = listRef.current;
    if (!el || !hasMore || loadingMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      loadMore();
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <MultiSelectBox
        focused={focused || open}
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        {value.map((v) => (
          <SelectionChip
            key={v.value}
            label={v.label}
            onRemove={() =>
              onChange(value.filter((item) => item.value !== v.value))
            }
          />
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={
            value.length === 0
              ? (config.placeholder ?? `Search ${config.label.toLowerCase()}...`)
              : ""
          }
          style={inlineSearchStyle}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
        />
        <button
          type="button"
          aria-label="Toggle options"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
            inputRef.current?.focus();
          }}
          style={{
            border: "none",
            background: "transparent",
            color: "#9ca3af",
            cursor: "pointer",
            display: "flex",
            padding: 2,
            marginLeft: "auto",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <ChevronDownIcon />
        </button>
      </MultiSelectBox>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          {filteredOptions.length > 0 && (
            <div
              style={{
                padding: "8px 10px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <MultiSelectToolbar
                selectedCount={value.length}
                totalCount={filteredOptions.length}
                onSelectAll={selectAll}
                onClear={clearAll}
              />
            </div>
          )}

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
            style={{
              maxHeight: 220,
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
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
            ) : filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  textAlign: "center",
                  fontSize: 13,
                  color: "#9ca3af",
                }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <DropdownOptionRow
                  key={opt.value}
                  label={opt.label}
                  selected={value.some((v) => v.value === opt.value)}
                  onClick={() => toggleOption(opt)}
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
      )}
    </div>
  );
}
