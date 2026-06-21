import * as React from "react";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  background: "#fff",
  fontSize: 13,
  color: "#111827",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
  display: "block",
};

export const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export function focusInput(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  el.style.borderColor = "#93c5fd";
  el.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
}

export function blurInput(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  el.style.borderColor = "#e5e7eb";
  el.style.boxShadow = "none";
}
