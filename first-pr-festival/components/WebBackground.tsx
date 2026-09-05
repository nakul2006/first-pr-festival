import { WebCorner } from "@/components/SpiderArt";

/** Decorative webbing behind the roster. Server-rendered, zero JS. */
export default function WebBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 suit-weave opacity-50" />
      <WebCorner
        className="animate-web-breathe absolute -left-16 -top-16 h-[48rem] w-[48rem]"
        opacity={0.7}
      />
      <div className="absolute -bottom-20 -right-20 h-[44rem] w-[44rem] rotate-180">
        <WebCorner className="animate-web-breathe h-full w-full" opacity={0.6} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(230,36,41,0.16),transparent_60%),radial-gradient(700px_circle_at_100%_90%,rgba(142,9,18,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
