import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 overflow-hidden relative w-full">
      <div className="text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-widest text-muted-foreground font-medium mb-4 block"
        >
          The Sailing Luxor Hotel
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-header text-foreground mb-8 leading-tight"
        >
          Nile-side Sanctuary In Upper Egypt. The <br className="hidden md:block" />
          Deepest Relaxation, The Highest Comfort
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base md:text-lg text-muted-foreground font-main leading-relaxed mb-12 max-w-3xl mx-auto"
        >
          Nestled along the eternal river Nile like a blooming lotus, our 5-star superior hotel in Luxor blends ancient majesty with modern luxury. Since 1965, The Sailing has epitomized a family atmosphere of well-being. We promise our guests first-class service, authentic Egyptian cuisine, and profound relaxation, ensuring an experience that harmonizes cherished Pharaonic heritage with a desire for contemporary innovation.
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:flex-1 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1470&auto=format&fit=crop" 
                alt="Ancient Heritage" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:flex-2 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1470&auto=format&fit=crop" 
                alt="Luxury Luxor Architecture" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 h-auto md:h-80">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="md:flex-2 rounded-3xl overflow-hidden h-64 md:h-full shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1470&auto=format&fit=crop" 
                alt="Nile Felucca Relaxation" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:flex-1 rounded-3xl overflow-hidden h-auto md:h-full shadow-lg bg-secondary/70 p-8 flex flex-col justify-center"
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
