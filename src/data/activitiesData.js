// ── Activities Page Data ─────────────────────────────────────────────────

export const ACTIVITY_CATEGORIES = [
  { id: "nile", label: "Nile River Adventures", icon: "Ship" },
  { id: "heritage", label: "Ancient Heritage Tours", icon: "Landmark" },
  { id: "desert", label: "Desert Safari & Adventures", icon: "Mountain" },
  { id: "cultural", label: "Cultural Experiences", icon: "Palette" },
  { id: "balloon", label: "Balloon Rides", icon: "CloudSun" },
  { id: "culinary", label: "Culinary Journeys", icon: "ChefHat" },
];

export const ACTIVITIES_DATA = [
  {
    id: "nile-cruise",
    category: "nile",
    label: "BEYOND THE BANKS",
    title: "Luxury Nile River Cruise",
    description:
      "Sail the eternal waters of the Nile on a traditional Felucca or embark on a luxury sunset cruise. Experience the lifeblood of Egypt from a unique perspective, enjoying the refreshing breeze and the breathtaking landscape of the West Bank as golden light paints the ancient monuments.",
    image:
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1200&auto=format",
    stats: [
      { value: "25+", label: "VESSELS" },
      { value: "10km", label: "RIVERFRONT" },
      { value: "DAILY", label: "SUNSET CRUISES" },
    ],
    highlights: [
      "Private felucca sunset sail",
      "Luxury dinner cruise with live music",
      "Sunrise photography tour",
      "Traditional fishing experience",
    ],
    icon: "Ship",
  },
  {
    id: "heritage-tours",
    category: "heritage",
    label: "WALK THROUGH HISTORY",
    title: "Ancient Heritage Tours",
    description:
      "Explore the world's greatest open-air museum. From the massive pillars of Karnak Temple to the hidden secrets of the Valley of the Kings, our expert-led guided tours offer deep insights into the 3,000-year-old Pharaonic civilization that shaped human history.",
    image:
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1200&auto=format",
    stats: [
      { value: "15+", label: "TEMPLES" },
      { value: "60+", label: "ROYAL TOMBS" },
      { value: "3000+", label: "YEARS OF HISTORY" },
    ],
    highlights: [
      "Exclusive Karnak Temple access at dawn",
      "Private Valley of the Kings tour",
      "Luxor Temple illuminated night visit",
      "Egyptologist-led guided explorations",
    ],
    icon: "Landmark",
  },
  {
    id: "desert-safari",
    category: "desert",
    label: "INTO THE GOLDEN SANDS",
    title: "Desert Safari & Adventures",
    description:
      "Venture beyond the green valley into the vast Western Desert. Experience thrilling quad biking across golden dunes, visit remote Bedouin camps under a canopy of stars, and discover the raw beauty of the Saharan landscape that borders ancient Thebes.",
    image:
      "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1200&auto=format",
    stats: [
      { value: "4x4", label: "SAFARI VEHICLES" },
      { value: "∞", label: "STARGAZING" },
      { value: "DAILY", label: "DEPARTURES" },
    ],
    highlights: [
      "Quad biking across golden dunes",
      "Bedouin camp dinner under the stars",
      "Camel caravan sunset trek",
      "Desert stargazing with astronomy guide",
    ],
    icon: "Mountain",
  },
  {
    id: "cultural-experiences",
    category: "cultural",
    label: "IMMERSE IN TRADITION",
    title: "Cultural Experiences",
    description:
      "Immerse yourself in the living culture of Upper Egypt. From traditional pottery workshops in Qurna village to mesmerizing Sufi dance performances, discover the authentic customs and artistic heritage that have been passed down through generations of Luxor's people.",
    image:
      "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1200&auto=format",
    stats: [
      { value: "10+", label: "WORKSHOPS" },
      { value: "WEEKLY", label: "LIVE SHOWS" },
      { value: "100%", label: "AUTHENTIC" },
    ],
    highlights: [
      "Traditional pottery workshop",
      "Nubian village visit & local cuisine",
      "Sufi dance evening performance",
      "Hieroglyphic calligraphy masterclass",
    ],
    icon: "Palette",
  },
  {
    id: "balloon-rides",
    category: "balloon",
    label: "ABOVE THE ANCIENTS",
    title: "Hot Air Balloon Rides",
    description:
      "Soar above the Valley of the Kings at dawn and witness the most spectacular sunrise in the world. Float silently over ancient temples, emerald farmlands, and the shimmering Nile as the first light of day reveals the full grandeur of Luxor's timeless landscape.",
    image:
      "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1200&auto=format",
    stats: [
      { value: "1000ft", label: "ALTITUDE" },
      { value: "45min", label: "FLIGHT TIME" },
      { value: "SUNRISE", label: "DEPARTURE" },
    ],
    highlights: [
      "Sunrise flight over Valley of the Kings",
      "Panoramic Nile & temple views",
      "Professional aerial photography",
      "Champagne toast upon landing",
    ],
    icon: "CloudSun",
  },
  {
    id: "culinary-journeys",
    category: "culinary",
    label: "TASTE OF THE NILE",
    title: "Culinary Journeys",
    description:
      "Embark on a gastronomic adventure through the flavors of Upper Egypt. Join our chefs at the local spice markets, learn to prepare authentic Egyptian dishes in hands-on cooking classes, and enjoy exclusive farm-to-table dining experiences along the Nile.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format",
    stats: [
      { value: "5+", label: "CUISINES" },
      { value: "DAILY", label: "CLASSES" },
      { value: "FRESH", label: "LOCAL PRODUCE" },
    ],
    highlights: [
      "Luxor spice market guided tour",
      "Hands-on Egyptian cooking class",
      "Nile-side farm-to-table dinner",
      "Traditional bread-making workshop",
    ],
    icon: "ChefHat",
  },
];
