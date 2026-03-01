import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const activities = [
  {
    type: "nile",
    label: "BEYOND THE BANKS",
    title: "Nile River Adventures",
    description: "Sail the eternal waters of the Nile on a traditional Felucca or embark on a luxury sunset cruise. Experience the lifeblood of Egypt from a unique perspective, enjoying the refreshing breeze and the historic landscape of the West Bank.",
    stats: [
      { value: "25+", label: "VESSELS" },
      { value: "10km", label: "RIVERFRONT" },
      { value: "DAILY", label: "SUNSET CRUISES" }
    ],
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1470&auto=format&fit=crop",
    link: "/activities/nile"
  },
  {
    type: "heritage",
    label: "WALK THROUGH HISTORY",
    title: "Ancient Heritage Tours",
    description: "Explore the world's greatest open-air museum. From the massive pillars of Karnak Temple to the hidden secrets of the Valley of the Kings, our expert-led guided tours offer deep insights into the 3,000-year-old Pharaonic civilization.",
    stats: [
      { value: "15+", label: "TEMPLES" },
      { value: "60+", label: "ROYAL TOMBS" },
      { value: "UNLIMITED", label: "HISTORY" }
    ],
    image: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1470&auto=format&fit=crop",
    link: "/activities/heritage"
  }
];

export default function ActivitiesSection() {
  return (
    <section id="activities" className="py-20 space-y-20 lg:space-y-32 overflow-hidden w-full relative">
      <div className="px-4 md:px-0">
        {activities.map((activity, index) => (
          <div 
            key={activity.type} 
            className={`flex flex-col-reverse lg:flex-row gap-12 lg:items-center ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            } ${index !== 0 ? "mt-20 lg:mt-32" : ""}`}
          >
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:basis-[35%] space-y-8"
            >
              <div className="space-y-2">
                <span className="text-secondary text-xs font-bold uppercase">
                  {activity.label}
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-4xl font-header font-bold text-foreground">
                  {activity.title}
                </h2>
              </div>
              
              <p className="text-muted-foreground text-sm md:text-sm leading-relaxed max-w-xl mb-10">
                {activity.description}
              </p>

              <div className="grid grid-cols-3 gap-8 pt-0">
                {activity.stats.map((stat, sIndex) => (
                  <div key={sIndex} className="space-y-2">
                    <div className="text-xl md:text-2xl font-header font-bold text-secondary/80">
                      {stat.value}
                    </div>
                    <div className="text-[9px] md:text-xs font-medium tracking-tighter sm:tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <motion.div>
                <Button 
                   asChild
                   className="rounded-full px-6 py-5 bg-secondary/70 hover:bg-secondary text-white text-base transition-colors shadow-lg"
                >
                  <Link to={activity.link}>Discover More</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:basis-[65%] w-full"
            >
              <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full aspect-[1.5/1] lg:aspect-16/10 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
