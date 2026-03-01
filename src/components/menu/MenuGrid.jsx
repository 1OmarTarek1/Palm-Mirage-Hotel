import { motion, AnimatePresence } from "framer-motion";


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
  return (
    <div className="group mb-2 flex items-start gap-4 py-5 border-b border-border last:border-b-0 hover:bg-primary/10 transition-colors duration-200 rounded-xl px-3 -mx-3">
      <div className="shrink-0 w-[68px] h-[68px] rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-300 bg-muted shadow-sm">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://placehold.co/160x160/f3f4f6/9ca3af?text=🍽";
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold text-foreground leading-snug">
            {item.name}
          </h3>
          <span className="text-[15px] font-bold text-primary shrink-0 tabular-nums">
            {item.price}
          </span>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 "
            variants={gridVariants}
          >
            <motion.div variants={colVariants} className="flex flex-col">
              {items.slice(0, 3).map((item) => (
                <MenuItem key={item.id + "-a"} item={item} />
              ))}
            </motion.div>

            <motion.div variants={colVariants} className="flex flex-col">
              {items.slice(3, 6).map((item) => (
                <MenuItem key={item.id + "-b"} item={item} />
              ))}
            </motion.div>

            <motion.div variants={colVariants} className="flex flex-col">
              {items.slice(6, 9).map((item) => (
                <MenuItem key={item.id + "-c"} item={item} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
