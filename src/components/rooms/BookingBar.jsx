import { useState, useRef, useEffect } from "react";
import { Calendar, Users, Home, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./booking/DatePicker";
import BookingCounter from "./booking/BookingCounter";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { cn } from "@/lib/utils";

export default function BookingBar({ className, variant = "overlay" }) {
  const { flyToCart } = useFlyToCart();
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
        "w-full mx-auto px-4 z-30",
        variant === "overlay" ? "max-w-sm md:max-w-md xl:max-w-7xl absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2" : "max-w-7xl relative py-4",
        className
      )}
      ref={barRef}
    >
      <div className={cn(
        "border border-border/50 rounded-[2.5rem] p-3 flex flex-col items-stretch gap-4 relative transition-all duration-300",
        variant === "overlay" ? "xl:flex-row xl:items-center xl:gap-0" : "lg:flex-row lg:items-center lg:gap-0",
        variant === "overlay" ? "dark:bg-background/50 bg-background/90 backdrop-blur-xl" : "bg-card"
      )}>
        <div className={cn(
          "flex-1 flex flex-col items-stretch",
          variant === "overlay" ? "xl:flex-row xl:items-center" : "md:flex-row md:items-center"
        )}>
          {segments.map((segment, index) => (
            <div 
              key={segment.id} 
              onClick={() => setActivePopover(activePopover === segment.id ? null : segment.id)}
              className={cn(
                "flex flex-1 items-center gap-4 px-6 py-4 md:py-2 group cursor-pointer hover:bg-primary/5 transition-colors relative rounded-3xl",
                variant === "overlay"
                  ? (index === 0 ? "xl:rounded-l-[2rem] xl:rounded-r-none" : "xl:rounded-none")
                  : (index === 0 ? "lg:rounded-l-[2rem] lg:rounded-r-none" : "lg:rounded-none"),
                activePopover === segment.id && "bg-primary/5"
              )}
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
              
              {index < segments.length - 1 && (
                <div className={cn(
                  "hidden absolute right-0 top-1/4 bottom-1/4 w-px bg-border/50",
                  variant === "overlay" ? "xl:block" : "lg:block"
                )} />
              )}

              {/* Popover */}
              <AnimatePresence>
                {activePopover === segment.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute bg-card border border-border shadow-2xl rounded-3xl overflow-hidden z-50",
                      variant === "overlay"
                        ? "top-full mt-4 left-1/2 -translate-x-1/2 w-[95vw] md:w-auto xl:bottom-full xl:mb-4 xl:top-auto xl:mt-0 xl:left-0 xl:translate-x-0"
                        : "top-full mt-4 md:bottom-full md:mb-4 md:top-auto md:mt-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 lg:left-0 lg:right-auto w-[95vw] md:w-auto"
                    )}
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

        <div className={cn("py-2", variant === "overlay" ? "xl:py-0" : "lg:py-0")}>
          <Button 
            className={cn(
              "w-full px-5 h-12 text-xs font-bold uppercase tracking-widest transition-all",
              variant === "overlay" ? "xl:w-auto" : "lg:w-auto"
            )}
            onClick={(e) => {
              flyToCart(e.currentTarget);
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
