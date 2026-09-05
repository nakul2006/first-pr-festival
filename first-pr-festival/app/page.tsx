import Link from "next/link";
import Footer from "@/components/Footer";
import GlitchText from "@/components/GlitchText";
import JoinPanel from "@/components/JoinPanel";
import SocietyGrid from "@/components/SocietyGrid";
import StatsBar from "@/components/StatsBar";
import WebBackground from "@/components/WebBackground";
import { REPO_URL } from "@/data/levels";
import { getSocietyStats, getSpiderSociety } from "@/utils/getData";

// The roster only changes when a PR is merged, so bake it into the build.
export const dynamic = "force-static";


export default function Home() {
  const members = getSpiderSociety();
  const stats = getSocietyStats(members);

  return (
    <main className="relative min-h-screen">
      <WebBackground />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-24 sm:pt-32">
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-web-scarlet/30 bg-web-scarlet/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-web-scarlet">
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-web-scarlet" />
          Mainframe online
        </p>

        <h1 className="font-display text-6xl font-black uppercase leading-[0.9] tracking-tight text-white sm:text-8xl lg:text-9xl">
          <GlitchText>Spider-Society</GlitchText>
          <br />
          <span className="bg-gradient-to-r from-web-scarlet via-web-red to-web-blood bg-clip-text text-transparent">
            Mainframe
          </span>
        </h1>

        <p className="mt-6 max-w-2xl font-mono text-sm uppercase tracking-[0.18em] text-white/60 sm:text-base">
          First PR Festival : Intro to Github and Open Source
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/45">
          Every card below is a real merged Pull Request. Ship yours and the multiverse
          rebuilds itself around you.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/game"
            className="rounded-full bg-web-red px-6 py-3 font-display text-lg uppercase tracking-wider text-white shadow-[0_0_36px_-8px_rgba(230,36,41,0.9)] transition hover:brightness-110"
          >
            ▶ Play: Into the Git-Verse
          </Link>
          <a
            href="#join"
            className="rounded-full border border-white/20 px-6 py-3 font-display text-lg uppercase tracking-wider text-white/85 transition hover:border-web-red hover:text-web-red"
          >
            Submit Your Spider-ID
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 px-6 py-3 font-display text-lg uppercase tracking-wider text-white/85 transition hover:border-web-scarlet hover:text-web-scarlet"
          >
            View Repository
          </a>
        </div>

        <div className="mt-14">
          <StatsBar
            stats={[
              { label: "Anomalies Merged", value: stats.anomaliesMerged, accent: "#E62429" },
              { label: "Hand-Woven Suits", value: stats.handWoven, accent: "#FF3B3B" },
              { label: "Unique Abilities", value: stats.uniqueSkills, accent: "#E8E6E3" },
              { label: "Top Ability", value: stats.topSkill.toUpperCase(), accent: "#C1121F" },
            ]}
          />
        </div>
      </section>

      {/* ── ROSTER ───────────────────────────────────────────────── */}
      <section id="roster" className="mx-auto max-w-6xl px-6 pt-10">
        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-4">
          <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
            The <span className="text-web-scarlet">Roster</span>
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            live from /spider-society
          </span>
        </div>

        <SocietyGrid members={members} />
      </section>

      <JoinPanel />
      <Footer />
    </main>
  );
}
