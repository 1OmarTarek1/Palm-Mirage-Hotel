import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockRoomData = {
  id: 1,
  name: "Summit View King Room",
  price: 100.00,
  images: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
  ],
  rating: 3,
  beds: 1,
  bedType: "Bed",
  size: 50,
  adults: 6,
  description: "Hand-painted murals and oversized industrial windows. Open floor plans and modern appliances. Once a former manufacturing plant, The Heid was designed with high ceilings and concrete flooring. Each space includes a Roku and in-suite laundry, perfect for a weekend or a year-long stay. Start your day with a coffee on the rooftop. Or stroll through The Rail Park, a nature walk set between soaring skyscrapers. The Callowhill neighborhood is a fusion of art galleries, factories, and live music. Stay for a little or stay for a lot, The Heid has what you want.",
};

const amenities = [
  { icon: <Wifi className="w-5 h-5 text-[#018058]" />, label: "High-speed Wifi" },
  { icon: <Waves className="w-5 h-5 text-[#018058]" />, label: "Outdoor swimming pool" },
  { icon: <Ban className="w-5 h-5 text-[#018058]" />, label: "Non-smoking room" },
  { icon: <Dumbbell className="w-5 h-5 text-[#018058]" />, label: "Fitness center" },
  { icon: <Car className="w-5 h-5 text-[#018058]" />, label: "On-site parking" },
  { icon: <CheckCircle2 className="w-5 h-5 text-[#018058]" />, label: "Housekeeping service" },
  { icon: <Coffee className="w-5 h-5 text-[#018058]" />, label: "Superb Breakfast" },
  { icon: <Utensils className="w-5 h-5 text-[#018058]" />, label: "Restaurant" },
];

const features = [
  { icon: <Umbrella className="w-5 h-5 text-[#018058]" />, label: "Beachfront" },
  { icon: <Table className="w-5 h-5 text-[#018058]" />, label: "Balcony" },
  { icon: <Wind className="w-5 h-5 text-[#018058]" />, label: "Air Conditioner" },
  { icon: <Bed className="w-5 h-5 text-[#018058]" />, label: "King Bedroom" },
  { icon: <Lock className="w-5 h-5 text-[#018058]" />, label: "Safe Box" },
  { icon: <GlassWater className="w-5 h-5 text-[#018058]" />, label: "Minibar" },
  { icon: <Tv className="w-5 h-5 text-[#018058]" />, label: "40' Flat Screen HD TV" },
  { icon: <Phone className="w-5 h-5 text-[#018058]" />, label: "Phones" },
  { icon: <Monitor className="w-5 h-5 text-[#018058]" />, label: "Cable/satellite" },
  { icon: <Refrigerator className="w-5 h-5 text-[#018058]" />, label: "In-room Refrigerator" },
  { icon: <Usb className="w-5 h-5 text-[#018058]" />, label: "USB Outlets" },
  { icon: <Gift className="w-5 h-5 text-[#018058]" />, label: "Complimentary" },
];

const bathroom = [
  { icon: <Bath className="w-5 h-5 text-[#018058]" />, label: "Shower" },
  { icon: <Wind className="w-5 h-5 text-[#018058]" />, label: "Hair Dryer" },
  { icon: <Shirt className="w-5 h-5 text-[#018058]" />, label: "Robes" },
  { icon: <Footprints className="w-5 h-5 text-[#018058]" />, label: "Slippers" },
  { icon: <Droplets className="w-5 h-5 text-[#018058]" />, label: "Towels" },
  { icon: <Droplets className="w-5 h-5 text-[#018058]" />, label: "Shampoo" },
];

const policies = [
  {
    title: "Check-in, Check-Out",
    content: "Check-in is at 4:00 Checkout is at 11:00 am\nYou may request early check-in and/or late check-out after booking. Our team will do our best to accommodate any requests based on availability.",
    icon: "1"
  },
  {
    title: "Accessibility",
    content: (
      <ul className="list-disc ml-4 space-y-1">
        <li>Wheelchair access available</li>
        <li>Elevators available</li>
      </ul>
    ),
    icon: "2"
  },
  {
    title: "House Rules",
    content: (
      <div className="space-y-4">
        <ul className="list-disc ml-4 space-y-1">
          <li>No smoking (not even on balconies/patios)</li>
          <li>No pets (not even really cute ones) unless otherwise stated</li>
          <li>No parties (not even really quiet ones)</li>
        </ul>
        <p className="italic text-gray-500">* Please be respectful of your neighbors and keep noise to a minimum from 10:00 pm – 8:00 am.</p>
      </div>
    ),
    icon: "3"
  },
  {
    title: "Please Note",
    content: (
      <ul className="list-disc ml-4 space-y-1">
        <li>There's no cable.</li>
        <li>The bedroom and living space for some Sonders are separated by opaque curtain panels instead of a solid wall.</li>
        <li>Due to the central location, noise may be present.</li>
        <li>Intra-stay cleanings are available during weekdays for an additional charge.</li>
        <li>1 hour • Admission Ticket Free</li>
      </ul>
    ),
    icon: "4"
  },
  {
    title: "Flexible Cancellation",
    content: "We offer flexible cancellations for all bookings. Select the Flex Rate to cancel your booking up to 3 days before check-in and receive a full refund. For longer stays that are paid monthly, we require at least 30 days notice to cancel or modify without fees.",
    icon: "5"
  }
];

