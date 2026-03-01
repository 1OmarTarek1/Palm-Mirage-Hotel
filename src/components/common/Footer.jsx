import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram, Hotel, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedScrollToTop from "./AnimatedScrollToTop";
import logoImg from "@/assets/logo.png";

// ─── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

// ─── Data ───────────────────────────────────────────────────────────────────
const quickLinks = [
  { label: "FAQs", href: "#" },
  { label: "Contact Us", href: "/contact" },
  { label: "Location Map", href: "#" },
  { label: "Press", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

// Component
export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#1a1f1a] text-white relative overflow-hidden">
      {/* ── subtle background texture ── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_20%_50%,#8a9d8a_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* ═══ TOP — Logo + Description ══════════════════════════════════ */}
        <motion.div 
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center text-center pt-14 pb-12 border-b border-white/10"
        >
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 mb-5 group">
            <div className="w-14 h-14 flex items-center justify-center shrink-0">
              <img src={logoImg} alt="Palm Mirage Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-header font-semibold tracking-wide text-white">Palm Mirage Hotel</span>
          </NavLink>

          {/* Tagline */}
          <p className="text-white/60 text-sm leading-relaxed max-w-xl font-main">
            Nestled in the Swiss mountains like a hidden edelweiss, our 5-star superior hotel in Samnaun blends
            tradition with modern luxury, following its renovation in 2022. Since 1965, the Sailing has epitomized a
            family atmosphere of well-being.
          </p>
        </motion.div>

        {/* ═══ MIDDLE — 3 Columns ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-14 border-b border-white/10">
          {/* ── Col 1 : Information ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}>
            <h3 className="font-header text-lg font-semibold mb-6 text-white">Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm hover:text-white/90 transition-colors">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#8a9d8a]" />
                <span>Kurhausstrasse 65, 8032 Zürich, Switzerland</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm hover:text-white/90 transition-colors">
                <Phone size={16} className="shrink-0 text-[#8a9d8a]" />
                <span>+41 (0)41 211 22 24 · +41 (0)41 211 22 24</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm hover:text-white/90 transition-colors">
                <Mail size={16} className="shrink-0 text-[#8a9d8a]" />
                <a href="mailto:mountain.hotel@gmail.com" className="hover:text-[#8a9d8a] transition-colors">
                  mountain.hotel@gmail.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* ── Col 2 : Subscribe & Follow ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={0.15}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center"
          >
            <h3 className="font-header text-lg font-semibold mb-6 text-white">Subscribe &amp; Follow Us</h3>

            {/* Email subscribe */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="flex w-full max-w-sm rounded-full bg-white/10 border border-white/15 overflow-hidden mb-8"
            >
              <input
                id="newsletter-email"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                className="bg-[#8a9d8a] hover:bg-[#738581] text-white text-sm font-semibold px-5 py-3 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>

            {/* Social icons */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-[#8a9d8a] hover:text-white hover:border-[#8a9d8a] transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Col 3 : Quick Links ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            custom={0.3}
            viewport={{ once: true }}
            className="md:text-right"
          >
            <h3 className="font-header text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <NavLink to={href} className="text-white/60 text-sm hover:text-[#8a9d8a] transition-colors">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ═══ BOTTOM — Copyright ═════════════════════════════════════════ */}
        <div className="flex items-center justify-center py-6 relative">
          <p className="text-white/40 text-sm text-center">
            Copyright {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* ── Scroll-to-top button ── */}
      <AnimatedScrollToTop />
    </footer>
  );
}
