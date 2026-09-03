"use client";

import { FileText } from "lucide-react";

export default function AdminPagesCMSPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[--admin-text]">Static Pages CMS</h1>
        <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
          Manage contents for About, Craftsmanship, Contact, and Privacy Policy pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["About Us", "Craftsmanship Story", "Contact & Concierge", "Terms & Privacy"].map((page) => (
          <div key={page} className="p-5 rounded-xl border bg-[--admin-surface] border-[--admin-border] space-y-3">
            <FileText size={20} className="text-brass" />
            <h3 className="font-serif text-lg text-[--admin-text]">{page}</h3>
            <p className="text-xs font-sans text-[--admin-text-muted]">Last edited 2 days ago</p>
            <button className="px-3 py-1.5 bg-[--admin-surface-2] border border-[--admin-border] text-[--admin-text] text-xs font-sans rounded-md hover:border-[--admin-accent]">
              Edit Page Content
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