const faqs = [
  {
    question: "Will I be able to update my subscription details another time?",
    answer: "Yes, you can update your subscription details at any time from your account settings. Simply log in to your dashboard and navigate to the subscription section."
  },
  {
    question: "How many Tours are available on TravelWP?",
    answer: "TravelWP offers hundreds of curated tours across various destinations. Our catalog is constantly growing to provide you with more options."
  },
  {
    question: "What are the most popular Tours?",
    answer: "Our most popular tours include the Summit Peak trek, the Crystal Cave exploration, and the Aurora Borealis night tour."
  },
  {
    question: "What are the top-rated Tours?",
    answer: "Top-rated tours are determined by guest reviews. Currently, our Alpine Lodge experience and the Deep Sea Diving tour hold the highest ratings."
  },
  {
    question: "What are the most affordable Tours?",
    answer: "We offer a range of budget-friendly options, including half-day city walks and local nature hikes starting from $25 per person."
  }
];

const similarRooms = [
  {
    id: 101,
    name: "Convent Peak Junior Suite",
    price: 261.00,
    category: "DOUBLE ROOM",
    image: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
    size: 50,
    adults: 3
  },
  {
    id: 102,
    name: "Deluxe Alpine Terrace Suite",
    price: 420.00,
    category: "DELUXE ROOM",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2070&auto=format&fit=crop",
    size: 50,
    adults: 4
  },
  {
    id: 103,
    name: "Terrace Panorama Summit",
    price: 330.00,
    category: "SINGLE ROOM",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
    size: 50,
    adults: 2
  }
];

