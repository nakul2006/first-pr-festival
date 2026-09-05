"use client";

import { AlertTriangle, CheckCircle2, RotateCcw, Shirt } from "lucide-react";
import { useMemo, useState } from "react";
import { useGame } from "@/context/GameContext";

const STARTER = `<div
  class="spider-card"
  data-name="Your Name"
  data-alias="Your Spider-Alias"
  data-github="your-github-username"
  data-suit="#E62429"
>
  <style>
    .spider-card {
      --suit: #e62429;
      width: 320px; height: 440px;
      box-sizing: border-box; padding: 22px;
      font-family: system-ui, sans-serif; color: #e8e6e3;
      background: radial-gradient(circle at 30% 0%, #2a0508, #08080a 70%);
      border: 2px solid var(--suit); border-radius: 18px;
      overflow: hidden;
    }
    .alias { font-size: 26px; color: var(--suit); text-transform: uppercase; margin: 14px 0 2px; }
    .name { font-size: 14px; opacity: .75; margin: 0; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px; padding: 0; list-style: none; }
    .skills li { padding: 5px 10px; font-size: 12px; border: 1px solid var(--suit); border-radius: 999px; }
  </style>

  <h1 class="alias">Your Spider-Alias</h1>
  <p class="name">Your Name</p>
  <ul class="skills">
    <li>Skill One</li><li>Skill Two</li><li>Skill Three</li>
  </ul>
</div>`;

/**
 * Live preview for the hand-written card, rendered in exactly the same
 * sandboxed frame the roster uses — so what they see here is what ships.
 * Same idea as the Conflict Forge: fail safely in the browser first.
 */
export default function SuitWeaver() {
  const { completeLevel, isLevelUnlocked, registerFailure, githubUsername } = useGame();
  const [html, setHtml] = useState(STARTER);
  const [submitted, setSubmitted] = useState(false);

  const attr = (name: string) => {
    const m = html.match(new RegExp(`data-${name}\\s*=\\s*["']([^"']*)["']`, "i"));
    return m ? m[1].trim() : "";
  };

  const checks = useMemo(() => {
    const body = html.replace(/<!--[\s\S]*?-->/g, "");
    const placeholders = ["Your Name", "Your Spider-Alias", "your-github-username", ""];
    const filled = (["name", "alias", "github"] as const).every(
      (k) => !placeholders.includes(attr(k)),
    );
    return [
      {
        label: "Details filled in",
        ok: filled,
        detail: filled
          ? "data-name, data-alias and data-github are yours."
          : "Replace the placeholder values in the data- attributes.",
      },
      {
        label: "Internal CSS present",
        ok: /<style[\s>]/i.test(body),
        detail: /<style[\s>]/i.test(body)
          ? "Styles live inside the card."
          : "Add a <style> block — the CSS has to travel with the card.",
      },
      {
        label: "No JavaScript",
        ok: !/<script/i.test(body) && !/\son\w+\s*=/i.test(body),
        detail:
          !/<script/i.test(body) && !/\son\w+\s*=/i.test(body)
            ? "Pure HTML and CSS."
            : "Remove the <script> tag or inline handler — cards never run JS.",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  const woven = checks.every((c) => c.ok);
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:transparent}body{display:grid;place-items:center;overflow:hidden}</style></head><body>${html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")}</body></html>`;

  return (
    <div className="flex h-full min-h-[440px] flex-col overflow-hidden rounded-2xl border border-web-red/30 bg-black/90 shadow-[0_0_70px_-25px_rgba(230,36,41,0.8)]">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-ink-800/90 px-4 py-2.5">
        <Shirt className="h-4 w-4 text-web-scarlet" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-silk-dim">
          suit weaver — live preview
        </span>
        <button
          onClick={() => {
            setHtml(STARTER);
            setSubmitted(false);
          }}
          className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-silk-faint transition hover:text-web-scarlet"
        >
          <RotateCcw className="h-3 w-3" /> reset
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto] lg:grid-cols-2 lg:grid-rows-1">
        <label className="sr-only" htmlFor="weaver">
          Your card HTML
        </label>
        <textarea
          id="weaver"
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
            setSubmitted(false);
          }}
          spellCheck={false}
          className="scroll-slim min-h-[180px] resize-none border-white/10 bg-transparent p-3 font-mono text-[12px] leading-relaxed text-silk outline-none lg:border-r"
        />
        <div className="grid place-items-center overflow-hidden bg-[#0c0c10] p-3">
          <iframe
            title="Card preview"
            sandbox=""
            srcDoc={doc}
            className="h-[440px] w-[330px] max-w-full border-0"
            style={{ transform: "scale(0.78)", transformOrigin: "center" }}
          />
        </div>
      </div>

      <div className="shrink-0 space-y-1.5 border-t border-white/10 bg-ink-900/80 px-4 py-3">
        {checks.map((check) => (
          <p
            key={check.label}
            className={`flex items-start gap-2 font-mono text-[11px] ${
              check.ok ? "text-signal-ok" : "text-silk-faint"
            }`}
          >
            {check.ok ? (
              <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
            )}
            <span>
              <span className="uppercase tracking-widest">{check.label}</span>
              <span className="ml-2 text-silk-dim">{check.detail}</span>
            </span>
          </p>
        ))}
        {githubUsername && (
          <p className="pt-1 font-mono text-[11px] text-silk-faint">
            Save it as{" "}
            <span className="text-web-scarlet">spider-society/{githubUsername}.html</span>
          </p>
        )}
      </div>

      <button
        onClick={() => {
          setSubmitted(true);
          if (woven) completeLevel();
          else registerFailure();
        }}
        disabled={isLevelUnlocked}
        className={`shrink-0 py-4 font-display text-xl uppercase tracking-wider transition ${
          woven ? "bg-web-red text-silk hover:brightness-110" : "bg-ink-700 text-silk-faint hover:bg-ink-600"
        } disabled:opacity-60`}
      >
        {isLevelUnlocked ? "Suit woven" : woven ? "Suit woven" : "Suit woven — not yet"}
      </button>

      {submitted && !woven && (
        <p className="shrink-0 bg-web-blood/25 px-4 py-2 text-center font-mono text-[11px] text-signal-bad">
          The loom rejected it. Check the three lines above.
        </p>
      )}
    </div>
  );
}
