"use client";

import { useEffect, useState } from "react";
import GameHud from "./GameHud";
import IdentityGate from "./IdentityGate";
import MissionLog from "./MissionLog";
import ConflictForge from "./ConflictForge";
import SuitWeaver from "./SuitWeaver";
import Terminal from "./Terminal";
import VictoryOverlay from "./VictoryOverlay";
import WebField from "./WebField";
import WebShot from "./WebShot";
import { useGame } from "@/context/GameContext";

export default function GameShell() {
  const { level, isComplete, alias } = useGame();
  const [shot, setShot] = useState(0);

  // Fire a web-line on every chapter change.
  useEffect(() => {
    setShot((n) => n + 1);
  }, [level.id]);

  const [shotVisible, setShotVisible] = useState(false);
  useEffect(() => {
    if (shot === 0) return;
    setShotVisible(true);
    const timer = setTimeout(() => setShotVisible(false), 900);
    return () => clearTimeout(timer);
  }, [shot]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink text-silk lg:h-[100dvh] lg:overflow-hidden">
      <WebField accent={level.accent} />
      <GameHud />

      <main className="relative grid gap-4 p-4 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:gap-5 lg:p-5">
        <div className="lg:min-h-0 lg:h-full">
          <MissionLog />
        </div>
        <div className="min-h-[340px] lg:h-full">
          {level.kind === "conflict" ? (
            <ConflictForge />
          ) : level.kind === "weave" ? (
            <SuitWeaver />
          ) : (
            <Terminal />
          )}
        </div>
      </main>

      {!alias && <IdentityGate />}
      {shotVisible && <WebShot shotKey={shot} accent={level.accent} />}
      {isComplete && <VictoryOverlay />}
    </div>
  );
}