export default function RoomDetails() {
  const navigate = useNavigate()
  const { id } = useParams();
  const room = mockRoomData;
  const dispatch = useDispatch();

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

  const handleDateClick = (dateStr) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr);
      setCheckOut("");
    } else {
      if (new Date(dateStr) < new Date(checkIn)) {
        setCheckIn(dateStr);
      } else {
        setCheckOut(dateStr);
      }
    }
  };

  const getDayClass = (dateStr) => {
    if (!checkIn) return "text-gray-500 hover:bg-gray-50 cursor-pointer";

    const current = new Date(dateStr);
    const start = new Date(checkIn);

    if (dateStr === checkIn) return "bg-[#8c9e8d] text-white shadow-sm";

    if (checkOut) {
      const end = new Date(checkOut);
      if (dateStr === checkOut) return "bg-[#8c9e8d] text-white shadow-sm";
      if (current > start && current < end) return "bg-[#f0f3ef] text-[#8c9e8d]";
    }

    if (current < new Date("2026/02/23")) return "text-gray-300 pointer-events-none";
    return "text-gray-500 hover:bg-gray-50 cursor-pointer";
  };

  const handleBooking = async () => {
    setIsLoading(true);
    
    // Calculate nights
    let nights = 1;
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) nights = diffDays;
    }

    // Add exactly one entry to the cart with the computed details
    dispatch(
      addItem({
        id: room.id,
        name: room.name,
        image: room.images[0],
        price: room.price,
        category: room.bedType,
        quantity: parseInt(roomsCount) || 1,
        nights: nights,
      })
    );
    
    toast.success(`${room.name} added to cart`);
    navigate("/cart")
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl font-main">
      {/* Hero Section with Carousel */}
      <div className="relative group mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {room.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-xl">
                  <img
                    src={image}
                    alt={`${room.name} - image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay to darken slightly if needed, matching the image look */}
                  <div className="absolute inset-0 bg-black/5" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom Styled Navigation Buttons */}
          <CarouselPrevious className="left-6 bg-white/90 hover:bg-white hover:text-black text-gray-800 border-none shadow-md h-10 w-10 
            opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0" />
          <CarouselNext className="right-6 bg-white/90 hover:bg-white  hover:text-black text-gray-800 border-none shadow-md h-10 w-10 
            opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-0" />

          {/* Room Summary Card Overlay */}
          <div className="absolute bottom-0 left-0 w-full sm:w-auto sm:min-w-[550px]">
            <div className="bg-white p-6 sm:p-10 rounded-tr-xl shadow-lg relative z-20">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-8 font-header leading-tight">
                {room.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-[13px] sm:text-sm text-gray-500 font-medium">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
                  <span>{room.rating}/5</span>
                </div>

                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span>{room.beds} {room.bedType}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-gray-400" />
                  <span>{room.size}sqm m²</span>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <span>{room.adults} Adults</span>
                </div>
              </div>
            </div>
          </div>
        </Carousel>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">

        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Description */}
          <section>
            <p className="text-[#666] leading-relaxed text-[15px]">
              {room.description}
            </p>
          </section>

          {/* Services & Amenities */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Services & Amenities:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {amenities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[14px] text-gray-600">
                  <span className="text-[#4b5563]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Room Features */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Room Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[14px] text-gray-600">
                  <span className="text-[#4b5563]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bathroom */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Bathroom</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              {bathroom.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[14px] text-gray-600">
                  <span className="text-[#4b5563]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Booking Policies */}
          <section>
            <h2 className="text-xl font-bold mb-8 text-[#1a1a1a]">Booking Policies</h2>
            <div className="space-y-0 relative">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-gray-200" />

              {policies.map((policy, idx) => (
                <div key={idx} className="relative pl-12 pb-10 last:pb-0">
                  {/* Number Circle */}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center text-sm text-gray-500 font-medium z-10 transition-colors hover:border-[#1a1a1a] hover:text-[#1a1a1a]">
                    {policy.icon}
                  </div>

                  <h3 className="font-bold text-[16px] mb-3 text-[#1a1a1a]">{policy.title}</h3>
                  <div className="text-[14px] text-gray-500 leading-relaxed whitespace-pre-line">
                    {policy.content}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rates & Availability */}
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-8 text-[#1a1a1a]">Rates & Availability</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              {/* Calendar Header with Navigation */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 text-center font-bold text-gray-700 text-lg uppercase tracking-tight">February 2026</div>
                <div className="flex-1 text-center font-bold text-gray-700 text-lg uppercase tracking-tight relative">
                  March 2026
                  <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1a1a1a]">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dual Month Calendar Grid */}
              <div className="grid grid-cols-2 gap-12">
                {/* February 2026 */}
                <div>
                  <div className="grid grid-cols-7 mb-4 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1 text-center">
                    {/* Feb 1 2026 is Sunday. Oh wait, it starts on standard gregorian calculation. Let's just follow image look. */}
                    {/* In image, Monday starts on some column. Feb 1 2026 is Sunday. So Mon-Sat empty. */}
                    {[...Array(6)].map((_, i) => <div key={`p-${i}`} className="h-10" />)}
                    {[...Array(28)].map((_, i) => {
                      const day = i + 1;
                      const isSelected = day === 23 || day === 24;
                      const isPast = day < 23;
                      return (
                        <div
                          key={day}
                          className={`h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors
                            ${isSelected ? 'bg-[#8c9e8d] text-white shadow-sm' : isPast ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}
                            ${day === 1 ? 'bg-[#f7f8f7]' : ''}
                          `}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* March 2026 */}
                <div>
                  <div className="grid grid-cols-7 mb-4 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <span key={day} className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{day}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1 text-center">
                    {/* March 1 is Sunday. */}
                    {[...Array(6)].map((_, i) => <div key={`p2-${i}`} className="h-10" />)}
                    {[...Array(31)].map((_, i) => (
                      <div key={i + 1} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer rounded-lg">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-8">
              <button className="h-12 px-8 rounded-full border border-gray-300 text-[#1a1a1a] font-bold text-sm hover:bg-gray-50 transition-colors uppercase tracking-wide">
                Cancel
              </button>
              <button className="h-12 px-10 rounded-full bg-[#8c9e8d] text-white font-bold text-sm hover:bg-[#7a8c7b] transition-colors uppercase tracking-wide shadow-sm">
                Apply
              </button>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-8 text-[#1a1a1a]">Frequently Asked Questions</h2>
            <div className="space-y-0">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-t border-gray-100 last:border-b">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full py-5 flex items-center justify-between text-left group transition-colors"
                  >
                    <span className={`text-[15px] font-medium transition-colors ${openFaqIndex === idx ? 'text-[#018058]' : 'text-gray-700 group-hover:text-[#1a1a1a]'}`}>
                      {faq.question}
                    </span>
                    <div className="p-1 rounded-full group-hover:bg-gray-50 transition-colors">
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-90 text-[#018058]' : ''}`} />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-[14px] text-gray-500 leading-relaxed pl-1 pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-8 text-[#1a1a1a]">Reviews</h2>

            <div className="bg-[#f8f9f8] rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-12">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-[#1a1a1a] mb-2 tracking-tight">0/5</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">0 Reviews</div>
              </div>

              <div className="flex-1 w-full space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4 group">
                    <span className="text-[13px] font-medium text-gray-500 w-12">{star} stars</span>
                    <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-gray-100">
                      <div className="h-full bg-[#8c9e8d] w-0 transition-all duration-500" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-400 w-4 text-right">0</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button className="h-10 px-6 rounded-full bg-[#8c9e8d] text-white text-[13px] font-bold shadow-sm transition-all hover:bg-[#7a8c7b]">
                  All
                </button>
                <button className="h-10 px-6 rounded-full border border-gray-200 text-gray-500 text-[13px] font-bold transition-all hover:bg-gray-50 hover:text-[#1a1a1a] hover:border-gray-300">
                  With Photos Only
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-gray-400">Sort by</span>
                <div className="relative group">
                  <select className="appearance-none bg-[#f8f9f8] border-none h-11 pl-5 pr-12 rounded-xl text-[13px] font-bold text-[#1a1a1a] cursor-pointer focus:ring-0">
                    <option>Oldest</option>
                    <option>Newest</option>
                    <option>Highest Rating</option>
                    <option>Lowest Rating</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>
            </div>

            <div className="py-12 border-t border-gray-100">
              <p className="text-[15px] text-gray-500 mb-2">There are no reviews yet.</p>
              <p className="text-[14px] text-gray-400 leading-relaxed italic">
                Only logged in customers who have purchased this product may leave a review.
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="top-16 space-y-6">
            <div className="bg-[#f0f3ef] p-6 rounded-xl border border-transparent">
              <h2 className="text-xl font-bold mb-4 text-[#1a1a1a]">Book This Room</h2>

              <div className="mb-6">
                <span className="text-sm text-gray-500">From</span>
                <span className="text-2xl font-bold text-[#1a1a1a] ml-2">${room.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500"> /night</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-in Date</label>
                  <Input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-white border-none h-11"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Check-out Date</label>
                  <Input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-white border-none h-11"
                  />
                </div>

                {/* Adults/Children */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adults</label>
                    <Input
                      type="number"
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="bg-white border-none h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Children</label>
                    <Input
                      type="number"
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="bg-white border-none h-11"
                    />
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room(s)</label>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400">Max: 100</span>
                  </div>
                  <Input
                    type="number"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    className="bg-white border-none h-11"
                  />
                </div>

                {/* Extra Services */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="wifi_sg"
                      className="mt-1 border-gray-300"
                      checked={wifiSg}
                      onCheckedChange={(checked) => setWifiSg(checked)}
                    />
                    <div className="flex justify-between w-full items-center">
                      <div>
                        <label htmlFor="wifi_sg" className="text-sm font-medium text-gray-700 block">Wifi SG</label>
                        <span className="text-xs text-gray-400">$5.00 / Person/Trip</span>
                      </div>
                      <Input
                        type="number"
                        value={wifiSgCount}
                        onChange={(e) => setWifiSgCount(e.target.value)}
                        className="w-8 h-8 p-0 text-center text-xs bg-white border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-[#1a1a1a]">Total:</span>
                    <button className="block text-[10px] text-gray-400 underline decoration-dotted">View details</button>
                  </div>
                  <span className="text-lg font-bold text-[#1a1a1a]">${room.price.toFixed(1)}</span>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="w-full h-12 bg-[#8c9e8d] hover:bg-[#7a8c7b] text-white font-bold rounded-lg transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Booking..." : "Book Room"}
                </Button>
              </div>
            </div>

            {/* Partners Section */}
            <div className="bg-[#f0f3ef] p-6 rounded-xl border border-transparent">
              <h3 className="text-sm font-bold mb-4">Book through our trusted partners</h3>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <img src="	https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/04/agoda.png" alt="Agoda" className="w-full opacity-60 transition-all cursor-pointer" />
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer">
                  <img src="	https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2024/04/traveloka1.png" alt="Skyscanner" className="w-full " />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Rooms Section */}
      <section className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#1a1a1a] font-header tracking-tight">Similar Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {similarRooms.map((room) => (
            <div key={room.id} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#8c9e8d]/90 text-white text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider backdrop-blur-sm">
                  {room.category}
                </div>
                <div className="absolute bottom-0 left-0">
                  <div className="bg-white px-6 py-3 rounded-tr-2xl shadow-lg">
                    <span className="text-xl font-bold text-[#1a1a1a]">${room.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400 ml-1">/night</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-8">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4 group-hover:text-[#018058] transition-colors">
                  {room.name}
                </h3>
                <div className="flex items-center gap-6 text-[13px] text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-gray-300" />
                    <span>{room.size} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span>{room.adults} Adults</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
