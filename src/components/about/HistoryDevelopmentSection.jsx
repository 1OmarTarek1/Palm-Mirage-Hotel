import React from 'react'
import { Button } from "@/components/ui/button"

export default function HistoryDevelopmentSection() {
  return (
    <div className="py-24">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div className="space-y-12">
            <div className="max-w-md space-y-6">
              <p className="text-primary/70 text-[12px] font-extralight tracking-[0.2em] uppercase">HISTORY</p>
              <h2 className="text-3xl md:text-4xl font-semibold leading-tight text-foreground">
                Elevate Your Stay: <br /> Luxury Room Systems <br /> At Our Mountain Hotel
              </h2>
              <p className="text-foreground/50 text-xs leading-relaxed">
                Our high-end rooms are designed to offer personalized comfort and sophistication, ensuring a truly memorable stay.
              </p>
              <Button variant="palmSecondary" className="rounded-full px-8 py-2 text-xs font-semibold h-auto">
                Read More History
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-12">
              <div className="h-[300px] md:h-[350px]">
                <img
                  src="https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=1000"
                  alt="Luxury Bedroom"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="h-[500px] md:h-[650px] md:translate-y-12">
                <img
                  src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=1000"
                  alt="Balcony View"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-12 md:pt-24">
            <div className="grid grid-cols-1 gap-12">
              <div className="h-[600px] md:h-[750px]">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000"
                  alt="Room View"
                  className="w-full h-full object-cover rounded-[2rem] shadow-lg"
                />
              </div>
              <div className="h-[350px] md:h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=1000"
                  alt="Glamping Tent"
                  className="w-full h-90 object-cover rounded-[2rem] shadow-lg"
                />
              </div>
            </div>

            <div className="max-w-md space-y-6 pt-12">
              <p className="text-primary/70 text-[12px] font-extralight tracking-[0.2em] uppercase">DEVELOPMENT</p>
              <h2 className="text-3xl md:text-4xl font-semibold font-playfair leading-tight text-foreground">
                Hospitality That Starts <br /> With Ingenuity
              </h2>
              <p className="text-foreground/50 text-xs leading-relaxed">
                Our portfolio showcases a diverse landscape of exceptional properties, from breathtaking resort layouts and rejuvenating spa retreats to exclusive private clubs, vibrant urban experiences, and opulent...
              </p>
              <Button variant="palmSecondary" className="rounded-full px-8 py-2 text-xs font-semibold h-auto">
                Read More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
