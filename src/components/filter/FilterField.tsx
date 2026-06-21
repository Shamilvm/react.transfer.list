import * as React from "react";
import {
  AutocompleteFetchFn,
  FilterConfig,
  FilterOption,
} from "../../types";
import { RemoteAutocomplete } from "../RemoteAutoComplete";
import { RemoteSelect } from "../RemoteSelect";
import {
  defaultAutocompleteFetchFn,
  getListLimit,
  useRemoteListOptions,
} from "../../common";
import {
  inlineSearchStyle,
  MultiSelectBox,
  MultiSelectToolbar,
  SelectionChip,
  ToggleOptionPill,
} from "./MultiSelect";
import {
  blurInput,
  fieldWrapStyle,
  focusInput,
  inputStyle,
  labelStyle,
} from "./styles";

type FilterFieldProps = {
  config: FilterConfig;
  value: unknown;
  onChange: (value: unknown) => void;
  autocompleteFetchFn?: AutocompleteFetchFn;
};

function TagsInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  };

  return (
    <MultiSelectBox
      focused={focused}
      onClick={() => inputRef.current?.focus()}
      minHeight={44}
    >
      {value.map((tag) => (
        <SelectionChip
          key={tag}
          label={tag}
          onRemove={() => onChange(value.filter((t) => t !== tag))}
        />
      ))}
      <input
        ref={inputRef}
        type="text"
        value={draft}
        placeholder={value.length === 0 ? (placeholder ?? "Type and press Enter") : "Add more..."}
        style={inlineSearchStyle}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(draft);
          }
          if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={() => {
          addTag(draft);
          setFocused(false);
        }}
        onFocus={() => {
          setFocused(true);
        }}
      />
    </MultiSelectBox>
  );
}

