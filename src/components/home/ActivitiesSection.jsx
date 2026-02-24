import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const activities = [
  {
    type: "winter",
    label: "SPORTS & ADVENTURES",
    title: "Winter Activities",
    description: "Snowy Andermatt offers a wide range of winter sports. The modern ski resort is known for its sunny slopes, gentle descents, long, steep runs and deep powder descents. You'll also find trails for winter hiking, snowshoeing and cross-country skiing.",
    stats: [
      { value: "120km", label: "SKI PISTES" },
      { value: "16", label: "LIFTS" },
      { value: "5km", label: "LONGEST DES" }
    ],
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=1470&auto=format&fit=crop",
    link: "/activities/winter"
  },
  {
    type: "summer",
    label: "ENJOY THE SUNSHINE",
    title: "Summer Activities",
    description: "790 km of hiking trails, 4 cableways, one golf course, several Alpine passes: there are many ways to enjoy your holiday in the Andermatt region – whether hiking, swimming in clear alpine lakes, or go cycling against the backdrop of the spectacular.",
    stats: [
      { value: "790km", label: "HIKING TRAILS" },
      { value: "21", label: "SAC HUTS" },
      { value: "4km", label: "CABLEWAYS" }
    ],
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1470&auto=format&fit=crop",
    link: "/activities/summer"
  }
];

export default function ActivitiesSection() {
  return (
    <section className="py-20 px-6 bg-background space-y-20 lg:space-y-32">
      <div className="max-w-7xl mx-auto">
        {activities.map((activity, index) => (
          <div 
            key={activity.type} 
            className={`flex flex-col-reverse lg:flex-row gap-12 lg:items-center ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : ""
            } ${index !== 0 ? "mt-20 lg:mt-32" : ""}`}
          >
            {/* Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
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
