import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
  import Sauna from '../../assets/wellness/LuxurySauna.jpg'
  import Fitness from '../../assets/wellness/Fitness.jpg' 
  import Treatment from '../../assets/wellness/spaTreatment.jpg'
const SLIDES = [
  {
    image: Sauna, 
    title: 'Luxury Sauna',
  },
  {
    image: Fitness,
    title: 'Fitness Center',
  },
  {
    
    image: Treatment,
    title: 'Spa Treatment',
  },
];
function WellnessCarousel() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative overflow-hidden rounded-[16px] select-none">
      {/* Slides track */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide, i) => (
          <div key={i} className="min-w-full h-[420px] relative shrink-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover brightness-[0.82]"
            />
            {/* Gradient overlay + title */}
            <div className="absolute bottom-0 left-0 w-full p-[70px_28px_24px] bg-linear-to-t from-black/60 to-transparent">
              <h3 className="font-header text-[22px] font-bold text-white m-0">
                {slide.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow — Prev */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute top-1/2 left-4 -translate-y-1/2 w-[46px] h-[46px] rounded-full border border-white/30 bg-white/20 backdrop-blur-[6px] flex items-center justify-center cursor-pointer text-white shadow-[0_2px_14px_rgba(0,0,0,0.18)] z-3 hover:bg-white/40 transition-colors duration-200"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Arrow — Next */}
      <button
        onClick={next}
        aria-label="Next"
        className="absolute top-1/2 right-4 -translate-y-1/2 w-[46px] h-[46px] rounded-full border border-white/30 bg-white/20 backdrop-blur-[6px] flex items-center justify-center cursor-pointer text-white shadow-[0_2px_14px_rgba(0,0,0,0.18)] z-3 hover:bg-white/40 transition-colors duration-200"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-[8px] z-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-[8px] h-[8px] rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function WellnessJourneySection() {
  return (
    <section className="mb-20">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[60px] mb-[60px] items-start">
          <div>
            <div className="text-[13px] font-semibold tracking-[0.2em] uppercase text-foreground/50 mb-4">
              ENJOY YOUR WELLNESS JOURNEY
            </div>
            <h2 className="font-header text-[clamp(36px,4vw,52px)] leading-[1.1] font-bold text-foreground">
              Enjoy Your Wellness
              <br />
              Journey
            </h2>
          </div>
          <div className="text-[16.5px] leading-[1.85] text-muted-foreground pt-[2px]">
            Step in and enjoy life with all your senses. In a fast paced world,
            the luxurious 2000m2 Kulm Spa St. Moritz presents itself as a haven
            and ideal hideaway for those seeking ultimate relaxation, comfort
            and harmony. Experience the aromas of fine pine wood, the unique
            views over Lake St. Moritz and let your mind wander.
          </div>
        </div>

        <WellnessCarousel />
      </div>
    </section>
  );
}
