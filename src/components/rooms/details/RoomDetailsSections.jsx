import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Armchair,
  Ban,
  Bath,
  Bed,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  Dumbbell,
  Droplets,
  Footprints,
  Gift,
  GlassWater,
  Home,
  Loader2,
  Lock,
  Maximize2,
  Monitor,
  Phone,
  Refrigerator,
  RotateCcw,
  Shirt,
  ShieldAlert,
  ShieldCheck,
  Star,
  Tv,
  Umbrella,
  Usb,
  Users,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RoomCard from "@/components/rooms/RoomCard";
import DatePicker from "@/components/rooms/booking/DatePicker";
import { BOOKING_POLICIES, ROOM_FAQS } from "@/utils/constants";
import { formatBookingDateLabel } from "@/utils/roomBooking";
import { toast } from "react-toastify";

const ICON_MAP = { wifi: Monitor, pool: Maximize2, parking: ShieldCheck, default: CheckCircle2 };
const DETAIL_ICON_MAP = {
  Wifi,
  Waves,
  Dumbbell,
  Car: CarFront,
  Coffee,
  Utensils: UtensilsCrossed,
  Ban,
  Umbrella,
  Wind,
  Bed,
  Tv,
  Lock,
  GlassWater,
  Phone,
  Monitor,
  Refrigerator,
  Usb,
  Gift,
  Table: Armchair,
  CheckCircle2,
  Bath,
  Droplets,
  Shirt,
  Footprints,
};
const POLICY_ICON_MAP = {
  "Check-in / Check-out": CheckCircle2,
  "Cancellation Policy": RotateCcw,
  "House Rules": ShieldAlert,
  Payment: CircleDollarSign,
};
const MotionDiv = motion.div;

const resolveAmenityIcon = (name) => {
  const key = String(name || "").toLowerCase().trim();
  return ICON_MAP[key] || ICON_MAP.default;
};

function SectionCard({ children, className = "" }) {
  return <section className={className}>{children}</section>;
}

