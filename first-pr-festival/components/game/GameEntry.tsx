"use client";

import { useSearchParams } from "next/navigation";
import FacilitatorView from "./FacilitatorView";
import GameShell from "./GameShell";
import { GameProvider } from "@/context/GameContext";

/**
 * `/game` is the student experience; `/game?facilitator=1` is the projector
 * view for whoever is running the room.
 */
export default function GameEntry() {
  const params = useSearchParams();
  if (params.get("facilitator") !== null) return <FacilitatorView />;

  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
