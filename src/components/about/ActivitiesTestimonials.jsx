import React, { useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function ActivitiesTestimonials() {
  const testimonials = [
    {
      quote: " Lovely hotel, the staff are amazing! We had an amazing stay at Rixos Saadiyat Island! We loved every minute and didn't want to leave! We will definitely be back! ",
      author: "Ann Baptista",
      role: "Guest at Sellingmountain"
    },
    {
      quote: " The serenity here is unmatched. A perfect getaway for anyone looking to reconnect with nature and enjoy world-class hospitality. ",
      author: "John Doe",
      role: "Guest at Peak Retreat"
    },
    {
      quote: " The serenity here is unmatched. A perfect getaway for anyone looking to reconnect with nature and enjoy world-class hospitality. ",
      author: "John Doe",
      role: "Guest at Peak Retreat"
    }
  ]

  const luxuryImages = [
    { src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a", alt: "Pharaonic Artifact", style: "w-[180px] md:w-[220px] lg:w-[280px] h-[140px] md:h-[160px] lg:h-[200px] self-center" },
    { src: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a", alt: "Nile River View", style: "w-[160px] md:w-[200px] lg:w-[260px] h-[260px] md:h-[320px] lg:h-[420px] self-end translate-y-2" },
    { src: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368", alt: "Ancient Temple", style: "w-[140px] md:w-[180px] lg:w-[240px] h-[200px] md:h-[260px] lg:h-[320px] self-start -translate-y-4" },
    { src: "https://images.unsplash.com/photo-1590073844006-33379778ae09", alt: "Luxury Entrance", style: "w-[180px] md:w-[220px] lg:w-[280px] h-[280px] md:h-[350px] lg:h-[450px] self-center z-10" },
    { src: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee", alt: "Nile Sunset", style: "w-[140px] md:w-[170px] lg:w-[220px] h-[160px] md:h-[200px] lg:h-[260px] self-center translate-y-3" },
    { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", alt: "Egyptian Dining", style: "w-[160px] md:w-[200px] lg:w-[260px] h-[240px] md:h-[300px] lg:h-[400px] self-start -translate-y-2" }
  ];
  const duplicatedImages = [...luxuryImages, ...luxuryImages, ...luxuryImages, ...luxuryImages];

  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);

  useAnimationFrame((t, delta) => {
    if (!containerRef.current) return;
    
    // Normal scroll velocity, slows down when hovered
    const velocity = isHovered ? -0.15 : -1.2; 
    let moveBy = velocity * (delta / 16); // Normalize according to ~60fps
    
    // Total width of all duplicated arrays
    // Since we duplicated the array 4 times, a single set takes up 1/4 of total scroll width
    const singleSetWidth = containerRef.current.scrollWidth / 4;
    
    let newX = x.get() + moveBy;
    
    // Wrap around back to the right once a full set has scrolled off the left side
    if (newX <= -singleSetWidth) {
      newX += singleSetWidth;
    }
    
    x.set(newX);
  });

  return (
    <div id="testimonials" className="relative bg-card w-screen left-1/2 -translate-x-1/2  py-24 overflow-hidden transition-colors duration-300 my-20">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-[10px] font-bold tracking-[0.2em] mb-12 uppercase px-4">
            LUXOR EXPERIENCES
          </p>

          {/* Testimonials Carousel */}
          <div className="relative max-w-5xl mx-auto px-12 mb-24">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="space-y-6 px-4">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-header font-light font-playfair italic text-foreground/80 leading-relaxed">
                        "{testimonial.quote}"
                      </h2>
                      <div className="space-y-1 pt-4">
                        <p className="text-sm font-bold text-foreground">{testimonial.author}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{testimonial.role}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-[-40px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-[#687E69] text-[#687E69] hover:bg-[#687E69] hover:text-white transition-all bg-transparent shadow-none" />
              <CarouselNext className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center border border-[#687E69] text-[#687E69] hover:bg-[#687E69] hover:text-white transition-all bg-transparent shadow-none" />
            </Carousel>
          </div>
        </motion.div>

        {/* Infinite Scroll Image Marquee */}
        <div 
          className="relative w-full overflow-hidden mt-12 py-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Edge gradients for smooth fade in/out - increased width */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-linear-to-r from-card via-card/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-linear-to-l from-card via-card/80 to-transparent z-20 pointer-events-none" />

          <motion.div 
            ref={containerRef}
            style={{ x }}
            className="flex flex-row items-center gap-4 md:gap-7 w-max px-4"
          >
            {duplicatedImages.map((img, idx) => (
              <div
                key={idx}
                className={`shrink-0 overflow-hidden rounded-3xl group cursor-pointer ${img.style}`}
              >
                <img
                  src={`${img.src}?auto=format&fit=crop&q=80&w=800`}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
