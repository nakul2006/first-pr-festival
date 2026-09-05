"use client";

import { useState } from "react";
import { SpiderMask } from "@/components/SpiderArt";
import { useGame } from "@/context/GameContext";

/**
 * Asked once, before Chapter 0. The GitHub username is the single most
 * error-prone value of the whole day — capturing it here lets every later
 * chapter show them their exact filename instead of "<your-username>".
 */
export default function IdentityGate() {
  const { setIdentity } = useGame();
  const [alias, setAlias] = useState("");
  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);

  const cleanUser = username.trim().replace(/^@/, "");
  const userValid = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(cleanUser);
  const ready = alias.trim().length > 1 && userValid;

  return (
    <div className="fade-in fixed inset-0 z-50 grid place-items-center bg-black/92 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (ready) setIdentity({ alias: alias.trim(), githubUsername: cleanUser });
        }}
        className="pop-in w-full max-w-md rounded-2xl border border-web-red/40 bg-ink-900 p-8 shadow-[0_0_90px_-20px_rgba(230,36,41,0.9)]"
      >
        <SpiderMask className="mx-auto h-24 w-24 drop-shadow-[0_0_26px_rgba(230,36,41,0.6)]" />

        <h2 className="mt-5 text-center font-display text-3xl uppercase tracking-wide text-silk">
          Who is under the mask?
        </h2>
        <p className="mt-2 text-center text-sm text-silk-dim">
          The Society needs a name and a signal before it opens the archive.
        </p>

        <label className="mt-6 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-web-scarlet">
            Spider-Alias
          </span>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Spider-Byte"
            maxLength={40}
            className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 text-silk outline-none transition focus:border-web-red"
          />
        </label>

        <label className="mt-4 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-web-scarlet">
            GitHub username
          </span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="octocat"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className="mt-1.5 w-full rounded-lg border border-white/15 bg-black/60 px-4 py-2.5 font-mono text-silk outline-none transition focus:border-web-red"
          />
          {touched && !userValid && (
            <span className="mt-1 block font-mono text-[11px] text-signal-bad">
              That isn&apos;t a valid GitHub username — letters, numbers and single
              hyphens only.
            </span>
          )}
          {userValid && (
            <span className="mt-1 block font-mono text-[11px] text-silk-faint">
              Your file will be{" "}
              <span className="text-signal-ok">spider-society/{cleanUser}.json</span>
            </span>
          )}
        </label>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-web-red px-6 py-4 font-display text-xl uppercase tracking-wider text-silk transition hover:brightness-110 disabled:opacity-40"
          disabled={!ready}
        >
          Enter the Git-Verse
        </button>
      </form>
    </div>
  );
}
