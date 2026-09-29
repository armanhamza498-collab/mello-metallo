import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — Mello Metallo",
  description: "The story of Mello Metallo — bridging European luxury homeware design with contemporary Indian brass craftsmanship.",
};

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <section className="relative py-24 bg-espresso text-ivory overflow-hidden">
        <div className="container-site text-center max-w-3xl">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-brass-light mb-4 font-medium">Heritage & Philosophy</p>
          <h1 className="font-serif font-light text-4xl md:text-6xl mb-6">
            Crafting Objects with <span className="italic text-brass-lighter">Memory.</span>
          </h1>
          <p className="font-sans text-ivory/70 text-lg leading-relaxed">
            Mello Metallo was founded to celebrate the timeless warmth of brass and copper — bringing century-old Indian metalworking techniques into the quiet luxury of modern European interiors.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="section-padding container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="label-uppercase mb-3">Our Origins</p>
            <h2 className="font-serif font-light text-espresso mb-6 text-3xl md:text-4xl">
              Where Hammer Meets Design
            </h2>
            <p className="text-muted text-base leading-relaxed mb-4">
              In traditional Indian metallurgy, brass is not merely an alloy; it is a ritual. For centuries, brass kadhais, tumblers, and decorative vessels were passed down as heirloom objects, accumulating a unique patina with every decade.
            </p>
            <p className="text-muted text-base leading-relaxed">
              We collaborate directly with master artisans across India — honoring their hand-hammering methods while refining proportions and finishes for modern residential architecture.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-cream">
            <img
              src="https://images.unsplash.com/photo-1493305009768-3dc8af7fcb6b?w=800&q=85"
              alt="Artisan at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-cream">
        <div className="container-site">
          <div className="text-center mb-16">
            <p className="label-uppercase mb-2">Pillars of Craft</p>
            <h2 className="font-serif font-light text-espresso text-3xl md:text-4xl">What Defines Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Genuine Solid Metal",
                desc: "We never use cheap plating or hollow casting. Every Mello Metallo object is forged from solid, heavy-gauge brass or pure copper.",
              },
              {
                title: "Slow Production",
                desc: "Speed is the enemy of permanence. Our pieces are hand-shaped slowly, allowing every curve and hammer stroke to settle naturally.",
              },
              {
                title: "Living Finish",
                desc: "Our brass is intended to age gracefully with handling. The evolving patina reflects the life and home of its owner.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-ivory p-8 border border-sand">
                <h3 className="font-serif text-xl text-espresso mb-3">{v.title}</h3>
                <p className="text-sm font-sans text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
