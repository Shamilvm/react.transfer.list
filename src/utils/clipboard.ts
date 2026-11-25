import { TransferItem } from "../types";
import { dedupeById } from "./items";

/** Shared across TransferList instances on the same page for one-click paste. */
let transferListClipboard: TransferItem[] | null = null;

export function setTransferListClipboard(items: TransferItem[]) {
  transferListClipboard = dedupeById([...items]);
}

export function getTransferListClipboard(): TransferItem[] | null {
  return transferListClipboard;
}

export async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-99999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (!document.execCommand("copy")) throw new Error("Clipboard copy failed");
  } finally {
    textarea.remove();
  }
}
