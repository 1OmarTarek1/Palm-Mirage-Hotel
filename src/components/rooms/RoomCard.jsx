import { Button } from "@/components/ui/button";
import { BedDouble, Maximize2, Users } from "lucide-react";

const roomData = {
  type: "Double Room",
  name: "Summit View King Room",
  price: 100,
  image:
    "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/04/cozy-cabin-with-view-mountains-1.png",
  beds: 1,
  size: 50,
  guests: 6,
  href: "https://sailing.thimpress.com/demo-mountain-hotel/room/summit-view-king-room/",
  partners: [
    {
      name: "agoda.com",
      logo: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/04/agoda.png",
      href: "https://www.agoda.com/vi-vn/northern-hotel_4/hotel/ho-chi-minh-city-vn.html",
    },
    {
      name: "traveloka.com",
      logo: "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/04/traveloka1.png",
      href: "https://www.traveloka.com/vi-vn/hotel/detail?spec=30-03-2026.31-03-2026.1.1.HOTEL.1000000323930.KinHotelThiSach.2",
    },
  ],
};

export default function RoomCard({ room = roomData }) {
  return (
    <div className="bg-card rounded-3xl overflow-hidden shadow-sm flex flex-col h-full select-none group">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-4/3 rounded-t-3xl">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover duration-700  pointer-events-none"
          draggable={false}
        />
        {/* Type badge */}
        <span className="absolute top-0 left-0 bg-primary backdrop-blur-sm text-white text-sm font-bold tracking-widest uppercase px-6 py-2.5 rounded-br-xl ">
          {room.type}
        </span>

        {/* Price Tag Overlay - positioned at the bottom-left of the image */}
        <div className="absolute bottom-0 left-0 bg-card px-5 py-3 rounded-tr-3xl group-hover:border-l group-hover:border-primary">
          <p className="text-foreground font-semibold text-base leading-none">
            <span className="text-xl font-bold">${room.price}.00</span>
            <span className="text-sm font-normal text-muted-foreground">
              /night
            </span>
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-6 box-border group-hover:border group-hover:border-primary group-hover:border-t-0 group-hover:rounded-b-3xl">
        {/* Name */}
        <h3 className="font-header text-2xl text-foreground leading-tight mt-2 text-left">
          {room.name}
        </h3>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <BedDouble size={16} className="text-primary" />
            <span>
              {room.beds} {room.beds > 1 ? "beds" : "bed"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Maximize2 size={16} className="text-primary" />
            <span>{room.size}sqm m²</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Users size={16} className="text-primary" />
            <span>
              {room.guests} {room.guests > 1 ? "adults" : "adult"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="my-2 w-1/3 px-8 border-2 text-base py-6 font-bold"
          >
            Book Now
          </Button>
          {room.partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              title={partner.name}
              className="opacity-100 hover:opacity-60 transition-opacity"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
