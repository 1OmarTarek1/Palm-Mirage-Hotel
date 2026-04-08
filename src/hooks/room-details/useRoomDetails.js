import { useMemo, useRef, useState, useEffect } from "react";

import { useRoomDetailQuery, useRoomsListQuery } from "@/hooks/useCatalogQueries";
import { useRoomAvailability } from "@/hooks/room-details/useRoomAvailability";
import { useRoomBooking } from "@/hooks/room-details/useRoomBooking";
import { buildRoomModel } from "@/utils/room-details/buildRoomModel";
import { computeAmenityCollections, computeReviewBars, computeSimilarRooms } from "@/utils/room-details/roomDetailUtils";

export function useRoomDetails(id) {
  const {
    data: apiRoom,
    isLoading: roomLoading,
    error: roomErrorObj,
  } = useRoomDetailQuery(id);
  const {
    data: listPayload,
    isLoading: listLoading,
  } = useRoomsListQuery({ page: 1, limit: 20 });
  const rooms = listPayload?.rooms ?? [];

  const error = roomErrorObj ? roomErrorObj.message || "Room not found" : null;
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const availabilityRef = useRef(null);

  const room = useMemo(() => buildRoomModel(apiRoom, id), [apiRoom, id]);

  const booking = useRoomBooking(room, availabilityRef);
  const availabilityState = useRoomAvailability(room?.id, booking.checkIn, booking.checkOut);

  useEffect(() => {
    availabilityRef.current = availabilityState;
  }, [availabilityState]);

  const similarRooms = useMemo(() => computeSimilarRooms(room, rooms), [room, rooms]);
  const amenityCollections = useMemo(() => computeAmenityCollections(room?.amenities), [room?.amenities]);
  const reviewBars = useMemo(() => computeReviewBars(room?.rating, room?.reviewsCount), [room?.rating, room?.reviewsCount]);

  return {
    room,
    loading: roomLoading,
    error,
    listLoading,
    openFaqIndex,
    setOpenFaqIndex,
    similarRooms,
    amenityCollections,
    reviewBars,
    ...availabilityState,
    ...booking,
  };
}
