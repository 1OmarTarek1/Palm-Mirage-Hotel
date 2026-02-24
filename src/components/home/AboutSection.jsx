import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-4 block"
        >
          Sailing Moutain holtel
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-header text-foreground mb-8 leading-tight"
        >
          Alpine Hideaway In The Engadin. The <br className="hidden md:block" />
          Deepest Relaxation, The Highest Comfort
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg text-muted-foreground font-main leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Nestled in the Swiss mountains like a hidden edelweiss, our 5-star superior hotel in Samnaun blends tradition with modern luxury, following its renovation in 2022. Since 1965, the Sailing has epitomized a family atmosphere of well-being. We promise our guests first-class service, exquisite cuisine, and profound relaxation, ensuring an authentic experience that harmonizes cherished traditions with a desire for innovation.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button 
            asChild
            className="w-full sm:w-auto"
          >
            <Link to="/about">More About Us</Link>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link to="/rooms">Explore Our Accommodations</Link>
          </Button>
        </motion.div>

        <div className="flex flex-col gap-6 mt-20">
          
          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-85">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:flex-1 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1470&auto=format&fit=crop" 
                alt="Hotel Path" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:flex-2 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1470&auto=format&fit=crop" 
                alt="Outdoor Dining" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-80">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:flex-2 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop" 
                alt="Relaxing Hammock" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="md:flex-1 rounded-3xl overflow-hidden h-auto md:h-full shadow-lg bg-secondary p-8 flex flex-col justify-center"
            >
              <ul className="space-y-6">
                {[
                  "Experience Technology",
                  "Personalized Experiences",
                  "Health & wellness-focused services",
                  "Restaurant"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex justify-between align-center group cursor-pointer border-b border-[#fefefec3]/20 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-[#fefefec3] text-sm sm:text-base md:text-xl font-header font-medium text-start">
                      {item}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#fefefe23] flex items-center justify-center group-hover:bg-[#fefefe23]/40 transition-colors">
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-[#fefefec3]"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
