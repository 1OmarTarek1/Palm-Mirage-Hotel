import { ROOM_AMENITIES, ROOM_BATHROOM, ROOM_FEATURES } from "@/utils/constants";

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function computeSimilarRooms(room, rooms) {
  if (!room || !rooms.length) return [];

  const candidates = rooms.filter((candidate) => (candidate._id || candidate.id) !== room.id);
  const sameType = candidates.filter(
    (candidate) => String(candidate.roomType || candidate.type || "").toLowerCase() === String(room.type).toLowerCase(),
  );

  return (sameType.length ? sameType : candidates).slice(0, 3);
}

export function computeReviewBars(rating, reviewsCount) {
  const totalReviews = Number(reviewsCount || 0);
  const weightedBase = Math.max(totalReviews, rating > 0 ? 1 : 0);

  return [5, 4, 3, 2, 1].map((stars) => {
    let count = 0;

    if (totalReviews > 0) {
      if (stars === 5) count = Math.round(weightedBase * 0.58);
      if (stars === 4) count = Math.round(weightedBase * 0.27);
      if (stars === 3) count = Math.round(weightedBase * 0.1);
      if (stars === 2) count = Math.round(weightedBase * 0.03);
      if (stars === 1) count = Math.round(weightedBase * 0.02);
    }

    const percentage = totalReviews > 0 ? Math.max(0, Math.min(100, (count / totalReviews) * 100)) : 0;
    return { stars, count, percentage };
  });
}

export function computeAmenityCollections(roomAmenities) {
  const serviceAmenities = [...ROOM_AMENITIES];
  const roomFeatures = [...ROOM_FEATURES];
  const bathroomFeatures = [...ROOM_BATHROOM];

  (roomAmenities || []).forEach((amenity) => {
    if (!serviceAmenities.some((item) => item.label.toLowerCase() === amenity.name.toLowerCase())) {
      serviceAmenities.push({
        iconName: amenity.icon || "CheckCircle2",
        label: amenity.name,
      });
    }
  });

  return { serviceAmenities, roomFeatures, bathroomFeatures };
}
