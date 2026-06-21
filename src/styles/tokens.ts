import * as React from "react";

export const colors = {
  primary: "#0baae9",
  primaryDark: "#0284c7",
  primaryLight: "#e0f2fe",
  primaryBorder: "#bae6fd",
  primaryText: "#0369a1",
  success: "#10b981",
  successDark: "#059669",
  successLight: "#ecfdf5",
  successBorder: "#bbf7d0",
  danger: "#dc2626",
  dangerLight: "#fef2f2",
  slate900: "#0f172a",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate300: "#cbd5e1",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  white: "#ffffff",
} as const;

export const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${colors.slate300}`,
  background: colors.white,
  fontSize: 13,
  color: colors.slate900,
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

export const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 650,
  color: colors.slate700,
  marginBottom: 8,
  display: "block",
  letterSpacing: "0.01em",
};

export const fieldWrapStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  width: "100%",
};

export const inlineSearchStyle: React.CSSProperties = {
  flex: "1 1 80px",
  minWidth: 60,
  border: "none",
  outline: "none",
  background: "transparent",
  fontSize: 13,
  color: "#111827",
  padding: "2px 4px",
};

export const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "4px 8px",
  borderRadius: 6,
  background: colors.primaryLight,
  border: `1px solid ${colors.primaryBorder}`,
  color: colors.primaryText,
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.2,
  maxWidth: "100%",
};

export function focusInput(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  el.style.borderColor = "#93c5fd";
  el.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
}

export function blurInput(
  el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
) {
  el.style.borderColor = colors.slate300;
  el.style.boxShadow = "none";
}
