"use client";

import { motion } from "framer-motion";
import type { SpiderMember } from "@/utils/getData";

/**
 * Renders a student's hand-written card inside a sandboxed iframe.
 *
 * The `sandbox` attribute with no allow-scripts is the whole security model:
 * their JS never executes, and their CSS is confined to the frame's own
 * document, so it cannot leak out and restyle the roster. Worst case, a
 * student breaks their own card.
 */
export default function WovenCard({ member, index = 0 }: { member: SpiderMember; index?: number }) {
  const doc = `<!doctype html><html><head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:transparent;}
  body{display:grid;place-items:center;overflow:hidden;}
</style></head><body>${member.html ?? ""}</body></html>`;

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
      className="reveal-up group relative h-full"
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: `0 0 0 1px ${member.suitColor}44, 0 18px 45px -20px ${member.suitColor}`,
        }}
      >
        <iframe
          title={`${member.alias} — Spider-ID card by ${member.githubUsername}`}
          sandbox=""
          loading="lazy"
          srcDoc={doc}
          className="mx-auto block h-[440px] w-[320px] max-w-full border-0 bg-black"
        />
        {/* The frame swallows pointer events, so the link sits outside it. */}
        <a
          href={`https://github.com/${member.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/95 to-transparent px-4 pb-3 pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-silk-dim opacity-0 transition group-hover:opacity-100"
        >
          <span>@{member.githubUsername}</span>
          <span className="text-web-scarlet">hand-woven ✦</span>
        </a>
      </motion.div>
    </div>
  );
}
