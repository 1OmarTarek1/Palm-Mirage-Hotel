const normalizeAmenities = (source) =>
  (source || [])
    .map((item) => {
      if (typeof item === "string") return { name: item, icon: item, description: "" };
      if (item && typeof item === "object") {
        return {
          name: item.name || item.label || "Amenity",
          icon: item.icon || item.name || "default",
          description: item.description || "",
        };
      }
      return null;
    })
    .filter(Boolean);

export function buildRoomModel(apiRoom, fallbackId) {
  if (!apiRoom) return null;

  const get = (key, fallback) =>
    apiRoom[key] ?? apiRoom.room?.[key] ?? apiRoom._doc?.[key] ?? apiRoom.data?.[key] ?? fallback;

  const rawImages = get("roomImages", get("images", []));
  const images = Array.isArray(rawImages)
    ? rawImages
        .map((img) => img?.secure_url || img?.url || (typeof img === "string" ? img : ""))
        .filter(Boolean)
    : [];

  return {
    id: get("_id", get("id", fallbackId)),
    name: get("roomName", get("name", "Luxury Room")),
    type: get("roomType", get("type", "room")),
    price: Number(get("finalPrice", get("price", 0))),
    basePrice: Number(get("price", 0)),
    discount: Number(get("discount", 0)),
    hasOffer: Boolean(get("hasOffer", get("discount", 0))),
    rating: Number(get("rating", 0)),
    reviewsCount: Number(get("reviewsCount", 0)),
    beds: Number(get("beds", 1)),
    bedType: get("bedType", "King Bed"),
    size: Number(get("size", 45)),
    adults: Number(get("guests", get("capacity", 2))),
    viewsCount: Number(get("viewsCount", 0)),
    floor: Number(get("floor", 0)),
    description: get("description", "No room description available yet."),
    checkInTime: get("checkInTime", "14:00"),
    checkOutTime: get("checkOutTime", "12:00"),
    cancellationPolicy: get("cancellationPolicy", ""),
    amenities: normalizeAmenities(
      get("amenities", get("facilities", [])),
    ),
    images,
  };
}

export { normalizeAmenities };
