"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStages, LEVELS, TOTAL_XP } from "@/data/levels";

export type HistoryEntry = {
  id: string;
  kind: "input" | "success" | "error" | "warn" | "system" | "lore";
  text: string;
};

type GameState = {
  currentLevel: number;
  terminalHistory: HistoryEntry[];
  /** True once the current level's challenge has been passed. */
  isLevelUnlocked: boolean;
  /** Which check within a multi-command level the player is on. */
  stageIndex: number;
  xp: number;
  attempts: number;
  hintsUsed: number;
  alias: string;
  githubUsername: string;
  soundOn: boolean;
  startedAt: number | null;
  finishedAt: number | null;
};

type GameContextValue = GameState & {
  level: (typeof LEVELS)[number];
  stages: ReturnType<typeof getStages>;
  stage: ReturnType<typeof getStages>[number];
  stageCount: number;
  totalXp: number;
  isComplete: boolean;
  progress: number;
  pushHistory: (entry: Omit<HistoryEntry, "id">) => void;
  clearHistory: () => void;
  completeLevel: () => void;
  /** Passes the current check; completes the level when it was the last one. */
  clearStage: () => { advanced: boolean; done: boolean };
  advanceLevel: () => void;
  registerFailure: () => void;
  useHint: () => string;
  setIdentity: (identity: { alias: string; githubUsername: string }) => void;
  toggleSound: () => void;
  resetGame: () => void;
};

const STORAGE_KEY = "git-verse-progress-v2";

const INITIAL: GameState = {
  currentLevel: 0,
  stageIndex: 0,
  terminalHistory: [],
  isLevelUnlocked: false,
  xp: 0,
  attempts: 0,
  hintsUsed: 0,
  alias: "",
  githubUsername: "",
  soundOn: false,
  startedAt: null,
  finishedAt: null,
};

const GameContext = createContext<GameContextValue | null>(null);

let entryId = 0;
const nextId = () => `entry-${entryId++}-${Math.random().toString(36).slice(2, 7)}`;

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  // Restore progress — students refresh, close laptops, and switch rooms.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<GameState>;
        // Note: `parsed` never contains terminalHistory (we strip it on save),
        // and we must NOT reset it here — child effects run before parent
        // effects, so the Terminal's boot banner already exists by now and
        // clobbering it would leave the scrollback empty on every load.
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* corrupted or unavailable storage — start clean */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const { terminalHistory: _ignored, ...durable } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(durable));
    } catch {
      /* storage full or blocked — progress just won't persist */
    }
  }, [state, hydrated]);

  const pushHistory = useCallback((entry: Omit<HistoryEntry, "id">) => {
    setState((prev) => ({
      ...prev,
      terminalHistory: [...prev.terminalHistory, { ...entry, id: nextId() }].slice(-120),
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, terminalHistory: [] }));
  }, []);

  const clearStage = useCallback(() => {
    let result = { advanced: false, done: false };
    setState((prev) => {
      const level = LEVELS[prev.currentLevel];
      const stages = getStages(level);
      const next = prev.stageIndex + 1;
      if (next < stages.length) {
        result = { advanced: true, done: false };
        return { ...prev, stageIndex: next, startedAt: prev.startedAt ?? Date.now() };
      }
      result = { advanced: false, done: true };
      if (prev.isLevelUnlocked) return prev;
      const isLast = prev.currentLevel === LEVELS.length - 1;
      return {
        ...prev,
        isLevelUnlocked: true,
        xp: prev.xp + level.xp,
        startedAt: prev.startedAt ?? Date.now(),
        finishedAt: isLast ? Date.now() : prev.finishedAt,
      };
    });
    return result;
  }, []);

  const completeLevel = useCallback(() => {
    setState((prev) => {
      if (prev.isLevelUnlocked) return prev;
      const level = LEVELS[prev.currentLevel];
      const isLast = prev.currentLevel === LEVELS.length - 1;
      return {
        ...prev,
        isLevelUnlocked: true,
        xp: prev.xp + level.xp,
        startedAt: prev.startedAt ?? Date.now(),
        finishedAt: isLast ? Date.now() : prev.finishedAt,
      };
    });
  }, []);

  const advanceLevel = useCallback(() => {
    setState((prev) =>
      prev.currentLevel >= LEVELS.length - 1
        ? prev
        : { ...prev, currentLevel: prev.currentLevel + 1, isLevelUnlocked: false, stageIndex: 0 },
    );
  }, []);

  const registerFailure = useCallback(() => {
    setState((prev) => ({
      ...prev,
      attempts: prev.attempts + 1,
      startedAt: prev.startedAt ?? Date.now(),
    }));
  }, []);

  const useHint = useCallback(() => {
    let hint = "";
    setState((prev) => {
      const level = LEVELS[prev.currentLevel];
      const stage = getStages(level)[prev.stageIndex] ?? getStages(level)[0];
      const index = Math.min(prev.hintsUsed, stage.hints.length - 1);
      hint = stage.hints[index];
      return { ...prev, hintsUsed: prev.hintsUsed + 1 };
    });
    return hint;
  }, []);

  const setIdentity = useCallback(
    ({ alias, githubUsername }: { alias: string; githubUsername: string }) => {
      setState((prev) => ({ ...prev, alias, githubUsername }));
    },
    [],
  );

  const toggleSound = useCallback(() => {
    setState((prev) => ({ ...prev, soundOn: !prev.soundOn }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...INITIAL });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<GameContextValue>(() => {
    const level = LEVELS[state.currentLevel];
    const stages = getStages(level);
    const isComplete = state.currentLevel === LEVELS.length - 1 && state.isLevelUnlocked;
    return {
      ...state,
      level,
      stages,
      stage: stages[Math.min(state.stageIndex, stages.length - 1)],
      stageCount: stages.length,
      totalXp: TOTAL_XP,
      isComplete,
      progress: Math.round((state.xp / TOTAL_XP) * 100),
      pushHistory,
      clearHistory,
      completeLevel,
      clearStage,
      advanceLevel,
      registerFailure,
      useHint,
      setIdentity,
      toggleSound,
      resetGame,
    };
  }, [
    state,
    pushHistory,
    clearHistory,
    completeLevel,
    clearStage,
    advanceLevel,
    registerFailure,
    useHint,
    setIdentity,
    toggleSound,
    resetGame,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
