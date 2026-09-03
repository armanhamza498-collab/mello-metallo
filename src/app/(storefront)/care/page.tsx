import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brass & Copper Care Guide — LAITON & CO",
  description: "Learn how to clean, polish, and preserve the natural patina of your brass cookware, tumblers, and home hardware.",
};

export default function CarePage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="py-16 bg-cream border-b border-sand">
        <div className="container-site text-center max-w-2xl">
          <p className="label-uppercase mb-2">Artisan Care</p>
          <h1 className="font-serif text-4xl md:text-5xl text-espresso font-light mb-4">Brass & Copper Care Guide</h1>
          <p className="font-sans text-muted text-base">
            Simple techniques to preserve the lustre or embrace the natural patina of solid brass and pure copper.
          </p>
        </div>
      </section>

      <section className="container-site py-16 max-w-4xl space-y-12">
        {/* Brass Care */}
        <div className="bg-cream p-8 border border-sand">
          <h2 className="font-serif text-2xl text-espresso mb-4">1. Caring for Brass Hardware & Decor</h2>
          <p className="text-sm text-muted font-sans leading-relaxed mb-4">
            Solid brass naturally oxidizes when exposed to air and oils from touch. This process develops a warm, amber-toned patina that many collectors cherish.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted font-sans space-y-2">
            <li><strong>Routine Dusting:</strong> Wipe regularly with a clean, dry microfiber cloth.</li>
            <li><strong>Removing Smudges:</strong> Dampen a soft cloth with warm water and mild soap. Dry immediately.</li>
            <li><strong>Restoring High Shine:</strong> Apply a small amount of brass polish (or a paste of lemon juice and baking soda) with a soft cloth, rub gently in circular motions, then rinse and dry thoroughly.</li>
          </ul>
        </div>

        {/* Copper Care */}
        <div className="bg-cream p-8 border border-sand">
          <h2 className="font-serif text-2xl text-espresso mb-4">2. Cleaning Copper Tumblers & Dispensers</h2>
          <p className="text-sm text-muted font-sans leading-relaxed mb-4">
            Pure copper water vessels develop dark spots (copper oxide) over time due to contact with water and air. This is a natural proof of pure copper.
          </p>
          <ul className="list-disc pl-5 text-sm text-muted font-sans space-y-2">
            <li><strong>Natural Cleaning Paste:</strong> Mix equal parts pitambari powder or lemon juice and salt.</li>
            <li><strong>Application:</strong> Rub gently over the copper surface using a soft sponge. Watch the dark oxidation instantly dissolve.</li>
            <li><strong>Rinse & Dry:</strong> Rinse immediately with plain water and dry thoroughly with a towel to prevent water spots.</li>
            <li><strong>Important:</strong> Do not scrub pure copper with steel wool or abrasive pads as they will scratch the hand-hammered surface.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
