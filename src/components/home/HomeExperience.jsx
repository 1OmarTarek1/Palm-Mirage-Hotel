import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Hotel, Utensils, Sprout, Users } from 'lucide-react';

const experiences = [
  {
    id: 'rooms',
    title: 'Rooms & Suites',
    icon: <Hotel size={20} />,
    label: 'STAY IN STYLE',
    heading: 'Extensions Room',
    description: "Experience the natural beauty of our O'ahu resort in any setting private oceanfront bungalow, lavish suite, or ocean view room.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    amenities: [
      'Minibar', 'Contactless', 'View mountain',
      'Mountain view', 'Wifi & Internet', 'Swimming Pool',
      'Airport Pick-up Service', 'Housekeeper Services', 'Laundry Services',
      'Breakfast in Bed'
    ]
  },
  {
    id: 'dining',
    title: 'Restaurant & Bar',
    icon: <Utensils size={20} />,
    label: 'CULINARY JOURNEY',
    heading: 'Summit Dining',
    description: "Indulge in a variety of local and international cuisines prepared by world-class chefs with a focus on fresh, seasonal ingredients.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200",
    amenities: [
      'Al Fresco Dining', 'Wine Pairing', '24/7 Room Service',
      'Organic Produce', 'Craft Cocktails', 'Kids Menu',
      'Themed Nights', 'Private Dining', 'Chef\'s Table',
      'Live Music'
    ]
  },
  {
    id: 'recreation',
    title: 'Recreation',
    icon: <Sprout size={20} />,
    label: 'REFRESH & RELAX',
    heading: 'Peak Wellness',
    description: "Unwind at our full-service spa or find adventure in our mountain recreation programs designed for all skill levels.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
    amenities: [
      'Full-service Spa', 'Guided Hiking', 'Ski-in/Ski-out',
      'Fitness Center', 'Yoga Studio', 'Heated Pool',
      'Biking Trails', 'Sauna & Steam', 'Massage Therapy',
      'Adventure Concierge'
    ]
  },
  {
    id: 'events',
    title: 'Meeting & Events',
    icon: <Users size={20} />,
    label: 'GATHER IN STYLE',
    heading: 'Horizon Ballroom',
    description: "Host unforgettable meetings, weddings, and social events in our versatile spaces with breathtaking mountain views.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    amenities: [
      'Audio/Visual Gear', 'High-speed Wifi', 'Catering Services',
      'Dedicated Planner', 'Outdoor Venues', 'Natural Light',
      'Breakout Rooms', 'Event Logistics', 'Custom Decor',
      'Business Center'
    ]
  }
];

export default function HomeExperience() {
  const [activeTab, setActiveTab] = useState('rooms');
  const currentExp = experiences.find(e => e.id === activeTab) || experiences[0];

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-screen lg:h-screen overflow-hidden transition-colors duration-300">
      {/* Background Image Layer */}
      <AnimatePresence>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={currentExp.image}
            alt={currentExp.title}
            className="w-full h-full object-cover scale-105"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay for Legibility */}
      <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/50 to-black/20 md:via-primary/40 md:to-black/10 transition-colors duration-700" />

      {/* Content Container */}
      <div className="relative h-full min-h-screen w-full flex flex-col justify-end pt-32 pb-12 md:pb-20 max-w-[1400px] mx-auto px-4 md:px-10">
        
        {/* Tab Navigation - Floating Overlay */}
        <div className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-start gap-4 mb-10 md:mb-16 overflow-x-auto py-4 scrollbar-hide px-4 -mx-4">
          {experiences.map((exp) => (
            <button
              key={exp.id}
              onClick={() => setActiveTab(exp.id)}
              className={`flex flex-row md:flex-col items-center gap-3 md:gap-2 px-6 py-4 rounded-xl md:rounded-2xl transition-all duration-300 min-w-max md:min-w-[180px] shrink-0
                ${activeTab === exp.id 
                  ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white scale-105 shadow-xl' 
                  : 'bg-white/5 md:bg-transparent text-white/50 hover:text-white hover:bg-white/10'
                }`}
            >
              <span className="shrink-0 scale-75 md:scale-100">{exp.icon}</span>
              <span className="text-[10px] md:text-sm font-header font-bold uppercase tracking-wider">{exp.title}</span>
            </button>
          ))}
        </div>

        {/* Detailed Experience Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end">
          
          {/* Left: Text Content */}
          <motion.div 
            key={`${activeTab}-text`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6 text-white"
          >
            <div className="space-y-2">
              <p className="text-white/80 text-[10px] md:text-[12px] font-bold tracking-[0.2em] uppercase">
                {currentExp.label}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-header font-bold leading-tight drop-shadow-lg">
                {currentExp.heading}
              </h2>
            </div>
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              {currentExp.description}
            </p>
            <div className="pt-2 md:pt-4 flex flex-wrap gap-4">
              <Button className="bg-white text-[#687E69] hover:bg-white/90 rounded-full px-8 md:px-10 py-5 md:py-6 text-xs md:text-sm font-bold h-auto shadow-xl transition-transform hover:scale-105">
                Visit Now
              </Button>
            </div>
          </motion.div>

          {/* Right: Amenity Grid (Glassmorphism) */}
          <motion.div
            key={`${activeTab}-grid`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl mb-4 md:mb-0"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 md:gap-y-5 gap-x-4">
              {currentExp.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check size={14} className="text-white shrink-0" />
                  <span className="text-[10px] md:text-[12px] font-bold text-white leading-tight">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
