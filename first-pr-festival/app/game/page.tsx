import type { Metadata } from "next";
import { Suspense } from "react";
import GameEntry from "@/components/game/GameEntry";

export const metadata: Metadata = {
  title: "Into the Git-Verse: The Multiverse Terminal",
  description:
    "An interactive Git escape room for the First PR Festival. Eleven chapters across two acts, real Git commands, one Pull Request.",
};

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-ink" />}>
      <GameEntry />
    </Suspense>
  );
}
