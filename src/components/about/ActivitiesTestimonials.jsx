import React from 'react'
import { motion } from "framer-motion"
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

  return (
    <div className="relative py-24 bg-card overflow-hidden transition-colors duration-300">
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
            WINTER ACTIVITIES
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

        {/* Staggered Image Grid - Edge to Edge */}
        <div className="flex flex-row items-center justify-center gap-1 md:gap-7 overflow-x-auto p-5 no-scrollbar w-full">
          {[
            { src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a", alt: "Laptop View", style: "w-[180px] md:w-[220px] lg:w-[280px] h-[140px] md:h-[160px] lg:h-[200px] self-center" },
            { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb", alt: "Mountain Village", style: "w-[160px] md:w-[200px] lg:w-[260px] h-[260px] md:h-[320px] lg:h-[420px] self-end translate-y-2" },
            { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", alt: "Mountain Scenery", style: "w-[140px] md:w-[180px] lg:w-[240px] h-[200px] md:h-[260px] lg:h-[320px] self-start -translate-y-4" },
            { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb", alt: "Woman Relaxing", style: "w-[180px] md:w-[220px] lg:w-[280px] h-[280px] md:h-[350px] lg:h-[450px] self-center z-10" },
            { src: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9", alt: "Woman on Bed", style: "w-[140px] md:w-[170px] lg:w-[220px] h-[160px] md:h-[200px] lg:h-[260px] self-center translate-y-3" },
            { src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3", alt: "Food and Wine", style: "w-[160px] md:w-[200px] lg:w-[260px] h-[240px] md:h-[300px] lg:h-[400px] self-start -translate-y-2" }
          ].map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * idx }}
              className={`shrink-0 overflow-hidden rounded-3xl group cursor-pointer ${img.style}`}
            >
              <img
                src={`${img.src}?auto=format&fit=crop&q=80&w=800`}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
