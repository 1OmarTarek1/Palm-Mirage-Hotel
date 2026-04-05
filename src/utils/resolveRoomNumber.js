/**
 * Extract a displayable room number from API, cart, wishlist, or booking payloads.
 */
export function resolveRoomNumber(source) {
  if (source == null) return null;
  const n = source.roomNumber ?? source?.room?.roomNumber;
  if (n === undefined || n === null) return null;
  const str = String(n).trim();
  return str.length > 0 ? str : null;
}
