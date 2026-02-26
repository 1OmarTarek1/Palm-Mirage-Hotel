import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Bed,
  Maximize2,
  Users,
  Star,
  Wifi,
  Waves,
  Ban,
  Dumbbell,
  Car,
  CheckCircle2,
  Coffee,
  Utensils,
  Umbrella,
  Wind,
  Lock,
  GlassWater,
  Tv,
  Phone,
  Monitor,
  Refrigerator,
  Usb,
  Gift,
  Bath,
  Shirt,
  Footprints,
  Droplets,
  Table,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  MOCK_ROOM_DATA,
  ROOM_AMENITIES,
  ROOM_FEATURES,
  ROOM_BATHROOM,
  BOOKING_POLICIES,
  ROOM_FAQS,
  SIMILAR_ROOMS,
  TRUSTED_PARTNERS,
  CALENDAR_DAYS,
} from "@/utils/constants";

// Map icon name strings → actual Lucide components
const ICON_MAP = {
  Wifi, Waves, Ban, Dumbbell, Car, CheckCircle2, Coffee, Utensils,
  Umbrella, Table, Wind, Bed, Lock, GlassWater, Tv, Phone,
  Monitor, Refrigerator, Usb, Gift, Bath, Shirt, Footprints, Droplets,
};

function RoomIcon({ name, className = "w-5 h-5 text-[#018058]" }) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}