function CheckboxGroup({
  options,
  value,
  onChange,
  loading = false,
}: {
  options: FilterOption[];
  value: string[];
  onChange: (v: string[]) => void;
  loading?: boolean;
}) {
  const toggle = (optValue: string) => {
    onChange(
      value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue],
    );
  };

  return (
    <div>
      {loading && options.length === 0 ? (
        <div style={{ fontSize: 13, color: "#6b7280", padding: "8px 0" }}>
          Loading options...
        </div>
      ) : (
        <>
          <MultiSelectToolbar
            selectedCount={value.length}
            totalCount={options.length}
            onSelectAll={() => onChange(options.map((o) => o.value))}
            onClear={() => onChange([])}
          />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {options.map((opt) => (
              <ToggleOptionPill
                key={opt.value}
                label={opt.label}
                selected={value.includes(opt.value)}
                onClick={() => toggle(opt.value)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
  multiple = false,
  loading = false,
}: {
  options: FilterOption[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multiple?: boolean;
  loading?: boolean;
}) {
  if (multiple) {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (optValue: string) => {
      onChange(
        selected.includes(optValue)
          ? selected.filter((v) => v !== optValue)
          : [...selected, optValue],
      );
    };

    return (
      <div>
        {loading && options.length === 0 ? (
          <div style={{ fontSize: 13, color: "#6b7280", padding: "8px 0" }}>
            Loading options...
          </div>
        ) : (
          <>
            <MultiSelectToolbar
              selectedCount={selected.length}
              totalCount={options.length}
              onSelectAll={() => onChange(options.map((o) => o.value))}
              onClear={() => onChange([])}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {options.map((opt) => (
                <ToggleOptionPill
                  key={opt.value}
                  label={opt.label}
                  selected={selected.includes(opt.value)}
                  onClick={() => toggle(opt.value)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  const single = typeof value === "string" ? value : "";
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const isSelected = single === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(isSelected ? "" : opt.value)}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: isSelected ? "1px solid #0baae9" : "1px solid #e5e7eb",
              background: isSelected ? "#e0f2fe" : "#fff",
              color: isSelected ? "#0369a1" : "#374151",
              fontSize: 13,
              fontWeight: isSelected ? 600 : 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function useFieldOptions(
  config: FilterConfig,
  autocompleteFetchFn?: AutocompleteFetchFn,
) {
  return useRemoteListOptions({
    remoteUrl: config.remoteUrl,
    staticOptions: config.options ?? [],
    fetchFn: autocompleteFetchFn ?? defaultAutocompleteFetchFn,
    limit: getListLimit(config),
    enabled: !!config.remoteUrl,
  });
}

export function FilterField({
  config,
  value,
  onChange,
  autocompleteFetchFn,
}: FilterFieldProps) {
  const remoteOptions = useFieldOptions(config, autocompleteFetchFn);
  const resolvedOptions = config.remoteUrl
    ? remoteOptions.options
    : config.options ?? [];

  const inputHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      focusInput(e.currentTarget),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      blurInput(e.currentTarget),
  };

  const renderControl = () => {
    switch (config.type) {
      case "text":
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            placeholder={config.placeholder ?? config.label}
            style={inputStyle}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value === "" || value == null ? "" : Number(value)}
            placeholder={config.placeholder}
            min={config.min}
            max={config.max}
            step={config.step}
            style={inputStyle}
            onChange={(e) =>
              onChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            {...inputHandlers}
          />
        );

      case "textarea":
        return (
          <textarea
            value={typeof value === "string" ? value : ""}
            placeholder={config.placeholder ?? config.label}
            rows={config.rows ?? 3}
            style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          />
        );

      case "select":
        if (config.remoteUrl) {
          return (
            <RemoteSelect
              config={config}
              value={typeof value === "string" ? value : ""}
              onChange={onChange}
              autocompleteFetchFn={autocompleteFetchFn}
            />
          );
        }
        return (
          <select
            value={typeof value === "string" ? value : ""}
            style={{ ...inputStyle, cursor: "pointer" }}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          >
            <option value="">— Select —</option>
            {resolvedOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "autocomplete":
        return (
          <RemoteAutocomplete
            config={config}
            value={Array.isArray(value) ? (value as FilterOption[]) : []}
            onChange={onChange}
            autocompleteFetchFn={autocompleteFetchFn}
          />
        );

      case "checkbox":
        return (
          <CheckboxGroup
            options={resolvedOptions}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
            loading={config.remoteUrl ? remoteOptions.loading : false}
          />
        );

      case "switch":
        return (
          <button
            type="button"
            role="switch"
            aria-checked={!!value}
            onClick={() => onChange(!value)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                position: "relative",
                width: 40,
                height: 22,
                borderRadius: 999,
                background: value ? "#0baae9" : "#d1d5db",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: value ? 20 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </span>
            <span style={{ fontSize: 13, color: "#374151" }}>
              {value ? "Yes" : "No"}
            </span>
          </button>
        );

      case "radio":
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px" }}>
            {config.options?.map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                <input
                  type="radio"
                  name={config.key}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(opt.value)}
                  style={{ accentColor: "#0baae9" }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );

      case "date":
        return (
          <input
            type="date"
            value={typeof value === "string" ? value : ""}
            style={inputStyle}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          />
        );

      case "time":
        return (
          <input
            type="time"
            value={typeof value === "string" ? value : ""}
            style={inputStyle}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          />
        );

      case "datetime":
        return (
          <input
            type="datetime-local"
            value={typeof value === "string" ? value : ""}
            style={inputStyle}
            onChange={(e) => onChange(e.target.value)}
            {...inputHandlers}
          />
        );

      case "slider": {
        const min = config.min ?? 0;
        const max = config.max ?? 100;
        const step = config.step ?? 1;
        const num = typeof value === "number" ? value : min;
        return (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#6b7280",
                marginBottom: 6,
              }}
            >
              <span>{min}</span>
              <span style={{ fontWeight: 600, color: "#0baae9" }}>{num}</span>
              <span>{max}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={num}
              onChange={(e) => onChange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#0baae9" }}
            />
          </div>
        );
      }

      case "tags":
        return (
          <TagsInput
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
            placeholder={config.placeholder}
          />
        );

      case "color":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="color"
              value={typeof value === "string" && value ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              style={{
                width: 40,
                height: 36,
                padding: 2,
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                cursor: "pointer",
                background: "#fff",
              }}
            />
            <input
              type="text"
              value={typeof value === "string" ? value : ""}
              placeholder="#000000"
              style={{ ...inputStyle, flex: 1 }}
              onChange={(e) => onChange(e.target.value)}
              {...inputHandlers}
            />
          </div>
        );

      case "chip":
        return (
          <ChipGroup
            options={resolvedOptions}
            value={
              config.multiple
                ? Array.isArray(value)
                  ? (value as string[])
                  : []
                : typeof value === "string"
                  ? value
                  : ""
            }
            onChange={onChange}
            multiple={config.multiple}
            loading={config.remoteUrl ? remoteOptions.loading : false}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={fieldWrapStyle}>
      <label style={labelStyle}>{config.label}</label>
      {renderControl()}
    </div>
  );
}
