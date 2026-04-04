import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, Users, Home, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "./booking/DatePicker";
import BookingCounter from "./booking/BookingCounter";
import { cn } from "@/lib/utils";
import { formatBookingDate } from "@/utils/roomBooking";
import { toast } from "react-toastify";

const createDefaultBookingState = (search) => {
  const defaultCheckIn = new Date();
  defaultCheckIn.setHours(0, 0, 0, 0);
  const defaultCheckOut = new Date(defaultCheckIn);
  defaultCheckOut.setDate(defaultCheckIn.getDate() + 1);

  const params = new URLSearchParams(search);
  const checkInParam = params.get("checkIn");
  const checkOutParam = params.get("checkOut");
  const adultsParam = Number(params.get("adults") || 1);
  const childrenParam = Number(params.get("children") || 0);
  const roomsParam = Number(params.get("rooms") || 1);

  return {
    checkIn: checkInParam ? new Date(`${checkInParam}T00:00:00`) : defaultCheckIn,
    checkOut: checkOutParam ? new Date(`${checkOutParam}T00:00:00`) : defaultCheckOut,
    adults: params.has("adults") && Number.isFinite(adultsParam) ? Math.max(1, adultsParam) : 1,
    children: params.has("children") && Number.isFinite(childrenParam) ? Math.max(0, childrenParam) : 0,
    rooms: params.has("rooms") && Number.isFinite(roomsParam) ? Math.max(1, roomsParam) : 1,
  };
};

const BookingBar = forwardRef(function BookingBar({ className, variant = "overlay" }, ref) {
  const MotionDiv = motion.div;
  const navigate = useNavigate();
  const location = useLocation();
  const [activePopover, setActivePopover] = useState(null);
  const [bookingState, setBookingState] = useState(() => createDefaultBookingState(location.search));

  const barRef = useRef(null);
  const popoverRef = useRef(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      const clickedInsideBar = barRef.current?.contains(event.target);
      const clickedInsidePopover = popoverRef.current?.contains(event.target);

      if (!clickedInsideBar && !clickedInsidePopover) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useImperativeHandle(ref, () => ({
    resetToDefaults() {
      setBookingState(createDefaultBookingState(""));
      setActivePopover(null);
    },
  }), []);

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

  const renderPopoverContent = (segmentId) => {
    if (segmentId === "dates") {
      return (
        <DatePicker
          checkIn={bookingState.checkIn}
          checkOut={bookingState.checkOut}
          setBookingState={setBookingState}
          setActivePopover={setActivePopover}
        />
      );
    }

    if (segmentId === "adults") {
      return (
        <BookingCounter
          label="Adults"
          value={bookingState.adults}
          onMinus={() => updateCount("adults", -1)}
          onPlus={() => updateCount("adults", 1)}
        />
      );
    }

    if (segmentId === "children") {
      return (
        <BookingCounter
          label="Children"
          value={bookingState.children}
          onMinus={() => updateCount("children", -1)}
          onPlus={() => updateCount("children", 1)}
        />
      );
    }

    return (
      <BookingCounter
        label="Rooms"
        value={bookingState.rooms}
        onMinus={() => updateCount("rooms", -1)}
        onPlus={() => updateCount("rooms", 1)}
      />
    );
  };

  return (
    <MotionDiv
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
            </div>
          ))}
        </div>

        <div className={cn("py-2", variant === "overlay" ? "xl:py-0" : "lg:py-0")}>
          <Button 
            className={cn(
              "w-full px-5 h-12 text-xs font-bold uppercase tracking-widest transition-all",
              variant === "overlay" ? "xl:w-auto" : "lg:w-auto"
            )}
            onClick={() => {
              if (!bookingState.checkIn || !bookingState.checkOut) {
                toast.error("Please select both check-in and check-out dates.");
                return;
              }

              const search = new URLSearchParams({
                checkIn: formatBookingDate(bookingState.checkIn),
                checkOut: formatBookingDate(bookingState.checkOut),
                adults: String(bookingState.adults),
                children: String(bookingState.children),
                rooms: String(bookingState.rooms),
              }).toString();

              navigate(`/rooms?${search}`);
              setActivePopover(null);
            }}
          >
            Check Availability
          </Button>
        </div>
      </div>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {activePopover ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-6 pointer-events-none"
                >
                  <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 12 }}
                    transition={{ duration: 0.2 }}
                    className="pointer-events-auto max-h-[calc(100vh-2rem)] overflow-auto rounded-3xl border border-border bg-card shadow-2xl"
                    style={{
                      width:
                        activePopover === "dates"
                          ? "min(380px, calc(100vw - 2rem))"
                          : "min(280px, calc(100vw - 2rem))",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2">{renderPopoverContent(activePopover)}</div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </MotionDiv>
  );
});

export default BookingBar;
