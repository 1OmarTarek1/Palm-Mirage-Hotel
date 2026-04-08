import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function MenuReservationHero({ activeCategory, items }) {
  // Use backend category image if available on the items array, fallback to static category hero
  const activeHeroImg = items?.[0]?.categoryHeroImg || activeCategory?.heroImg;

  return (
    <div className="mb-20">
      <div className="relative w-full rounded-3xl overflow-hidden min-h-[500px] sm:min-h-[540px] md:min-h-[580px] lg:min-h-[620px]">

        <AnimatePresence mode="wait">
          <motion.img
            key={activeHeroImg}
            src={activeHeroImg}
            alt={`${activeCategory?.label || 'Menu'} ambiance`}
            className="absolute inset-0 w-full h-full object-cover object-center dark:brightness-50 dark:contrast-110"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=800&fit=crop&auto=format";
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-gradient-to-b from-black/10 via-black/40 to-black/90 dark:from-black/20 dark:via-black/60 dark:to-black/95" />

        {/* Badge */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-full">
            Reservations
          </span>
        </div>


        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 sm:px-8 md:px-12 pb-10 md:pb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-10">
            <div>
              <p className="text-[11px] font-bold tracking-[0.25em] text-green-400 uppercase mb-3">
                Book Your Table
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-header">
                Make A<br />Reservation
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 md:gap-8">
              <p className="text-sm text-gray-200 leading-relaxed max-w-[280px]">
                For banquet inquiries, call our direct line at{" "}
                <span className="text-white font-medium">+41 (0)41 211 22 24</span>{" "}
                or email us at{" "}
                <span className="text-white font-medium">sailing@contact.com</span>.
              </p>
              <Button asChild variant="palmWhiteSecondary" className="text-sm" size="lg">
                <Link to="/services/restaurant#table-booking">Book A Table</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
