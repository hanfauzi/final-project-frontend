"use client";

import { useState } from "react";

export function useClipboardMap<K extends string>(initial: Record<K, boolean>) {
  const [copied, setCopied] = useState<Record<K, boolean>>(initial);

  const copy = async (text: string, key: K, timeoutMs = 1500) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied((s) => ({ ...s, [key]: true }));
      setTimeout(() => setCopied((s) => ({ ...s, [key]: false })), timeoutMs);
    } catch {
    }
  };

  return { copied, copy, setCopied };
}
