import {
  Home,
  BedSingle,
  ConciergeBell,
  Palmtree,
  Gem,
  Waves,
  Utensils,
  Bell,
  Dumbbell,
  CalendarDays,
  ShoppingBag,
} from "lucide-react";

export const navLinks = [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  {
    label: "Rooms",
    href: "/rooms",
    icon: <BedSingle size={20} />,
  },
  {
    label: "Services",
    href: "/services",
    icon: <ConciergeBell size={20} />,
    megaMenu: {
      title: "Our Premium Services",
      description: "Experience the ultimate luxury and comfort with our wide range of services.",
      featuredImage: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      promotion: {
        title: "Quick Escape, Quality Time",
        subtitle: "Save up to 20% with a Getaway Deal",
        href: "/services",
      },
      links: [
        {
          label: "Relax",
          href: "/services/spa",
          description: "Relax and rejuvenate your body and mind.",
          icon: <Waves size={20} />,
        },
        {
          label: "Wellness & Fitness",
          href: "/services/wellness",
          description: "Stay active with our top-tier facilities.",
          icon: <Dumbbell size={20} />,
        },
        {
          label: "Restaurant",
          href: "/services/restaurant",
          description: "Savor exquisite cuisines from around the world.",
          icon: <Utensils size={20} />,
        },
        {
          label: "Events, Meetings",
          href: "/services/events",
          description: "Host memorable events in stunning spaces.",
          icon: <CalendarDays size={20} />,
        },
        {
          label: "Amenities",
          href: "/services/concierge",
          description: "Personalized assistance for all your needs.",
          icon: <Bell size={20} />,
        },
        {
          label: "Our Products",
          href: "/services/room-service",
          description: "Curated luxury products for your stay.",
          icon: <ShoppingBag size={20} />,
        },
      ],
    },
  },
  {
    label: "Activities",
    href: "/activities",
    icon: <Palmtree size={20} />,
    dropdown: [
      { label: "Winter Sports", href: "/activities/winter" },
      { label: "Mountain Hiking", href: "/activities/hiking" },
      { label: "Spa & Wellness", href: "/activities/spa" },
      { label: "Local Tours", href: "/activities/tours" },
    ],
  },
  {
    label: "Features",
    href: "/features",
    icon: <Gem size={20} />,
    dropdown: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];