export function RoomHeroGallery({ room }) {
  if (!room.images.length) {
    return <div className="flex aspect-video items-center justify-center rounded-[28px] border border-dashed border-border bg-card text-muted-foreground">No room gallery available yet.</div>;
  }

  return (
    <Carousel className="group relative w-full">
      <CarouselContent>
        {room.images.map((image, index) => (
          <CarouselItem key={`${room.id}-image-${index}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-border bg-card shadow-xl sm:aspect-video">
              <img src={image} alt={`${room.name} image ${index + 1}`} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-5 cursor-pointer border-none bg-card/90 text-foreground shadow-md" />
      <CarouselNext className="right-5 cursor-pointer border-none bg-card/90 text-foreground shadow-md" />
    </Carousel>
  );
}

export function RoomOverviewSection({ room }) {
  return (
    <SectionCard>
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{room.type} {room.floor ? `| Floor ${room.floor}` : ""}</p>
          <h1 className="font-header text-3xl font-bold tracking-tight text-foreground sm:text-5xl">{room.name}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {room.rating ? room.rating.toFixed(1) : "New"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
              <Bed className="h-4 w-4 text-primary" />
              {room.beds} {room.bedType}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
              <Maximize2 className="h-4 w-4 text-primary" />
              {room.size} sqm
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" />
              {room.adults} Adults
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{room.reviewsCount || 0}</span>
              <span className="text-sm text-muted-foreground">reviews</span>
            </div>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {room.reviewsCount > 0 ? `${room.reviewsCount}+ recent guest impressions` : "Freshly listed and ready for new stays"}
              </span>
              <span className="text-sm text-muted-foreground">
                {room.rating > 0 ? `Rated ${room.rating.toFixed(1)}/5` : "No rating yet"}
              </span>
            </div>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{room.description}</p>
        </div>
        <div className="grid min-w-[240px] gap-3 sm:grid-cols-1">
        </div>
      </div>
    </SectionCard>
  );
}

export function AmenitiesSection({ amenityCollections }) {
  const groups = [
    { title: "Services & Amenities", items: amenityCollections.serviceAmenities },
    { title: "Room Features", items: amenityCollections.roomFeatures },
    { title: "Bathroom", items: amenityCollections.bathroomFeatures },
  ];

  return (
    <SectionCard>
      <div className="space-y-10">
        {groups.map((group) => (
          <div key={group.title}>
            <h2 className="text-2xl font-bold text-foreground">{group.title}</h2>
            <div className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
              {group.items.map((item, index) => {
                const DetailIcon = DETAIL_ICON_MAP[item.iconName] || resolveAmenityIcon(item.label);
                return (
                  <div key={`${group.title}-${item.label}-${index}`} className="flex items-center gap-3">
                    <DetailIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export function AvailabilitySection({
  checkIn,
  checkOut,
  nights,
  availability,
  availabilityLoading,
  availabilityRangeKey,
  selectedRangeKey,
  effectiveAvailability,
  datePickerState,
  handleDatePickerState,
}) {
  return (
    <SectionCard>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Rates & Availability</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose dates and see blocked periods instantly.</p>
        </div>
        <div className={`rounded-full bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${!checkIn || !checkOut ? "text-muted-foreground" : availabilityLoading || availabilityRangeKey !== selectedRangeKey ? "text-muted-foreground" : effectiveAvailability?.isBookable ? "text-primary" : "text-destructive"}`}>
          {!checkIn || !checkOut ? "Choose dates" : availabilityLoading || availabilityRangeKey !== selectedRangeKey ? "Checking" : effectiveAvailability?.isBookable ? "Available" : "Unavailable"}
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-[26px] border border-border bg-card px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stay dates</p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {checkIn ? formatBookingDateLabel(checkIn) : "Select check-in"}
              {checkOut ? ` - ${formatBookingDateLabel(checkOut)}` : " - Select check-out"}
            </p>
          </div>
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <div className="grid items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[26px] border border-border bg-card shadow-sm">
            <DatePicker
              key={`${checkIn || "none"}-${checkOut || "none"}`}
              checkIn={datePickerState.checkIn}
              checkOut={datePickerState.checkOut}
              setBookingState={handleDatePickerState}
              setActivePopover={() => {}}
              bookedRanges={availability?.bookedRanges || []}
              onBlockedDateClick={() => toast.error("This date is already booked. Please choose another range.")}
              onInvalidRangeSelection={() => toast.error("This stay overlaps booked dates or the next checkout day is unavailable. Please choose another range.")}
            />
          </div>
          <div className="flex h-full flex-col rounded-[26px] border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Booked periods</p>
            <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {(availability?.bookedRanges || []).length > 0 ? availability.bookedRanges.map((range, index) => (
                <div key={`${range.startDate || range.checkInDate || index}-${range.endDate || range.checkOutDate || index}`} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground">
                  {formatBookingDateLabel(range.startDate || range.checkInDate)} - {formatBookingDateLabel(range.endDate || range.checkOutDate)}
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No blocked dates have been returned for this room yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Selected Stay</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{checkIn ? formatBookingDateLabel(checkIn) : "Select check-in"} {checkOut ? `- ${formatBookingDateLabel(checkOut)}` : "- Select check-out"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Nights</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{nights} night{nights === 1 ? "" : "s"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Booked Periods</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{availability?.bookedRanges?.length || 0} blocked range{availability?.bookedRanges?.length === 1 ? "" : "s"}</p>
        </div>
      </div>
    </SectionCard>
  );
}

export function PoliciesSection() {
  return (
    <SectionCard>
      <h2 className="text-2xl font-bold text-foreground">Booking Policies</h2>
      <div className="mt-8 space-y-8">
        {BOOKING_POLICIES.map((policy, index) => {
          const PolicyIcon = POLICY_ICON_MAP[policy.title] || CheckCircle2;
          return (
            <div key={policy.title} className="relative pl-14">
              {index !== BOOKING_POLICIES.length - 1 ? <div className="absolute left-[18px] top-10 h-[calc(100%-1rem)] w-px bg-border" /> : null}
              <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <PolicyIcon className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{policy.title}</h3>
              {policy.type === "text" ? (
                <div className="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                  {policy.content.split("\n").filter(Boolean).map((line) => <p key={`${policy.title}-${line}`}>{line}</p>)}
                </div>
              ) : null}
              {policy.type === "list" || policy.type === "house-rules" ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                  {policy.items.map((item) => <li key={`${policy.title}-${item}`}>{item}</li>)}
                </ul>
              ) : null}
              {policy.note ? <p className="mt-3 text-sm italic text-muted-foreground">{policy.note}</p> : null}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

export function FAQSection({ openFaqIndex, setOpenFaqIndex }) {
  return (
    <SectionCard>
      <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
      <div className="mt-6 divide-y divide-border">
        {ROOM_FAQS.map((faq, index) => (
          <button
            key={faq.question}
            type="button"
            onClick={() => setOpenFaqIndex(openFaqIndex === index ? -1 : index)}
            className="w-full py-5 text-left"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-base font-medium text-foreground">{faq.question}</span>
              <ChevronDown className={`h-4 w-4 cursor-pointer text-muted-foreground transition-transform ${openFaqIndex === index ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence initial={false}>
              {openFaqIndex === index ? (
                <MotionDiv
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </MotionDiv>
              ) : null}
            </AnimatePresence>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

export function ReviewsSection({ room, reviewBars }) {
  return (
    <SectionCard>
      <h2 className="text-2xl font-bold text-foreground">Reviews</h2>
      <div className="mt-6 rounded-[28px] border border-border bg-card p-6">
        <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <p className="text-6xl font-bold text-foreground">{room.reviewsCount > 0 ? room.rating.toFixed(1) : "0"}/5</p>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">{room.reviewsCount || 0} reviews</p>
          </div>
          <div className="space-y-3">
            {reviewBars.map((item) => (
              <div key={item.stars} className="grid grid-cols-[56px_minmax(0,1fr)_24px] items-center gap-3 text-sm text-muted-foreground">
                <span>{item.stars} stars</span>
                <div className="h-1.5 rounded-full bg-border">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                </div>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {room.reviewsCount > 0
              ? "Guest review details will appear here once the review feed is connected."
              : "There are no reviews yet. Only logged-in customers who have completed a stay can leave a review."}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export function BookingSidebar({
  room,
  cartItem,
  checkIn,
  checkOut,
  adults,
  setAdults,
  children,
  setChildren,
  roomsCount,
  setRoomsCount,
  rangeSelectionStep,
  setRangeSelectionStep,
  subtotal,
  total,
  availabilityLoading,
  effectiveAvailability,
  availabilityRangeKey,
  selectedRangeKey,
  bookingLoading,
  handleBooking,
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-6 rounded-[28px] border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Book This Room</h2>
          <p className="text-sm text-muted-foreground">Dates are required before this booking can continue.</p>
        </div>
        <div className="rounded-[24px] border border-primary/15 bg-card px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current rate</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">${room.price.toFixed(2)}</span>
            <span className="pb-1 text-sm text-muted-foreground">/ night</span>
          </div>
          {room.hasOffer && room.basePrice > room.price ? <p className="mt-2 text-sm text-muted-foreground">Regular rate <span className="line-through">${room.basePrice.toFixed(2)}</span></p> : null}
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Stay dates</span>
            <button
              type="button"
              onClick={() => setRangeSelectionStep("start")}
              className="flex h-auto w-full flex-col items-start gap-1 rounded-2xl border border-border bg-card px-4 py-3 text-left transition hover:border-primary/40"
            >
              <span className="text-sm font-semibold text-foreground">
                {checkIn ? formatBookingDateLabel(checkIn) : "Select check-in"}
                {checkOut ? ` - ${formatBookingDateLabel(checkOut)}` : " - Select check-out"}
              </span>
              <span className="text-xs text-muted-foreground">
                {rangeSelectionStep === "end" ? "Pick the check-out date from the calendar below." : "First click sets check-in, second click sets check-out."}
              </span>
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Adults</span>
              <Input type="number" min="1" max={room.adults} value={adults} onChange={(event) => setAdults(event.target.value)} className="h-11 bg-card" />
            </label>
            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Children</span>
              <Input type="number" min="0" value={children} onChange={(event) => setChildren(event.target.value)} className="h-11 bg-card" />
            </label>
          </div>
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Rooms</span>
            <Input type="number" min="1" max="5" value={roomsCount} onChange={(event) => setRoomsCount(event.target.value)} className="h-11 bg-card" />
          </label>
        </div>
        <div className="space-y-3 rounded-[24px] border border-border bg-card p-4">
          <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Room subtotal</span><span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span></div>
          <div className="flex items-center justify-between border-t border-border pt-3"><span className="text-sm font-semibold text-foreground">Estimated total</span><span className="text-xl font-bold text-foreground">${total.toFixed(2)}</span></div>
        </div>
        <div className={`rounded-2xl border bg-card px-4 py-3 text-sm font-medium ${!checkIn || !checkOut ? "border-border text-muted-foreground" : availabilityLoading || availabilityRangeKey !== selectedRangeKey ? "border-border text-muted-foreground" : effectiveAvailability?.isBookable ? "border-primary/20 text-primary" : "border-destructive/20 text-destructive"}`}>
          {!checkIn || !checkOut ? "Choose your check-in and check-out dates first." : availabilityLoading || availabilityRangeKey !== selectedRangeKey ? "Checking room availability..." : effectiveAvailability?.isBookable ? "Selected dates are available." : "Selected dates are currently unavailable."}
        </div>
        <Button variant="palmPrimary" onClick={handleBooking} disabled={bookingLoading || availabilityLoading || !effectiveAvailability?.isBookable || availabilityRangeKey !== selectedRangeKey} className="h-12 w-full rounded-xl">
          {bookingLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Processing...</> : cartItem ? "Update Booking In Cart" : "Add Booking To Cart"}
        </Button>
      </div>
    </aside>
  );
}

export function SimilarRoomsSection({ similarRooms, listLoading }) {
  return (
    <section className="mb-10 mt-0">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Similar Rooms</h2>
          <p className="mt-2 text-sm text-muted-foreground">Real rooms from your inventory, linked to their live pages.</p>
        </div>
        <Button asChild variant="palmSecondary" className="hidden sm:inline-flex">
          <Link to="/rooms">Explore All Rooms<ChevronRight className="h-4 w-4" /></Link>
        </Button>
      </div>
      {listLoading && similarRooms.length === 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <div key={`similar-room-loading-${index}`} className="aspect-[4/5] rounded-[28px] border border-border bg-card" />)}</div>
      ) : similarRooms.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent className="-ml-6">
            {similarRooms.map((similarRoom) => (
              <CarouselItem key={similarRoom._id || similarRoom.id || similarRoom.roomNumber} className="pl-6 md:basis-1/2 xl:basis-1/3">
                <RoomCard room={similarRoom} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-end gap-3">
            <CarouselPrevious className="static translate-y-0 cursor-pointer border border-primary text-primary shadow-none hover:bg-primary hover:text-white" />
            <CarouselNext className="static translate-y-0 cursor-pointer border border-primary text-primary shadow-none hover:bg-primary hover:text-white" />
          </div>
        </Carousel>
      ) : (
        <div className="rounded-[28px] border border-dashed border-border bg-card p-8 text-center"><p className="text-sm text-muted-foreground">No additional rooms are available to suggest right now.</p></div>
      )}
    </section>
  );
}