function PolicyContent({ policy }) {
  if (policy.type === "text") {
    return (
      <div className="text-[14px] leading-relaxed whitespace-pre-line text-muted-foreground">
        {policy.content}
      </div>
    );
  }

  if (policy.type === "list") {
    return (
      <ul className="list-disc ml-4 space-y-1 text-[14px] leading-relaxed text-muted-foreground">
        {policy.items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  if (policy.type === "house-rules") {
    return (
      <div className="space-y-4 text-[14px] leading-relaxed text-muted-foreground">
        <ul className="list-disc ml-4 space-y-1">
          {policy.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        {policy.note && <p className="italic">{policy.note}</p>}
      </div>
    );
  }

  return null;
}

export default function RoomDetails() {
  const { id } = useParams();
  const room = MOCK_ROOM_DATA;

  // Booking State
  const [checkIn, setCheckIn] = useState("2026/02/23");
  const [checkOut, setCheckOut] = useState("2026/02/24");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [roomsCount, setRoomsCount] = useState("1");
  const [wifiSg, setWifiSg] = useState(true);
  const [wifiSgCount, setWifiSgCount] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleBooking = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Room booked successfully! We'll send a confirmation email shortly.", {
        position: "top-right",
        autoClose: 4000,
      });
    } catch (error) {
      toast.error("Booking failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 pt-28 pb-8 max-w-6xl font-main">

        {/* Breadcrumb */}
        <div className="flex justify-center mb-8 relative z-10">
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm flex items-center justify-center">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-border px-1">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/rooms" className="text-muted-foreground hover:text-primary transition-colors font-medium">Room</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-border px-1">/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground font-medium">{room.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Carousel */}
        <div className="relative group mb-12">
          <Carousel className="w-full">
            <CarouselContent>
              {room.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-xl">
                    <img src={image} alt={`${room.name} - image ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-6 bg-white/90 hover:bg-white hover:text-black text-gray-800 border-none shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CarouselNext className="right-6 bg-white/90 hover:bg-white hover:text-black text-gray-800 border-none shadow-md h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Room Summary Card */}
            <div className="absolute bottom-0 left-0 w-full sm:w-auto sm:min-w-[550px]">
              <div className="bg-card text-card-foreground p-6 sm:p-10 rounded-tr-xl shadow-lg relative z-20 transition-colors duration-300">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8 font-header leading-tight text-foreground">
                  {room.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-[13px] sm:text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                    <span>{room.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-muted-foreground/60" />
                    <span>{room.beds} {room.bedType}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize2 className="w-5 h-5 text-muted-foreground/60" />
                    <span>{room.size}sqm m²</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground/60" />
                    <span>{room.adults} Adults</span>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">

            {/* Description */}
            <section>
              <p className="leading-relaxed text-[15px] text-muted-foreground">{room.description}</p>
            </section>

            {/* Services & Amenities */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-foreground">Services &amp; Amenities:</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {ROOM_AMENITIES.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[14px] text-muted-foreground">
                    <RoomIcon name={item.iconName} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Room Features */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-foreground">Room Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {ROOM_FEATURES.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[14px] text-muted-foreground">
                    <RoomIcon name={item.iconName} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bathroom */}
            <section>
              <h2 className="text-xl font-bold mb-6 text-foreground">Bathroom</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {ROOM_BATHROOM.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[14px] text-muted-foreground">
                    <RoomIcon name={item.iconName} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Booking Policies */}
            <section>
              <h2 className="text-xl font-bold mb-8 text-foreground">Booking Policies</h2>
              <div className="space-y-0 relative">
                <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-border" />
                {BOOKING_POLICIES.map((policy, idx) => (
                  <div key={idx} className="relative pl-12 pb-10 last:pb-0">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-sm text-muted-foreground font-medium z-10 transition-colors hover:border-foreground hover:text-foreground">
                      {policy.icon}
                    </div>
                    <h3 className="font-bold text-[16px] mb-3 text-foreground">{policy.title}</h3>
                    <PolicyContent policy={policy} />
                  </div>
                ))}
              </div>
            </section>

            {/* Rates & Availability */}
            <section className="mt-16">
              <h2 className="text-xl font-bold mb-8 text-foreground">Rates &amp; Availability</h2>
              <div className="bg-card border border-border rounded-2xl p-8 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex-1 text-center font-bold text-foreground text-lg uppercase tracking-tight">February 2026</div>
                  <div className="flex-1 text-center font-bold text-foreground text-lg uppercase tracking-tight relative">
                    March 2026
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <div className="grid grid-cols-7 mb-4 text-center">
                      {CALENDAR_DAYS.map(day => (
                        <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                      {[...Array(6)].map((_, i) => <div key={`p-${i}`} className="h-10" />)}
                      {[...Array(28)].map((_, i) => {
                        const day = i + 1;
                        const isSelected = day === 23 || day === 24;
                        const isPast = day < 23;
                        return (
                          <div key={day} className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                            ${isSelected
                              ? "bg-[#8c9e8d] text-white shadow-sm"
                              : isPast
                                ? "text-muted-foreground/30 pointer-events-none"
                                : "text-muted-foreground hover:bg-muted cursor-pointer"
                            }`}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="grid grid-cols-7 mb-4 text-center">
                      {CALENDAR_DAYS.map(day => (
                        <span key={day} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                      {[...Array(6)].map((_, i) => <div key={`p2-${i}`} className="h-10" />)}
                      {[...Array(31)].map((_, i) => (
                        <div key={i + 1} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted cursor-pointer rounded-lg">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <button className="h-12 px-8 rounded-full border border-border text-foreground font-bold text-sm hover:bg-muted transition-colors uppercase tracking-wide">
                  Cancel
                </button>
                <button className="h-12 px-10 rounded-full bg-[#8c9e8d] text-white font-bold text-sm hover:bg-[#7a8c7b] transition-colors uppercase tracking-wide shadow-sm">
                  Apply
                </button>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-0">
                {ROOM_FAQS.map((faq, idx) => (
                  <div key={idx} className="border-t border-border last:border-b">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full py-5 flex items-center justify-between text-left group transition-colors"
                    >
                      <span className={`text-[15px] font-medium transition-colors ${openFaqIndex === idx ? "text-[#018058]" : "text-foreground group-hover:text-foreground/80"}`}>
                        {faq.question}
                      </span>
                      <div className="p-1 rounded-full group-hover:bg-muted transition-colors">
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-90 text-[#018058]" : "text-muted-foreground"}`} />
                      </div>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? "max-h-40 opacity-100 pb-6" : "max-h-0 opacity-0"}`}>
                      <p className="text-[14px] text-muted-foreground leading-relaxed pl-1 pr-8">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16">
              <h2 className="text-xl font-bold mb-8 text-foreground">Reviews</h2>
              <div className="bg-muted rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-12 transition-colors duration-300">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold mb-2 tracking-tight text-foreground">0/5</div>
                  <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">0 Reviews</div>
                </div>
                <div className="flex-1 w-full space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-4">
                      <span className="text-[13px] font-medium w-12 text-muted-foreground">{star} stars</span>
                      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-[#8c9e8d] w-0 transition-all duration-500" />
                      </div>
                      <span className="text-[13px] font-medium w-4 text-right text-muted-foreground">0</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <button className="h-10 px-6 rounded-full bg-[#8c9e8d] text-white text-[13px] font-bold shadow-sm transition-all hover:bg-[#7a8c7b]">All</button>
                  <button className="h-10 px-6 rounded-full border border-border text-muted-foreground text-[13px] font-bold transition-all hover:bg-muted hover:text-foreground">
                    With Photos Only
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-muted-foreground">Sort by</span>
                  <div className="relative">
                    <select className="appearance-none bg-muted border-none h-11 pl-5 pr-12 rounded-xl text-[13px] font-bold text-foreground cursor-pointer focus:ring-0">
                      <option>Oldest</option>
                      <option>Newest</option>
                      <option>Highest Rating</option>
                      <option>Lowest Rating</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>

              <div className="py-12 border-t border-border">
                <p className="text-[15px] text-muted-foreground mb-2">There are no reviews yet.</p>
                <p className="text-[14px] text-muted-foreground/70 leading-relaxed italic">
                  Only logged in customers who have purchased this product may leave a review.
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="top-16 space-y-6">
              <div className="bg-muted p-6 rounded-xl transition-colors duration-300">
                <h2 className="text-xl font-bold mb-4 text-foreground">Book This Room</h2>
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-2xl font-bold ml-2 text-foreground">${room.price.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground"> /night</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-muted-foreground">Check-in Date</label>
                    <Input type="text" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="border-none h-11 bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-muted-foreground">Check-out Date</label>
                    <Input type="text" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="border-none h-11 bg-background text-foreground" />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-muted-foreground">Adults</label>
                      <Input type="number" value={adults} onChange={(e) => setAdults(e.target.value)}
                        className="border-none h-11 bg-background text-foreground" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1 text-muted-foreground">Children</label>
                      <Input type="number" value={children} onChange={(e) => setChildren(e.target.value)}
                        className="border-none h-11 bg-background text-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-muted-foreground">Room(s)</label>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Max: 100</span>
                    </div>
                    <Input type="number" value={roomsCount} onChange={(e) => setRoomsCount(e.target.value)}
                      className="border-none h-11 bg-background text-foreground" />
                  </div>

                <div className="pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Checkbox id="wifi_sg" className="mt-1 border-border" checked={wifiSg} onCheckedChange={(checked) => setWifiSg(checked)} />
                      <div className="flex justify-between w-full items-center">
                        <div>
                          <label htmlFor="wifi_sg" className="text-sm font-medium block text-foreground">Wifi SG</label>
                          <span className="text-xs text-muted-foreground">$5.00 / Person/Trip</span>
                        </div>
                        <Input type="number" value={wifiSgCount} onChange={(e) => setWifiSgCount(e.target.value)}
                          className="w-8 h-8 p-0 text-center text-xs border-border bg-background text-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-foreground">Total:</span>
                      <button className="block text-[10px] text-muted-foreground underline decoration-dotted">View details</button>
                    </div>
                    <span className="text-lg font-bold text-foreground">${room.price.toFixed(1)}</span>
                  </div>

                  <Button onClick={handleBooking} disabled={isLoading}
                    className="w-full h-12 bg-[#8c9e8d] hover:bg-[#7a8c7b] text-white font-bold rounded-lg transition-colors mt-4 flex items-center justify-center gap-2">
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoading ? "Booking..." : "Book Room"}
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-6 rounded-xl transition-colors duration-300">
                <h3 className="text-sm font-bold mb-4 text-foreground">Book through our trusted partners</h3>
                <div className="flex items-center gap-4">
                  {TRUSTED_PARTNERS.map((partner) => (
                    <div key={partner.name}
                      className="w-10 h-10 flex items-center justify-center shadow-sm cursor-pointer rounded-full bg-background">
                      <img src={partner.logo} alt={partner.name}
                        className={`w-full transition-all ${partner.rounded ? "opacity-60 hover:opacity-100" : ""}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-header tracking-tight text-foreground">Similar Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SIMILAR_ROOMS.map((similarRoom) => (
              <div key={similarRoom.id} className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={similarRoom.image} alt={similarRoom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-[#8c9e8d]/90 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider backdrop-blur-sm">
                    {similarRoom.category}
                  </div>
                  <div className="absolute bottom-0 left-0">
                    <div className="bg-card px-6 py-3 rounded-tr-2xl shadow-lg">
                      <span className="text-xl font-bold text-foreground">${similarRoom.price.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground ml-1">/night</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-8">
                  <h3 className="text-lg font-bold mb-4 group-hover:text-[#018058] transition-colors text-foreground">
                    {similarRoom.name}
                  </h3>
                  <div className="flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-4 h-4 text-muted-foreground/40" />
                      <span>{similarRoom.size} m²</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground/40" />
                      <span>{similarRoom.adults} Adults</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
