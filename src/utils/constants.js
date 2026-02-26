export const CALENDAR_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const MOCK_ROOM_DATA = {
  id: 1,
  name: "Alpine King Deluxe",
  type: "DELUXE ROOM",
  price: 180,
  rating: 4.8,
  beds: 1,
  bedType: "King Bed",
  size: 50,
  adults: 2,
  description:
    "Experience the pinnacle of alpine luxury in our Alpine King Deluxe room. Perched high in the mountains, this exquisite retreat offers breathtaking panoramic views of snow-capped peaks and pristine valleys. The room features floor-to-ceiling windows that frame the spectacular scenery, a plush king-sized bed with premium linens, and a private balcony where you can sip your morning coffee while watching the sunrise paint the mountains in golden hues.",
  images: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop",
  ],
};

export const ROOM_AMENITIES = [
  { iconName: "Wifi", label: "Free Wi-Fi" },
  { iconName: "Waves", label: "Swimming Pool" },
  { iconName: "Dumbbell", label: "Fitness Center" },
  { iconName: "Car", label: "Free Parking" },
  { iconName: "Coffee", label: "Breakfast Included" },
  { iconName: "Utensils", label: "Restaurant" },
  { iconName: "Ban", label: "Non-Smoking" },
  { iconName: "Umbrella", label: "Concierge" },
  { iconName: "Wind", label: "Air Conditioning" },
];

export const ROOM_FEATURES = [
  { iconName: "Bed", label: "King-size Bed" },
  { iconName: "Tv", label: "Smart TV" },
  { iconName: "Lock", label: "Electronic Safe" },
  { iconName: "GlassWater", label: "Minibar" },
  { iconName: "Phone", label: "Direct Phone" },
  { iconName: "Monitor", label: "Work Desk" },
  { iconName: "Refrigerator", label: "Refrigerator" },
  { iconName: "Usb", label: "USB Charging" },
  { iconName: "Gift", label: "Welcome Amenities" },
  { iconName: "Table", label: "Sitting Area" },
  { iconName: "CheckCircle2", label: "Daily Housekeeping" },
];

export const ROOM_BATHROOM = [
  { iconName: "Bath", label: "Bathtub" },
  { iconName: "Droplets", label: "Rainfall Shower" },
  { iconName: "Shirt", label: "Bathrobes" },
  { iconName: "Footprints", label: "Slippers" },
  { iconName: "GlassWater", label: "Toiletries" },
];

export const BOOKING_POLICIES = [
  {
    icon: "✓",
    title: "Check-in / Check-out",
    type: "text",
    content: "Check-in: from 3:00 PM\nCheck-out: until 12:00 PM\n\nEarly check-in and late check-out are subject to availability and may incur additional charges.",
  },
  {
    icon: "↩",
    title: "Cancellation Policy",
    type: "list",
    items: [
      "Free cancellation up to 48 hours before check-in.",
      "Cancellations within 48 hours will be charged one night's stay.",
      "No-shows will be charged the full reservation amount.",
    ],
  },
  {
    icon: "⚑",
    title: "House Rules",
    type: "house-rules",
    items: [
      "No smoking inside the room or on the balcony.",
      "Pets are not allowed.",
      "Parties or events are not permitted.",
      "Quiet hours: 10:00 PM – 8:00 AM.",
    ],
    note: "Violation of house rules may result in additional charges.",
  },
  {
    icon: "$",
    title: "Payment",
    type: "text",
    content: "We accept all major credit cards, debit cards, and online payment methods. Full payment is required at the time of booking.",
  },
];

