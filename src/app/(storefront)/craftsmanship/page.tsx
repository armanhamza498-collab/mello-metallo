import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Master Craftsmanship — Mello Metallo",
  description: "Learn about our hand-hammering, tinning, and polishing techniques practiced by master Indian coppersmiths.",
};

export default function CraftsmanshipPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="py-20 bg-espresso text-ivory text-center">
        <div className="container-site max-w-3xl">
          <p className="label-uppercase text-brass-lighter mb-3">Artisan Heritage</p>
          <h1 className="font-serif text-4xl md:text-6xl font-light mb-4">The Art of the Hammer</h1>
          <p className="font-sans text-ivory/70 text-base leading-relaxed">
            Every curve, stroke, and lustre is guided by human hands. Discover how raw brass becomes an heirloom.
          </p>
        </div>
      </section>

      <section className="container-site py-16 max-w-4xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-3xl text-espresso mb-4">1. Hand-Forging & Shaping</h2>
            <p className="text-sm font-sans text-muted leading-relaxed">
              Solid brass sheets are heated in traditional coal hearths to soften the metal before artisans hammer them into seamless spherical and conical shapes.
            </p>
          </div>
          <div className="aspect-[4/3] overflow-hidden bg-cream">
            <img src="https://images.unsplash.com/photo-1493305009768-3dc8af7fcb6b?w=600&q=80" alt="Forging brass" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 aspect-[4/3] overflow-hidden bg-cream">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="Hammering surface" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-3xl text-espresso mb-4">2. Surface Texturing (Mathar)</h2>
            <p className="text-sm font-sans text-muted leading-relaxed">
              The signature dimpled texture — known in Hindi as *Matharkam* — is created by thousands of rhythmic hammer strikes. This strengthens the metal while catching ambient light.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
