import { useEffect, useMemo, useState } from "react";

import { fetchRoomAvailability } from "@/services/roomsApi";

export function useRoomAvailability(roomId, checkIn, checkOut) {
  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityRangeKey, setAvailabilityRangeKey] = useState("");

  const selectedRangeKey = checkIn && checkOut ? `${checkIn}_${checkOut}` : "";

  useEffect(() => {
    if (!roomId) {
      setAvailability(null);
      setAvailabilityRangeKey("");
      return;
    }

    const loadAvailability = async () => {
      setAvailabilityLoading(true);
      const requestRangeKey = checkIn && checkOut ? `${checkIn}_${checkOut}` : "";

      try {
        const response = await fetchRoomAvailability(
          roomId,
          checkIn && checkOut ? { checkInDate: checkIn, checkOutDate: checkOut } : {},
        );

        setAvailability(response);
        setAvailabilityRangeKey(requestRangeKey);
      } catch {
        setAvailability(null);
        setAvailabilityRangeKey("");
      } finally {
        setAvailabilityLoading(false);
      }
    };

    void loadAvailability();
  }, [roomId, checkIn, checkOut]);

  const effectiveAvailability = useMemo(
    () => (!selectedRangeKey || availabilityRangeKey === selectedRangeKey ? availability : null),
    [availability, availabilityRangeKey, selectedRangeKey],
  );

  return {
    availability,
    availabilityLoading,
    availabilityRangeKey,
    effectiveAvailability,
    selectedRangeKey,
  };
}
