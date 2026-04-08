function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseBookingDateValue(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function formatBookingDate(value) {
  if (!value) return "";

  const date = parseBookingDateValue(value);
  if (!date) return "";

  return toLocalDateKey(date);
}

export function formatBookingDateLabel(value) {
  const normalized = formatBookingDate(value);
  if (!normalized) return "Not selected";

  const date = new Date(`${normalized}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calculateNights(checkInDate, checkOutDate) {
  const start = parseBookingDateValue(checkInDate);
  const end = parseBookingDateValue(checkOutDate);

  if (!start || !end || end <= start) {
    return 0;
  }

  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
}

export function doesDateRangeOverlap(rangeA, rangeB) {
  if (!rangeA?.start || !rangeA?.end || !rangeB?.start || !rangeB?.end) return false;

  const startA = parseBookingDateValue(rangeA.start);
  const endA = parseBookingDateValue(rangeA.end);
  const startB = parseBookingDateValue(rangeB.start);
  const endB = parseBookingDateValue(rangeB.end);

  if (!startA || !endA || !startB || !endB) {
    return false;
  }

  return startA < endB && endA > startB;
}

export function buildBookedDateLabels(bookedRanges = []) {
  return bookedRanges.map((range, index) => ({
    id: `${formatBookingDate(range.checkInDate)}-${formatBookingDate(range.checkOutDate)}-${index}`,
    label: `${formatBookingDateLabel(range.checkInDate)} - ${formatBookingDateLabel(range.checkOutDate)}`,
    status: range.status || "confirmed",
  }));
}

export function normalizeRoomForBooking(room) {
  if (!room) return null;

  const roomId = room._id || room.id || room.room?._id || room.roomId || room.roomNumber;
  const roomName = room.roomName || room.name || room.room?.roomName || "Room";
  const roomType = room.roomType || room.type || room.room?.roomType || "Room";
  const rawNo = room.roomNumber ?? room.room?.roomNumber;
  const roomNumber =
    rawNo !== undefined && rawNo !== null && String(rawNo).trim() !== "" ? String(rawNo).trim() : null;
  const capacity = Number(room.capacity || room.guests || room.room?.capacity || 1);
  const basePrice = Number(room.finalPrice || room.price || room.room?.price || 0);

  const rawImages =
    room.roomImages ||
    room.images ||
    room.room?.roomImages ||
    room.room?.images ||
    [];

  const images = Array.isArray(rawImages)
    ? rawImages
        .map((item) => (typeof item === "string" ? item : item?.secure_url || item?.url || ""))
        .filter(Boolean)
    : [];

  return {
    id: roomId,
    roomId,
    name: roomName,
    roomName,
    roomNumber,
    category: roomType,
    roomType,
    price: basePrice,
    image: images[0] || room.image || room.room?.image || "",
    images,
    guests: capacity,
    quantity: 1,
  };
}

export function buildCartBookingItem(room, bookingDraft = {}) {
  const normalizedRoom = normalizeRoomForBooking(room);
  if (!normalizedRoom) return null;

  const checkInDate = formatBookingDate(bookingDraft.checkInDate);
  const checkOutDate = formatBookingDate(bookingDraft.checkOutDate);
  const adults = Math.max(1, Number(bookingDraft.adults || bookingDraft.guests || 1));
  const children = Math.max(0, Number(bookingDraft.children || 0));
  const roomsCount = Math.max(1, Number(bookingDraft.roomsCount || 1));
  const nights = calculateNights(checkInDate, checkOutDate);

  return {
    ...normalizedRoom,
    quantity: 1,
    checkInDate,
    checkOutDate,
    adults,
    children,
    guests: adults + children,
    roomsCount,
    nights,
    availabilityCheckedAt: bookingDraft.availabilityCheckedAt || new Date().toISOString(),
    availabilityStatus: bookingDraft.availabilityStatus || "unknown",
  };
}

export function calculateCartItemTotal(item) {
  const nights = Math.max(1, Number(item?.nights || 1));
  const roomsCount = Math.max(1, Number(item?.roomsCount || item?.quantity || 1));
  const nightlyRate = Number(item?.price || 0);
  return nightlyRate * nights * roomsCount;
}

export function isCartItemReady(item) {
  const hasValidDates = Boolean(item?.checkInDate && item?.checkOutDate);
  const nights = calculateNights(item?.checkInDate, item?.checkOutDate);
  const statusOk = !item?.availabilityStatus || item?.availabilityStatus !== "unavailable";
  return hasValidDates && nights > 0 && statusOk;
}
