import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Waves, Utensils, Sprout, Building2 } from 'lucide-react';

const experiences = [
  {
    id: 'rooms',
    title: 'Rooms & Suites',
    icon: <Building2 className="w-5 h-5 lg:w-6 lg:h-6" />,
    label: 'STAY IN STYLE',
    heading: 'Royal Accommodations',
    description: "Experience the natural beauty of our Luxor riverfront in any setting — private Nile-facing bungalow, lavish suite, or heritage view room.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    amenities: ['Nile view', 'Contactless', 'Wifi & Internet', 'Pick-up Service']
  },
  {
    id: 'services/restaurant',
    title: 'Restaurant & Bar',
    icon: <Utensils className="w-5 h-5 lg:w-6 lg:h-6" />,
    label: 'CULINARY JOURNEY',
    heading: 'Nile-side Dining',
    description: "Indulge in a variety of local Egyptian and international cuisines prepared by world-class chefs with a focus on fresh, seasonal ingredients.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
    amenities: ['Al Fresco Dining', 'Wine Pairing', '24/7 Room Service', 'Organic Produce']
  },
  {
    id: 'services/wellness',
    title: 'Recreation',
    icon: <Sprout className="w-5 h-5 lg:w-6 lg:h-6" />,
    label: 'REFRESH & RELAX',
    heading: 'Ancient Wellness',
    description: "Unwind at our Egyptian-inspired spa or find adventure in our cultural recreation programs designed for all curious explorers.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    amenities: ['Full-service Spa', 'Heritage Tours', 'Riverfront', 'Heated Pool']
  },
  {
    id: 'services/Meetings',
    title: 'Meeting & Events',
    icon: <Waves className="w-5 h-5 lg:w-6 lg:h-6" />,
    label: 'GATHER IN STYLE',
    heading: 'Grand Ballroom',
    description: "Host unforgettable meetings, weddings, and social events in our versatile spaces with breathtaking Nile views.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    amenities: ['Audio/Visual Gear', 'High-speed Wifi', 'Catering Services', 'Natural Light']
  }
];

export default function HomeExperience() {
  const [activeTab, setActiveTab] = useState('rooms'); // First panel open by default
  const [isHoveringSection, setIsHoveringSection] = useState(false);
  const sectionRef = useRef(null);

  return (
    <section 
      id="experience" 
      className="relative flex items-center justify-center overflow-hidden py-10 h-svh mb-30"
      ref={sectionRef}
    >
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1600px] flex flex-col gap-2 h-full">
        
        {/* Horizontal Title Box */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full flex-none overflow-hidden rounded-2xl lg:rounded-3xl relative p-6 flex items-center"
        >
          {/* Atmospheric background for the title box to match the accordion panels */}
          <img
            src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&q=80&w=2000"
            alt="Hotel Experience"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.3)' }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/40 via-primary/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-primary text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase flex items-center gap-4">
                <span className="w-8 h-px bg-primary"></span>
                 Hotel Features
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-header font-bold text-white leading-[1.1]">
                 The <span className="text-primary italic">Experience</span>
              </h2>
            </div>
             
            <div className="hidden md:block max-w-sm text-left">
              <p className="text-white/50 text-xs lg:text-sm font-sans leading-relaxed">
                Discover a world of unparalleled luxury where every detail is crafted for your utmost comfort along the timeless Nile river.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Accordion Container */}
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-2">
        {experiences.map((exp, index) => {
          const isActive = activeTab === exp.id;
          const number = (index + 1).toString().padStart(2, '0');

          return (
            <motion.div
              key={exp.id}
              onClick={() => setActiveTab(exp.id)} // Set active tab without toggle-off
              layout
              initial={{ borderRadius: '1.5rem' }}
              animate={{ 
                flex: isActive ? (typeof window !== 'undefined' && window.innerWidth < 1024 ? '5 5 0%' : '6 6 0%') : '1 1 0%',
                opacity: 1
              }}
              transition={{ type: 'spring', bounce: 0, duration: 0.8 }}
              className={`relative overflow-hidden cursor-pointer group rounded-2xl lg:rounded-3xl ${isActive ? '' : ''}`}
            >
              {/* Background Image */}
              <motion.img
                src={exp.image}
                alt={exp.title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  filter: isActive ? 'brightness(0.6) blur(2px)' : 'brightness(0.2) blur(0px)', // Added slight blur and reduced brightness for legibility
                }}
                whileHover={
                  !isActive 
                    ? { scale: 1.05, filter: 'brightness(0.5) blur(0px)' } 
                    : {}
                }
                transition={{ duration: 0.8 }}
              />

              {/* Gradient overlays designed to work regardless of aspect ratio - only visible when active */}
              <motion.div 
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-primary/50 via-primary/20 to-transparent pointer-events-none" 
              />

              {/* Inactive State: Vertical Title & Number */}
              <motion.div
                initial={false}
                animate={{ opacity: isActive ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 p-4 lg:py-10 flex lg:flex-col items-center justify-between pointer-events-none ${isActive ? 'hidden' : ''}`}
              >
                 <span className="text-white/40 font-header font-bold text-lg lg:text-3xl">
                   {number}
                 </span>

                 <div className="flex lg:flex-col items-center gap-4 lg:gap-6">
                   <div className="text-white/50 group-hover:text-primary transition-colors">
                     {exp.icon}
                   </div>
                   <h3 className="text-white/70 text-sm lg:text-lg font-header font-bold tracking-[0.2em] uppercase lg:[writing-mode:vertical-rl] lg:rotate-180 drop-shadow-md whitespace-nowrap">
                     {exp.title}
                   </h3>
                 </div>
              </motion.div>

              {/* Active State Details */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }} /* Disappear instantly on exit */
                    transition={{ duration: 0.5, delay: 0.8 }} /* Delayed appearance */
                    className="absolute inset-0 flex flex-col justify-center items-start p-5 md:p-8 lg:p-12 z-10"
                  >
                    <div className="max-w-xl space-y-3 md:space-y-4">
                      
                      {/* Label & Heading */}
                      <div className="space-y-1 md:space-y-2">
                        <p className="text-primary text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
                          <span className="w-6 md:w-8 h-px bg-primary"></span>
                          {exp.label}
                        </p>
                        {/* Reduced Font Size: text-4xl from 6xl */}
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-header font-bold text-white leading-tight drop-shadow-lg">
                          {exp.heading}
                        </h2>
                      </div>

                      {/* Description - Reduced Font Size */}
                      <p className="text-white/80 text-xs md:text-sm leading-relaxed font-sans max-w-lg">
                        {exp.description}
                      </p>

                      {/* Amenities grid */}
                      <div className="pt-2">
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:gap-y-3">
                          {exp.amenities.map((amenity, idx) => (
                            <li key={idx} className="flex items-center gap-2 md:gap-3 text-white">
                              <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-primary shrink-0 drop-shadow-md"></span>
                              <span className="text-[10px] md:text-xs font-medium tracking-wide drop-shadow-md">{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="pt-2 md:pt-3">
                        <Button asChild variant="palmWhiteSecondary" className="text-sm">
                          <Link to={`/${exp.id}`}>
                            Explore {exp.title.split(' ')[0]}
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}

