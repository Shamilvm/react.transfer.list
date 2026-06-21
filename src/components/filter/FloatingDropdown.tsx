import * as React from "react";
import { createPortal } from "react-dom";

type FloatingDropdownProps = {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  children: React.ReactNode;
  estimatedHeight?: number;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
};

export function FloatingDropdown({
  anchorRef,
  open,
  children,
  estimatedHeight = 280,
  dropdownRef,
}: FloatingDropdownProps) {
  const [coords, setCoords] = React.useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
  } | null>(null);

  const updatePosition = React.useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight && rect.top > spaceBelow;

    setCoords({
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom + 4,
      bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
    });
  }, [anchorRef, estimatedHeight]);

  React.useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  if (!open || !coords) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        left: coords.left,
        width: coords.width,
        top: coords.top,
        bottom: coords.bottom,
        zIndex: 10000,
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