export const ROOM_FAQS = [
  {
    question: "Is breakfast included in the room rate?",
    answer: "Yes, our Alpine King Deluxe room includes a complimentary full breakfast for two guests served at our mountain-view restaurant from 7:00 AM to 10:30 AM.",
  },
  {
    question: "Do you offer airport transfers?",
    answer: "Yes, we offer private airport transfer services. Please contact our concierge team at least 24 hours in advance to arrange your transfer.",
  },
  {
    question: "Is there parking available?",
    answer: "Complimentary covered parking is available for all guests on a first-come, first-served basis. Valet parking is also available for an additional fee.",
  },
  {
    question: "Can I request a late checkout?",
    answer: "Late checkout until 2:00 PM can be requested and is subject to availability. Please contact the front desk on the morning of your departure.",
  },
  {
    question: "Are pets allowed?",
    answer: "Unfortunately, we do not allow pets in our rooms. However, we can recommend nearby pet-friendly accommodations if needed.",
  },
];

export const SIMILAR_ROOMS = [
  {
    id: 2,
    name: "Twin Peaks Tower",
    category: "DELUXE ROOM",
    price: 160,
    size: 60,
    adults: 2,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Mountain View Suite",
    category: "SUITE",
    price: 280,
    size: 90,
    adults: 3,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Forest Retreat",
    category: "JUNIOR SUITE",
    price: 220,
    size: 75,
    adults: 2,
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1470&auto=format&fit=crop",
  },
];

export const TRUSTED_PARTNERS = [
  {
    name: "Booking.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/320px-Booking.com_logo.svg.png",
    rounded: false,
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/320px-Airbnb_Logo_B%C3%A9lo.svg.png",
    rounded: true,
  },
  {
    name: "Expedia",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Expedia_2012_logo.svg/320px-Expedia_2012_logo.svg.png",
    rounded: true,
  },
];

export const DUMMY_ROOMS = [
  {
    id: 1,
    type: "DELUXE ROOM",
    name: "Alpine King Deluxe",
    price: 180,
    beds: 1,
    size: 50,
    guests: 1,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "DELUXE ROOM",
    name: "Twin Peaks Tower",
    price: 160,
    beds: 1,
    size: 60,
    guests: 1,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "SUITE",
    name: "Mountain View Suite",
    price: 280,
    beds: 2,
    size: 90,
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "JUNIOR SUITE",
    name: "Forest Retreat",
    price: 220,
    beds: 1,
    size: 75,
    guests: 2,
    image:
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 5,
    type: "PENTHOUSE",
    name: "Summit Penthouse",
    price: 450,
    beds: 3,
    size: 150,
    guests: 4,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1470&auto=format&fit=crop",
  },
];
export const MEETINGS_HERO_IMAGE =
  "https://sailing.thimpress.com/demo-mountain-hotel/wp-content/uploads/sites/27/2025/06/58c6981fd8826441d3b9cbef2ee5c60b0c3485ef-scaled.jpg";

export const MEETINGS_CAROUSEL_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1470&auto=format&fit=crop",
    alt: "Conference room with blue chairs",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1469&auto=format&fit=crop",
    alt: "Meeting room with projector screen",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1469&auto=format&fit=crop",
    alt: "Boardroom setup",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1470&auto=format&fit=crop",
    alt: "Conference presentation hall",
  },
];

export const MEETINGS_AMENITIES = [
  {
    id: "wifi",
    title: "High-Speed Wi-Fi",
    desc: "Seamless internet connection for presentations, video calls, and real-time collaboration.",
  },
  {
    id: "projector",
    title: "Projector & Screen",
    desc: "High-definition projection system for impactful visual presentations.",
  },
  {
    id: "audio",
    title: "Microphone & Sound System",
    desc: "Clear audio support for speeches, hybrid meetings, and larger audiences.",
  },
  {
    id: "catering",
    title: "On-Site Catering",
    desc: "Coffee breaks, lunch, or full-service dining tailored to your event schedule.",
  },
];

export const EVENT_TYPES = [
  "Meeting",
  "Conference",
  "Wedding",
  "Private Party",
  "Other",
];

export const GUEST_COUNT_OPTIONS = [
  "Less than 20",
  "20 - 50",
  "50 - 100",
  "100+",
];
