const MAX_KEYS = 48;
const MAX_QTY = 99;

export function sanitizeRestaurantMenuCart(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    if (Object.keys(out).length >= MAX_KEYS) break;
    const id = String(k).trim();
    if (!id || id.length > 32) continue;
    const qty = Math.floor(Number(v));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) continue;
    out[id] = qty;
  }
  return out;
}

export function mergeRestaurantMenuCarts(server = {}, local = {}) {
  const merged = { ...sanitizeRestaurantMenuCart(server) };
  const right = sanitizeRestaurantMenuCart(local);
  for (const [id, qty] of Object.entries(right)) {
    merged[id] = Math.min(MAX_QTY, (merged[id] ?? 0) + qty);
  }
  return sanitizeRestaurantMenuCart(merged);
}

export function restaurantMenuCartTotalQty(map) {
  const m = sanitizeRestaurantMenuCart(map);
  return Object.values(m).reduce((s, q) => s + (typeof q === "number" ? q : 0), 0);
}
