"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * Copies a command to the clipboard. Beginners mistype commands constantly —
 * this removes a whole class of "why doesn't it work" from the room.
 */
export default function CopyButton({
  text,
  className = "",
  label,
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back to the old trick.
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more we can do — the text is on screen to type */
      }
      document.body.removeChild(el);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        copy();
      }}
      aria-label={copied ? "Copied" : `Copy ${label ?? "command"}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest transition ${
        copied
          ? "text-signal-ok"
          : "text-silk-faint hover:bg-web-red/15 hover:text-web-scarlet"
      } ${className}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "copied" : "copy"}
    </button>
  );
}
