import * as React from "react";
import { AutocompleteFetchFn, FilterConfig, FilterOption } from "../types";

function RemoteAutocomplete({
  config,
  value,
  onChange,
  autocompleteFetchFn,
}: {
  config: FilterConfig;
  value: FilterOption[];
  onChange: (val: FilterOption[]) => void;
  autocompleteFetchFn?: AutocompleteFetchFn;
}) {
  const [options, setOptions] = React.useState<FilterOption[]>(
    config.options ?? []
  );
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);

  React.useEffect(() => {
    if (!config.remoteUrl || !autocompleteFetchFn) return;

    setLoading(true);
    autocompleteFetchFn(config.remoteUrl, inputValue)
      .then(setOptions)
      .finally(() => setLoading(false));
  }, [inputValue, config.remoteUrl]);

  const toggleOption = (option: FilterOption) => {
    const exists = value?.some((v) => v.value === option.value);

    if (exists) {
      onChange(value.filter((v) => v.value !== option.value));
    } else {
      onChange([...(value ?? []), option]);
    }
  };

  return (
    <div style={{ position: "relative", minWidth: 220 }}>
      <input
        type="text"
        placeholder={config.label}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        style={{
          width: "100%",
          padding: "6px 8px",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      {loading && (
        <div style={{ fontSize: 12, marginTop: 4 }}>Loading...</div>
      )}

      {showDropdown && options.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ddd",
            background: "#fff",
            maxHeight: 160,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {options.map((opt) => {
            const checked = value?.some((v) => v.value === opt.value);

            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt)}
                style={{
                  padding: "6px 8px",
                  cursor: "pointer",
                  background: checked ? "#f0f0f0" : "white",
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected tags */}
      {value?.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {value.map((v) => (
            <div
              key={v.value}
              style={{
                padding: "3px 8px",
                background: "#eee",
                borderRadius: 12,
                fontSize: 12,
              }}
            >
              {v.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}