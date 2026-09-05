"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import SpiderCard from "./SpiderCard";
import WovenCard from "./WovenCard";
import type { SpiderMember } from "@/utils/getData";

export default function SocietyGrid({ members }: { members: SpiderMember[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.alias, m.githubUsername, m.dimension, ...m.skills]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [members, query]);

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-ink-900/50 px-6 py-16 text-center">
        <p className="font-display text-3xl text-web-scarlet">Mainframe Empty</p>
        <p className="mt-2 text-sm text-white/55">
          No anomalies detected yet. Be the first — open a Pull Request with your{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-web-red">
            spider-society/your-username.json
          </code>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-sm">
          <span className="sr-only">Scan the mainframe</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="scan the mainframe… (name, skill, dimension)"
            className="w-full rounded-full border border-white/15 bg-ink-900/80 px-5 py-2.5 font-mono text-sm text-white placeholder:text-white/35 outline-none transition focus:border-web-scarlet/70 focus:shadow-[0_0_40px_-14px_rgba(230,36,41,0.8)]"
          />
        </label>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          {filtered.length} / {members.length} anomalies
        </p>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((member, i) => (
            <motion.div key={member.fileName} layout exit={{ opacity: 0, scale: 0.92 }} className="h-full">
              {member.html ? (
                <WovenCard member={member} index={i} />
              ) : (
                <SpiderCard member={member} index={i} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center font-mono text-sm text-white/45">
          No spider matches <span className="text-web-red">&ldquo;{query}&rdquo;</span> in this
          dimension.
        </p>
      )}
    </div>
  );
}
