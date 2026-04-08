import { motion, AnimatePresence } from "framer-motion";

import RestaurantDishAddButton from "@/components/restaurant/RestaurantDishAddButton";


const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const colVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: 0.22, ease: "easeIn" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18, ease: "easeIn" } },
};


function MenuItem({ item }) {
  // Check if price is a valid number to format it correctly, otherwise use as string
  const formattedPrice = typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price;

  return (
    <div className="group -mx-3 mb-2 flex items-start gap-4 rounded-xl border-b border-border px-3 py-5 transition-colors duration-200 last:border-b-0 hover:bg-primary/10">
      <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted shadow-sm ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/30">
        <img
          src={item.image || item.img}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=320&h=320&q=80";
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug text-foreground">{item.name}</h3>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-[15px] font-bold tabular-nums text-primary">{formattedPrice}</span>
            <RestaurantDishAddButton dish={item} size="sm" />
          </div>
        </div>
        <div className="my-1 border-b border-dotted border-border" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function MenuGrid({ activeIndex, categoryLabel, items }) {
  return (
    <div className="mb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="flex items-center gap-3 mb-2"
            variants={headerVariants}
          >
            <h2 className="text-xl font-bold text-foreground">{categoryLabel}</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">
              {items.length} items
            </span>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-9"
            variants={gridVariants}
          >
            {items.map((item) => (
              <motion.div key={item._id || item.id} variants={colVariants} className="flex flex-col">
                <MenuItem item={item} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
