import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectBookingLoading } from "@/services/booking/bookingSlice";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { selectCartItemById, upsertRoomBooking } from "@/store/slices/cartSlice";
import { calculateNights, normalizeRoomForBooking } from "@/utils/roomBooking";
import { formatDate } from "@/utils/room-details/roomDetailUtils";
import { toast } from "react-toastify";

export function useRoomBooking(room, availabilityRef) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { flyToCart } = useFlyToCart();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const bookingLoading = useSelector(selectBookingLoading);
  const cartItem = useSelector((state) => selectCartItemById(state, room?.id));
  const [draftsByRoom, setDraftsByRoom] = useState({});
  const roomKey = room?.id || "pending-room";
  const roomDraft = draftsByRoom[roomKey];

  const checkIn = roomDraft?.checkIn ?? cartItem?.checkInDate ?? "";
  const checkOut = roomDraft?.checkOut ?? cartItem?.checkOutDate ?? "";
  const adults = roomDraft?.adults ?? String(cartItem?.adults ?? 1);
  const children = roomDraft?.children ?? String(cartItem?.children ?? 0);
  const roomsCount = roomDraft?.roomsCount ?? String(cartItem?.roomsCount ?? 1);
  const rangeSelectionStep = roomDraft?.rangeSelectionStep ?? "start";
  const selectedRangeKey = checkIn && checkOut ? `${checkIn}_${checkOut}` : "";

  const nights = useMemo(() => calculateNights(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = useMemo(
    () => (room?.price || 0) * Math.max(1, nights) * Math.max(1, Number(roomsCount || 1)),
    [room?.price, nights, roomsCount],
  );
  const total = subtotal;

  const datePickerState = useMemo(() => ({
    checkIn: checkIn ? new Date(`${checkIn}T00:00:00`) : null,
    checkOut: checkOut ? new Date(`${checkOut}T00:00:00`) : null,
  }), [checkIn, checkOut]);

  const updateRoomDraft = (patch) => {
    setDraftsByRoom((current) => ({
      ...current,
      [roomKey]: {
        ...(current[roomKey] || {}),
        ...patch,
      },
    }));
  };

  const handleDatePickerState = (updater) => {
    const currentState = {
      checkIn: checkIn ? new Date(`${checkIn}T00:00:00`) : null,
      checkOut: checkOut ? new Date(`${checkOut}T00:00:00`) : null,
    };
    const nextState = typeof updater === "function" ? updater(currentState) : updater;

    updateRoomDraft({
      checkIn: nextState?.checkIn ? formatDate(nextState.checkIn) : "",
      checkOut: nextState?.checkOut ? formatDate(nextState.checkOut) : "",
      rangeSelectionStep: nextState?.checkIn && !nextState?.checkOut ? "end" : "start",
    });
  };

  const handleBooking = (event) => {
    const {
      effectiveAvailability,
      availabilityLoading,
      availabilityRangeKey,
      selectedRangeKey: currentSelectedRangeKey,
    } = availabilityRef?.current || {};

    if (!isAuthenticated) {
      toast.info("Please sign in first to book this room.");
      return;
    }
    if (availabilityLoading) {
      toast.info("Checking room availability. Please wait a moment.");
      return;
    }
    if (!effectiveAvailability || availabilityRangeKey !== currentSelectedRangeKey) {
      toast.error("Room availability has not been confirmed for these dates yet.");
      return;
    }
    if (!effectiveAvailability?.isBookable) {
      toast.error("This room is not available for the selected dates.");
      return;
    }

    dispatch(upsertRoomBooking({
      room: normalizeRoomForBooking({
        ...room,
        roomName: room.name,
        roomType: room.type,
        images: room.images,
        capacity: room.adults,
      }),
      bookingDraft: {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults,
        children,
        roomsCount,
        nights,
        availabilityStatus: "available",
        availabilityCheckedAt: new Date().toISOString(),
      },
    }));

    flyToCart(event.currentTarget);
    toast.success(cartItem ? "Room booking updated in cart." : "Room added to cart.");
    navigate("/cart");
  };

  return {
    cartItem,
    checkIn,
    checkOut,
    adults,
    children,
    roomsCount,
    nights,
    subtotal,
    total,
    selectedRangeKey,
    rangeSelectionStep,
    datePickerState,
    bookingLoading,
    handleDatePickerState,
    handleBooking,
    setAdults: (value) => updateRoomDraft({ adults: value }),
    setChildren: (value) => updateRoomDraft({ children: value }),
    setRoomsCount: (value) => updateRoomDraft({ roomsCount: value }),
    setRangeSelectionStep: (value) => updateRoomDraft({ rangeSelectionStep: value }),
  };
}
