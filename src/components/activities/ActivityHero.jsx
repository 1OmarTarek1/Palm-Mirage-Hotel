import { motion } from "framer-motion";
import DynamicTitle from "@/components/common/DynamicTitle";
import AppBreadcrumb from "@/components/common/AppBreadcrumb";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&auto=format&fit=crop";

export default function ActivityHero() {
  return (
    <section className="relative w-full h-[60vh] lg:h-[75vh] overflow-hidden mt-20 rounded-2xl">
      <img
        src={HERO_IMAGE}
        alt="Activities in Luxor"
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-2 [&_h1]:text-white! [&_nav]:mt-0! [&_nav]:mb-0! [&_ol]:text-white/80! [&_a]:text-white/80! hover:[&_a]:text-white! [&_span]:text-white! [&_li]:text-white/80! [&_svg]:text-white/80!"
        >
          <DynamicTitle />
          <AppBreadcrumb />
        </motion.div>
      </div>
    </section>
  );
}
