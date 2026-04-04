import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import { RoomDetailsPageSkeleton } from "@/components/common/loading/WebsiteSkeletons";
import {
  AmenitiesSection,
  AvailabilitySection,
  BookingSidebar,
  FAQSection,
  PoliciesSection,
  ReviewsSection,
  RoomHeroGallery,
  RoomOverviewSection,
  SimilarRoomsSection,
} from "@/components/rooms/details/RoomDetailsSections";
import { SectionDivider } from "@/components/rooms/details/SectionDivider";
import { RoomErrorState, RoomNotFound } from "@/components/rooms/details/RoomDetailsStates";
import { useRoomDetails } from "@/hooks/room-details/useRoomDetails";

const MotionDiv = motion.div;

export default function RoomDetails() {
  const { id } = useParams();
  const {
    room,
    loading,
    error,
    similarRooms,
    listLoading,
    amenityCollections,
    reviewBars,
    openFaqIndex,
    setOpenFaqIndex,
    availability,
    availabilityLoading,
    availabilityRangeKey,
    effectiveAvailability,
    selectedRangeKey,
    cartItem,
    checkIn,
    checkOut,
    adults,
    children,
    roomsCount,
    nights,
    subtotal,
    total,
    rangeSelectionStep,
    datePickerState,
    bookingLoading,
    handleDatePickerState,
    handleBooking,
    setAdults,
    setChildren,
    setRoomsCount,
    setRangeSelectionStep,
  } = useRoomDetails(id);

  if (loading) return <RoomDetailsPageSkeleton />;
  if (error) return <RoomErrorState error={error} />;
  if (!room) return <RoomNotFound />;

  return (
    <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen text-foreground">
      <div className="container pb-10 font-main">
        <MotionDiv initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.45 }} className="mb-10">
          <RoomHeroGallery room={room} />
        </MotionDiv>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.9fr)]">
          <div className="space-y-10">
            <RoomOverviewSection room={room} />
            <SectionDivider />
            <AmenitiesSection amenityCollections={amenityCollections} />
            <SectionDivider />
            <AvailabilitySection
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              availability={availability}
              availabilityLoading={availabilityLoading}
              availabilityRangeKey={availabilityRangeKey}
              selectedRangeKey={selectedRangeKey}
              effectiveAvailability={effectiveAvailability}
              datePickerState={datePickerState}
              handleDatePickerState={handleDatePickerState}
            />
            <SectionDivider />
            <PoliciesSection />
            <SectionDivider />
            <FAQSection openFaqIndex={openFaqIndex} setOpenFaqIndex={setOpenFaqIndex} />
            <SectionDivider />
            <ReviewsSection room={room} reviewBars={reviewBars} />
          </div>

          <BookingSidebar
            room={room}
            cartItem={cartItem}
            checkIn={checkIn}
            checkOut={checkOut}
            adults={adults}
            setAdults={setAdults}
            children={children}
            setChildren={setChildren}
            roomsCount={roomsCount}
            setRoomsCount={setRoomsCount}
            rangeSelectionStep={rangeSelectionStep}
            setRangeSelectionStep={setRangeSelectionStep}
            subtotal={subtotal}
            total={total}
            availabilityLoading={availabilityLoading}
            effectiveAvailability={effectiveAvailability}
            availabilityRangeKey={availabilityRangeKey}
            selectedRangeKey={selectedRangeKey}
            bookingLoading={bookingLoading}
            handleBooking={handleBooking}
          />
        </div>

        <SectionDivider className="my-20" />
        <SimilarRoomsSection similarRooms={similarRooms} listLoading={listLoading} />
      </div>
    </MotionDiv>
  );
}
