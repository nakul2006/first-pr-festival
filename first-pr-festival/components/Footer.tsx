export default function Footer() {
  return (
    <footer className="mt-28 border-t border-white/10 bg-ink-900/50">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="font-display text-2xl uppercase tracking-[0.3em] text-white/80">
          Go Home, Miles
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          First PR Festival : Intro to Github and Open Source
        </p>
        <p className="mt-1 font-mono text-[11px] text-white/25">
          Static-generated with Next.js · No database, just JSON and Pull Requests.
        </p>
      </div>
    </footer>
  );
}
