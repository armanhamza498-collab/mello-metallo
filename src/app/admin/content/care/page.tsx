"use client";

import { Wrench, Save } from "lucide-react";

export default function AdminCareGuidesContentPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Care & Maintenance Guides</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage brass and copper care instructions displayed on product detail pages and care guide portal
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[--admin-accent] text-white text-xs font-sans font-semibold rounded-lg">
          <Save size={16} /> Save Care Guide
        </button>
      </div>

      <div className="p-6 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-4">
        <h3 className="font-serif text-lg text-[--admin-text]">Brass Care Instructions</h3>
        <textarea
          rows={4}
          defaultValue="Clean with a soft dry cloth after each use. For deeper cleaning, use lemon juice and salt, then rinse and dry immediately. Avoid harsh chemicals to maintain living patina."
          className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
        />

        <h3 className="font-serif text-lg text-[--admin-text] pt-2">Copper Care Instructions</h3>
        <textarea
          rows={4}
          defaultValue="Fill copper water vessels overnight for natural ionization. Clean interior weekly with pitambari powder or lemon & salt. Do not use scrub pads on outer hammered surfaces."
          className="w-full px-3 py-2 bg-[--admin-surface-2] border border-[--admin-border] rounded-lg text-xs text-[--admin-text] outline-none"
        />
      </div>
    </div>
  );
}
