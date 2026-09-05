const STEPS = [
  { n: "01", title: "Fork the repo", body: "Hit Fork — you now own a parallel dimension of this codebase." },
  { n: "02", title: "Copy the template", body: "Duplicate spider-society/_template.html as spider-society/your-github-username.html" },
  { n: "03", title: "Weave your suit", body: "Fill in the four data- attributes, then restyle the card in HTML and internal CSS. It is yours." },
  { n: "04", title: "Open the Pull Request", body: "Commit, push, and open a PR. On merge, Vercel rebuilds and your card goes live." },
];

const SNIPPET = `<div
  class="spider-card"
  data-name="Your Name"
  data-alias="Your Spider-Alias"
  data-github="your-github-username"
  data-suit="#E62429"
>
  <style>
    .spider-card {
      width: 320px; height: 440px;
      border: 2px solid #e62429;
      /* ...the rest is yours... */
    }
  </style>

  <h1 class="alias">Your Spider-Alias</h1>
</div>`;

export default function JoinPanel() {
  return (
    <section id="join" className="mx-auto mt-28 max-w-6xl px-6">
      <h2 className="font-display text-4xl uppercase tracking-wide text-white sm:text-5xl">
        Join the <span className="text-web-red">Society</span>
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-white/55">
        Four commands stand between you and a canonical spot in the multiverse.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ol className="space-y-3">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="group flex gap-4 rounded-xl border border-white/10 bg-ink-900/60 p-4 transition hover:border-web-scarlet/40 hover:bg-ink-800/60"
            >
              <span className="font-display text-2xl text-web-scarlet/70 transition group-hover:text-web-scarlet">
                {step.n}
              </span>
              <div>
                <p className="font-display text-lg uppercase tracking-wide text-white">
                  {step.title}
                </p>
                <p className="mt-0.5 text-sm text-white/55">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="overflow-hidden rounded-xl border border-web-blood/30 bg-ink-900/80 shadow-[0_0_40px_-14px_rgba(230,36,41,0.8)]">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-web-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-web-scarlet" />
            <span className="h-2.5 w-2.5 rounded-full bg-signal-ok" />
            <span className="ml-2 font-mono text-[11px] text-white/45">
              spider-society/your-username.html
            </span>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-web-scarlet/90">
            {SNIPPET}
          </pre>
        </div>
      </div>
    </section>
  );
}
