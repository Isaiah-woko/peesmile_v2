const swatches = [
  { name: "ink", className: "bg-ink" },
  { name: "ink-soft", className: "bg-ink-soft" },
  { name: "ember", className: "bg-ember" },
  { name: "ember-deep", className: "bg-ember-deep" },
  { name: "pine", className: "bg-pine" },
  { name: "brass", className: "bg-brass" },
  { name: "clay", className: "bg-clay" },
  { name: "signal", className: "bg-signal" },
  { name: "sunrise", className: "bg-sunrise" },
  { name: "honey", className: "bg-honey" },
  { name: "sage", className: "bg-sage" },
  { name: "bone", className: "bg-bone" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto w-full max-w-4xl px-6 py-24">
        <p className="mono-label text-body-small text-ash">
          Phase 1 foundation check
        </p>

        <h1 className="display-serif text-display-6 mt-6">PeeSmile</h1>

        <p className="text-body-0 text-ink-soft measure mt-6">
          Some things should not be a text. This page only exists to confirm the
          foundation. Fonts, color, and the fluid type scale are all rendering
          from globals.css. It will be replaced in Phase 2.
        </p>

        <section className="mt-16">
          <h2 className="display-serif text-title-2">Type scale</h2>
          <div className="mt-6 space-y-3">
            <p className="display-serif text-display-4">Display 4</p>
            <p className="display-serif text-title-2">Title 2</p>
            <p className="text-body-0">
              Body 0. Write it like you would say it if you were braver.
            </p>
            <p className="mono-label text-body-small text-ash">Mono label</p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="display-serif text-title-2">Color tokens</h2>
          <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {swatches.map((swatch) => (
              <div key={swatch.name}>
                <div
                  className={`${swatch.className} h-14 rounded-md border border-rule`}
                />
                <p className="mono-label text-body-small text-ash mt-2">
                  {swatch.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}