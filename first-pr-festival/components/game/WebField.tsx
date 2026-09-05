import { WebCorner } from "@/components/SpiderArt";

/**
 * Ambient webbing behind the whole game: two anchored corner webs that drift,
 * a woven-suit texture, and a red vignette so the panels sit on something.
 */
export default function WebField({ accent }: { accent: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 suit-weave opacity-[0.55]" />

      <WebCorner
        className="animate-web-breathe absolute -left-10 -top-10 h-[46rem] w-[46rem]"
        opacity={0.62}
      />
      <div className="absolute -bottom-16 -right-16 h-[42rem] w-[42rem] rotate-180">
        <WebCorner className="animate-web-breathe h-full w-full" opacity={0.5} />
      </div>

      {/* Suit-red bloom, tinted by the active chapter */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(900px circle at 15% 10%, ${accent}1f, transparent 62%), radial-gradient(760px circle at 88% 88%, ${accent}14, transparent 60%)`,
        }}
      />
      {/* Third anchor, top-right, so the webbing frames the whole viewport */}
      <div className="absolute -right-24 -top-24 hidden h-[34rem] w-[34rem] rotate-90 lg:block">
        <WebCorner className="animate-web-breathe h-full w-full" opacity={0.4} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
