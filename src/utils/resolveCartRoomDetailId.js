const MONGO_OBJECT_ID_RE = /^[a-f\d]{24}$/i;

/** Room id for `/rooms/:id` when cart item stores a valid Mongo ObjectId. */
export function resolveCartRoomDetailId(item) {
  const raw = item?.id ?? item?._id ?? item?.roomId;
  if (raw == null) return null;
  const s = String(raw).trim();
  return MONGO_OBJECT_ID_RE.test(s) ? s : null;
}
