import { useState, useRef, useEffect } from "react";
import { Calendar, Users, Home, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./booking/DatePicker";
import BookingCounter from "./booking/BookingCounter";
import { cn } from "@/lib/utils";

export default function BookingBar({ className, variant = "overlay" }) {
  const [activePopover, setActivePopover] = useState(null);
  const [bookingState, setBookingState] = useState({
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    adults: 1,
    children: 0,
    rooms: 1,
  });

  const barRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).split('/').reverse().join('/');
  };

  const updateCount = (field, delta) => {
    setBookingState(prev => ({
      ...prev,
      [field]: Math.max(field === 'adults' || field === 'rooms' ? 1 : 0, prev[field] + delta)
    }));
  };

  const segments = [
    {
      id: "dates",
      icon: <Calendar size={20} />,
      label: "Checkin - Checkout",
      value: `${formatDate(bookingState.checkIn)} - ${formatDate(bookingState.checkOut)}`,
    },
    {
      id: "adults",
      icon: <Users size={20} />,
      label: "Adults",
      value: `${bookingState.adults} Adults`,
    },
    {
      id: "children",
      icon: <UserPlus size={20} />,
      label: "Children",
      value: `${bookingState.children} Children`,
    },
    {
      id: "rooms",
      icon: <Home size={20} />,
      label: "Rooms",
      value: `${bookingState.rooms} Rooms`,
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className={cn(
        "w-full max-w-7xl mx-auto px-4 z-30",
        variant === "overlay" ? "absolute bottom-6 md:bottom-16 left-1/2 -translate-x-1/2" : "relative py-4",
        className
      )}
      ref={barRef}
    >
      <div className={cn(
        "border border-border/50 rounded-[2.5rem] p-3 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-0 relative transition-all duration-300",
        variant === "overlay" ? "bg-card/90 backdrop-blur-xl" : "bg-card"
      )}>
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center">
          {segments.map((segment, index) => (
            <div 
              key={segment.id} 
              onClick={() => setActivePopover(activePopover === segment.id ? null : segment.id)}
              className={`flex flex-1 items-center gap-4 px-6 py-4 md:py-2 group cursor-pointer hover:bg-primary/5 transition-colors relative 
                ${index === 0 ? 'rounded-l-[2rem] lg:rounded-l-[2rem]' : ''} 
                ${activePopover === segment.id ? 'bg-primary/5' : ''}
                ${index !== 0 ? 'rounded-3xl lg:rounded-none' : ''}`}
            >
              <div className="text-primary/60 group-hover:text-primary transition-colors">
                {segment.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                  {segment.label}
                </span>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {segment.value}
                </span>
              </div>
              
              {/* Divider for Desktop */}
              {index < segments.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-px bg-border/50" />
              )}

              {/* Popover */}
              <AnimatePresence>
                {activePopover === segment.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-4 md:bottom-full md:mb-4 md:top-auto md:mt-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 lg:left-0 lg:right-auto bg-card border border-border shadow-2xl rounded-3xl overflow-hidden z-50 w-[95vw] md:w-auto"
                    style={{ minWidth: segment.id === 'dates' ? 'min(320px, 90vw)' : 'min(260px, 90vw)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">
                       {segment.id === 'dates' && (
                         <DatePicker 
                           checkIn={bookingState.checkIn} 
                           checkOut={bookingState.checkOut} 
                           setBookingState={setBookingState} 
                           setActivePopover={setActivePopover}
                         />
                       )}
                       {segment.id === 'adults' && (
                         <BookingCounter 
                           label="Adults" 
                           value={bookingState.adults} 
                           onMinus={() => updateCount('adults', -1)} 
                           onPlus={() => updateCount('adults', 1)} 
                         />
                       )}
                       {segment.id === 'children' && (
                         <BookingCounter 
                           label="Children" 
                           value={bookingState.children} 
                           onMinus={() => updateCount('children', -1)} 
                           onPlus={() => updateCount('children', 1)} 
                         />
                       )}
                       {segment.id === 'rooms' && (
                         <BookingCounter 
                           label="Rooms" 
                           value={bookingState.rooms} 
                           onMinus={() => updateCount('rooms', -1)} 
                           onPlus={() => updateCount('rooms', 1)} 
                         />
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="py-2 lg:py-0">
          <Button 
            className="w-full lg:w-auto px-5 h-12 text-xs font-bold uppercase tracking-widest transition-all"
            onClick={() => {
              if (!bookingState.checkIn || !bookingState.checkOut) {
                alert("Please select both check-in and check-out dates.");
                return;
              }
              alert(`Booking Request:\nDates: ${formatDate(bookingState.checkIn)} to ${formatDate(bookingState.checkOut)}\nGuests: ${bookingState.adults} Adults, ${bookingState.children} Children\nRooms: ${bookingState.rooms}`);
            }}
          >
            Check Availability
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
