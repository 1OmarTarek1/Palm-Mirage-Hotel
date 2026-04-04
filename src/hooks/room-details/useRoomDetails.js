import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { clearRoom, fetchAllRooms, fetchRoomById, selectListLoading, selectRoom, selectRoomError, selectRoomLoading, selectRooms } from "@/services/rooms/roomsSlice";
import { useRoomAvailability } from "@/hooks/room-details/useRoomAvailability";
import { useRoomBooking } from "@/hooks/room-details/useRoomBooking";
import { buildRoomModel } from "@/utils/room-details/buildRoomModel";
import { computeAmenityCollections, computeReviewBars, computeSimilarRooms } from "@/utils/room-details/roomDetailUtils";

export function useRoomDetails(id) {
  const dispatch = useDispatch();
  const apiRoom = useSelector(selectRoom);
  const rooms = useSelector(selectRooms);
  const roomLoading = useSelector(selectRoomLoading);
  const listLoading = useSelector(selectListLoading);
  const error = useSelector(selectRoomError);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const availabilityRef = useRef(null);

  const room = useMemo(() => buildRoomModel(apiRoom, id), [apiRoom, id]);

  useEffect(() => {
    if (!id) return;

    dispatch(fetchRoomById(id));
    if (!rooms.length) dispatch(fetchAllRooms());

    return () => dispatch(clearRoom());
  }, [dispatch, id, rooms.length]);

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
