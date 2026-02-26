import React from 'react'

export default function PartnersSection() {
  const partners = [
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-01.png",
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-02.png",
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-03.png",
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-04.png",
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-05.png",
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/03/partner-06.png",
  ]

  return (
    <div className="py-24 bg-background">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Trust By 12,000+ World-Class Brands And Organization Of All Sizes
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 lg:gap-20 opacity-60">
          {partners.map((partner, index) => (
            <div key={index} className="w-24 md:w-28 lg:w-32 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img src={partner} alt="Brand Logo" className="w-full h-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
