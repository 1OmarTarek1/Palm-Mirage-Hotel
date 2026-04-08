import React from 'react'
import { Button } from "@/components/ui/button"

export default function AboutHero() {
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end mb-8">
        <div className="md:col-span-2 space-y-4 mb-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold font-playfair leading-tight text-foreground">
            Discover Serenity At <br /> Mountain Hotel: Your <br /> Peak Retreat Awaits!
          </h1>
          <p className="text-gray-400 text-[10px] md:text-xs max-w-[250px] font-medium leading-relaxed">
            Discover Serenity at Mountain Hotel: Your Peak Retreat Awaits!
          </p>
          <div className="pt-2">
            <Button className="bg-[#82917d] hover:bg-[#6c7b68] text-white rounded-full px-8 py-2 text-xs font-semibold h-9 shadow-md">
              Contact Us
            </Button>
          </div>
        </div>

        <div className="md:col-span-1 h-[280px]">
          <img
            src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=600"
            alt="Mountain Sky"
            className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>

        <div className="md:col-span-1 h-[280px]">
          <img
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=1000"
            alt="Pine Trees"
            className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        <div className="md:col-span-1 h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
            alt="Mountain Hotel"
            className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>

        <div className="md:col-span-1 h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000"
            alt="Mountain Bench"
            className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>

        <div className="md:col-span-1 h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=1000"
            alt="Mountain Path"
            className="w-full h-full object-cover rounded-[1.5rem] shadow-lg"
          />
        </div>

        <div className="md:col-span-1 h-[140px]">
          <img
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000"
            alt="Forest Tree"
            className="w-full h-full object-cover rounded-[1.2rem] shadow-md"
          />
        </div>

        <div className="md:col-span-1 flex flex-col justify-end items-center h-[320px] pb-4 opacity-15">
          <div className="text-center">
            <svg
              className="w-24 h-24 grayscale mx-auto mb-2"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 90L50 10L90 90H10Z" stroke="currentColor" strokeWidth="2" />
              <path d="M30 90L50 40L70 90" stroke="currentColor" strokeWidth="2" />
            </svg>
            <p className="text-[10px] font-bold tracking-widest">PEAK HOTEL</p>
            <div className="flex justify-center space-x-1 mt-1">
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
              <div className="w-1 h-1 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
