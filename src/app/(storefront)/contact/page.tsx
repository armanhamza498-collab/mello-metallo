import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Concierge — LAITON & CO",
  description: "Reach our luxury customer care concierge for custom hardware orders, wholesale, or product inquiries.",
};

export default function ContactPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="py-16 bg-cream border-b border-sand text-center">
        <div className="container-site max-w-2xl">
          <p className="label-uppercase mb-2">Customer Care</p>
          <h1 className="font-serif text-4xl md:text-5xl text-espresso font-light">Client Concierge</h1>
          <p className="text-sm font-sans text-muted mt-3">
            We are here to assist with product selections, custom dimensions, and shipping inquiries.
          </p>
        </div>
      </section>

      <section className="container-site py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="font-serif text-3xl text-espresso">Get in Touch</h2>
            <p className="text-sm font-sans text-muted leading-relaxed">
              Our team responds to all inquiries within 24 hours on business days.
            </p>

            <div className="space-y-4 pt-4 text-sm font-sans">
              <div className="flex items-center gap-3">
                <Mail className="text-brass flex-shrink-0" size={18} />
                <span>concierge@laitonco.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-brass flex-shrink-0" size={18} />
                <span>+91 (022) 4920 8400</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-brass flex-shrink-0 mt-1" size={18} />
                <span>LAITON & CO Studio, Pali Hill, Bandra West, Mumbai 400050</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-brass flex-shrink-0" size={18} />
                <span>Mon–Sat: 10:00 AM – 7:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="bg-cream p-8 border border-sand space-y-4">
            <h3 className="font-serif text-2xl text-espresso mb-4">Send a Message</h3>
            <div>
              <label className="block text-xs font-sans text-muted mb-1">Your Name</label>
              <input type="text" required placeholder="Priya Sharma" className="input-luxury" />
            </div>
            <div>
              <label className="block text-xs font-sans text-muted mb-1">Email Address</label>
              <input type="email" required placeholder="priya@example.com" className="input-luxury" />
            </div>
            <div>
              <label className="block text-xs font-sans text-muted mb-1">Message</label>
              <textarea required rows={4} placeholder="How can we help you?" className="input-luxury" />
            </div>
            <button type="submit" className="btn-primary w-full justify-center py-3.5">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
