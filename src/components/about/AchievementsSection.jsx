import React from 'react'

export default function AchievementsSection() {
  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 bg-card py-20 mt-20">
      <div className="text-center">
        <p className="text-foreground/40 text-[10px] font-bold tracking-[0.2em] mb-4 uppercase">OUR ACHIEVEMENTS</p>
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-16">
          Our Achievements At A Glance
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <div className="space-y-2">
            <h3 className="text-5xl md:text-6xl font-bold text-primary font-playfair">75</h3>
            <p className="text-[9px] md:text-[10px] font-light text-foreground/40 uppercase tracking-tight leading-tight">
              YEAR OF HOSPITALITY<br />EXCELLENCE
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-5xl md:text-6xl font-bold text-primary font-playfair">120k</h3>
            <p className="text-[9px] md:text-[10px] font-light text-foreground/40 uppercase tracking-tight leading-tight">
              GUESTS WELCOMED<br />WORLDWIDE
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-5xl md:text-6xl font-bold text-primary font-playfair">9.5k</h3>
            <p className="text-[9px] md:text-[10px] font-light text-foreground/40 uppercase tracking-tight leading-tight">
              UNIQUE LOCAL EXPERIENCES<br />HOSTED
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-5xl md:text-6xl font-bold text-primary font-playfair">45</h3>
            <p className="text-[9px] md:text-[10px] font-light text-foreground/40 uppercase tracking-tight leading-tight">
              INDUSTRY AWARDS &<br />RECOGNITIONS
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
