export const componentStyles = `
.stl-root {
  width: 100%;
  padding: 20px;
}

.stl-filter-toggle-wrap {
  margin-bottom: 12px;
}

.stl-filter-toggle {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
  box-shadow: none;
}

.stl-filter-toggle--open {
  border-color: #0baae9;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%);
  color: #0369a1;
  box-shadow: 0 2px 8px rgba(11, 170, 233, 0.15);
}

.stl-filter-toggle-badge {
  background: #0baae9;
  color: #fff;
  border-radius: 999px;
  padding: 1px 7px;
  font-size: 11px;
  font-weight: 600;
}

.stl-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 12px;
  align-items: center;
}

.stl-chip {
  padding: 5px 10px;
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stl-chip-remove {
  border: none;
  background: #bae6fd;
  color: #0369a1;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stl-clear-all {
  border: none;
  background: transparent;
  color: #dc2626;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
}

.stl-panels {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  align-items: stretch;
  min-height: 320px;
}

.stl-filter-panel {
  margin-top: 12px;
  margin-bottom: 12px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 24px rgba(11, 170, 233, 0.08);
}

.stl-filter-panel__header {
  padding: 14px 18px;
  border-bottom: 1px solid #e0f2fe;
  background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 12px 12px 0 0;
}

.stl-filter-panel__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 650;
  font-size: 14px;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.stl-filter-panel__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0baae9 0%, #0284c7 100%);
  color: #fff;
  box-shadow: 0 2px 6px rgba(11, 170, 233, 0.35);
}

.stl-filter-panel__active-badge {
  font-size: 11px;
  font-weight: 600;
  color: #0369a1;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 999px;
  padding: 2px 8px;
}

.stl-filter-panel__meta {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.stl-filter-scroll {
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px;
  scrollbar-width: thin;
  scrollbar-color: #93c5fd transparent;
}

.stl-filter-scroll::-webkit-scrollbar { width: 6px; }
.stl-filter-scroll::-webkit-scrollbar-track { background: transparent; }
.stl-filter-scroll::-webkit-scrollbar-thumb {
  background: #93c5fd;
  border-radius: 999px;
}

.stl-filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.stl-filter-field {
  min-width: 0;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.stl-filter-field:hover {
  border-color: #bae6fd;
  box-shadow: 0 2px 8px rgba(11, 170, 233, 0.06);
}

.stl-filter-field--active {
  border-color: #7dd3fc;
  background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%);
  box-shadow: inset 0 0 0 1px rgba(11, 170, 233, 0.08);
}

.stl-filter-field--wide {
  grid-column: 1 / -1;
}

.stl-filter-panel__footer {
  padding: 14px 18px;
  border-top: 1px solid #e0f2fe;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border-radius: 0 0 12px 12px;
}

.stl-filter-panel__footer-hint {
  margin: 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.stl-filter-panel__footer-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.stl-filter-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 9px 16px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.1s, color 0.15s;
}

.stl-filter-btn:active:not(:disabled) {
  transform: translateY(1px);
}

.stl-filter-btn--reset {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #64748b;
}

.stl-filter-btn--reset:hover {
  border-color: #94a3b8;
  color: #475569;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.stl-filter-btn--apply {
  border: none;
  background: linear-gradient(135deg, #0baae9 0%, #0284c7 100%);
  color: #fff;
  min-width: 132px;
  box-shadow:
    0 1px 2px rgba(2, 132, 199, 0.2),
    0 4px 14px rgba(11, 170, 233, 0.35);
}

.stl-filter-btn--apply:hover:not(:disabled) {
  background: linear-gradient(135deg, #22bff5 0%, #0baae9 100%);
  box-shadow:
    0 2px 4px rgba(2, 132, 199, 0.25),
    0 6px 18px rgba(11, 170, 233, 0.4);
}

.stl-filter-btn--apply:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  box-shadow: none;
  cursor: not-allowed;
}

.stl-list-panel {
  width: 100%;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

.stl-list-panel--left {
  border: 1px solid #dbeafe;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 6px 20px rgba(11, 170, 233, 0.07);
}

.stl-list-panel--right {
  border: 1px solid #bbf7d0;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 6px 20px rgba(16, 185, 129, 0.08);
}

.stl-list-panel__header {
  flex-shrink: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e0f2fe;
}

.stl-list-panel--left .stl-list-panel__header {
  background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
}

.stl-list-panel--right .stl-list-panel__header {
  border-bottom-color: #d1fae5;
  background: linear-gradient(90deg, #ecfdf5 0%, #ffffff 100%);
}

.stl-list-panel__header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.stl-list-panel__header-row--with-toolbar {
  margin-bottom: 10px;
}

.stl-list-panel__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 650;
  font-size: 14px;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.stl-list-panel__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: linear-gradient(135deg, #0baae9 0%, #0284c7 100%);
  color: #fff;
  box-shadow: 0 2px 5px rgba(11, 170, 233, 0.3);
  flex-shrink: 0;
}

.stl-list-panel__badge--right {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 5px rgba(16, 185, 129, 0.3);
}

.stl-list-panel__count {
  font-weight: 500;
  color: #64748b;
  margin-left: 4px;
}

.stl-list-panel__move-all {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #0284c7;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}

.stl-list-panel__move-all:hover:not(:disabled) {
  background: #e0f2fe;
}

.stl-list-panel__move-all--remove {
  color: #dc2626;
}

.stl-list-panel__move-all--remove:hover:not(:disabled) {
  background: #fef2f2;
}

.stl-list-panel__move-all:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.stl-list-panel__toolbar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.stl-list-panel__search-wrap {
  position: relative;
  flex: 1 1 140px;
  min-width: 120px;
}

.stl-list-panel__search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  display: flex;
  pointer-events: none;
}

.stl-list-panel__search {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 30px 8px 32px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.stl-list-panel__search:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.14);
}

.stl-list-panel__search-clear {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.stl-list-panel__toolbar {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  padding: 2px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #cbd5e1;
}

.stl-toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  line-height: 1.2;
}

.stl-toolbar-btn:hover {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #0369a1;
}

.stl-toolbar-btn--paste {
  border: none;
}

.stl-toolbar-btn--paste:hover {
  background: #f0fdf4;
  color: #15803d;
}

.stl-copy-paste-message {
  margin-top: 8px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
}

.stl-copy-paste-message--success {
  color: #059669;
  background: #ecfdf5;
}

.stl-copy-paste-message--error {
  color: #dc2626;
  background: #fef2f2;
}

.stl-list-panel__error {
  flex-shrink: 0;
  padding: 10px 14px;
  font-size: 13px;
  color: #dc2626;
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
}

.stl-list-panel__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;
  scrollbar-width: thin;
  scrollbar-color: #93c5fd transparent;
}

.stl-list-panel--right .stl-list-panel__body {
  scrollbar-color: #6ee7b7 transparent;
}

.stl-list-panel__empty {
  padding: 40px;
  text-align: center;
  font-size: 14px;
  color: #475569;
}

.stl-list-panel__empty--muted {
  color: #64748b;
}

.stl-list-panel__row {
  display: flex;
  width: 100%;
  border: 0;
  font: inherit;
  text-align: left;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  background: #fff;
  transition: background 0.15s, box-shadow 0.15s;
}

.stl-list-panel__items {
  margin: 0;
  padding: 0;
  list-style: none;
}

.stl-list-panel__ordered-row {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s, opacity 0.15s;
}

.stl-list-panel__ordered-row:hover,
.stl-list-panel__ordered-row:focus-within {
  background: #f6fdf9;
}

.stl-list-panel__ordered-row .stl-list-panel__row {
  flex: 1;
  min-width: 0;
  gap: 10px;
  padding: 9px 4px 9px 0;
  border-bottom: 0;
  background: transparent;
}

.stl-list-panel__ordered-row .stl-list-panel__row:hover {
  background: transparent;
}

/* Grip */
.stl-list-panel__drag-handle {
  flex: 0 0 28px;
  align-self: stretch;
  display: grid;
  place-items: center;
  color: #cbd5e1;
  transition: color 0.15s;
  touch-action: none;
}

.stl-list-panel__ordered-row:hover .stl-list-panel__drag-handle,
.stl-list-panel__ordered-row:focus-within .stl-list-panel__drag-handle {
  color: #64748b;
}

.stl-list-panel__drag-handle[draggable="true"] {
  cursor: grab;
}

.stl-list-panel__drag-handle[draggable="true"]:active {
  cursor: grabbing;
}

.stl-list-panel__drag-handle[draggable="false"] {
  visibility: hidden;
}

.stl-list-panel__drag-grip {
  width: 8px;
  height: 14px;
  background: radial-gradient(circle, currentColor 1.1px, transparent 1.6px) 0 0 / 4px 4.67px;
}

/* Position number */
.stl-list-panel__position {
  flex: 0 0 auto;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  box-sizing: border-box;
  display: inline-grid;
  place-items: center;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

/* Drag states */
.stl-list-panel__ordered-row[data-dragging] {
  opacity: 0.4;
  background: #f8fafc;
}

.stl-list-panel__ordered-row[data-drop]::after {
  position: absolute;
  left: 28px;
  right: 10px;
  height: 2px;
  border-radius: 2px;
  background: #059669;
  box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.15);
  content: "";
  pointer-events: none;
  z-index: 1;
}

.stl-list-panel__ordered-row[data-drop]::before {
  position: absolute;
  left: 22px;
  width: 8px;
  height: 8px;
  box-sizing: border-box;
  border: 2px solid #059669;
  border-radius: 50%;
  background: #fff;
  content: "";
  pointer-events: none;
  z-index: 2;
}

.stl-list-panel__ordered-row[data-drop="before"]::after { top: -1px; }
.stl-list-panel__ordered-row[data-drop="after"]::after { bottom: -1px; }
.stl-list-panel__ordered-row[data-drop="before"]::before { top: -4px; }
.stl-list-panel__ordered-row[data-drop="after"]::before { bottom: -4px; }

/* Up / down: stacked, revealed on hover or focus (always shown on touch) */
.stl-list-panel__order-controls {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 1px;
  opacity: 0;
  transition: opacity 0.15s;
}

.stl-list-panel__ordered-row:hover .stl-list-panel__order-controls,
.stl-list-panel__ordered-row:focus-within .stl-list-panel__order-controls {
  opacity: 1;
}

@media (hover: none) {
  .stl-list-panel__order-controls { opacity: 1; }
}

.stl-list-panel__order-controls button {
  display: grid;
  place-items: center;
  width: 24px;
  height: 15px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.stl-list-panel__order-chevron {
  width: 5px;
  height: 5px;
  border-top: 1.75px solid currentColor;
  border-left: 1.75px solid currentColor;
  transform: translateY(1.5px) rotate(45deg);
}

.stl-list-panel__order-controls button:last-child .stl-list-panel__order-chevron {
  transform: translateY(-1.5px) rotate(225deg);
}

.stl-list-panel__order-controls button:hover:not(:disabled) {
  background: #d1fae5;
  color: #047857;
}

.stl-list-panel__order-controls button:disabled {
  opacity: 0.3;
  cursor: default;
}

.stl-list-panel__order-controls button:focus-visible {
  outline: 2px solid #0369a1;
  outline-offset: 0;
}

.stl-list-panel__row-action--ordered {
  padding: 0 12px 0 6px;
  align-self: stretch;
  align-items: center;
  cursor: pointer;
}

.stl-list-panel__ordered-row:hover .stl-list-panel__row-action--ordered {
  opacity: 1;
}

.stl-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.stl-list-panel__row:focus-visible {
  outline: 2px solid #0369a1;
  outline-offset: -2px;
}

.stl-list-panel__row:hover {
  background: #f0f9ff;
}

.stl-list-panel__row--right:hover {
  background: #ecfdf5;
}

.stl-list-panel__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #e0f2fe;
}

.stl-list-panel__row--right .stl-list-panel__avatar {
  border-color: #d1fae5;
}

.stl-list-panel__avatar-fallback {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #0369a1;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #bae6fd;
}

.stl-list-panel__avatar-fallback--right {
  background: linear-gradient(135deg, #d1fae5 0%, #6ee7b7 100%);
  color: #047857;
  box-shadow: 0 0 0 1px #6ee7b7;
}

.stl-list-panel__item-text {
  flex: 1;
  font-size: 14px;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stl-list-panel__row-action {
  color: #0baae9;
  display: flex;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.stl-list-panel__row:hover .stl-list-panel__row-action {
  opacity: 1;
}

.stl-list-panel__row-action--remove {
  color: #ef4444;
}

.stl-list-scroll::-webkit-scrollbar {
  width: 6px;
}
.stl-list-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.stl-list-scroll::-webkit-scrollbar-thumb {
  background: #93c5fd;
  border-radius: 999px;
}
.stl-list-panel--right .stl-list-scroll::-webkit-scrollbar-thumb {
  background: #6ee7b7;
}
.stl-list-scroll::-webkit-scrollbar-thumb:hover {
  background: #60a5fa;
}
.stl-list-panel--right .stl-list-scroll::-webkit-scrollbar-thumb:hover {
  background: #34d399;
}

@media (max-width: 640px) {
  .stl-filter-grid {
    grid-template-columns: 1fr;
  }

  .stl-filter-panel__footer-actions {
    width: 100%;
  }

  .stl-filter-btn {
    flex: 1;
  }
}
`;
