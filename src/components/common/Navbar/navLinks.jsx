import {
  Home,
  BedSingle,
  ConciergeBell,
  // change this links for demo
  // Palmtree,
  // Gem,
  Waves,
  Utensils,
  Bell,
  Dumbbell,
  CalendarDays,
  ShoppingBag,
  Palmtree,
  // change this links for demo
  ShieldCheck ,
  MessageCircleMore,    
  Heater
} from "lucide-react";

export const AUTH_PATHS = {
  login: "/auth/login",
};

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
      description:
        "Experience the ultimate luxury and comfort with our wide range of services.",
      featuredImage:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      promotion: {
        title: "Quick Escape, Quality Time",
        subtitle: "Save up to 20% with a Getaway Deal",
        href: "/services",
      },
      //change this links for demo
      links: [
        {
          label: "Restaurant",
          href: "/services/restaurant",
          description: "Savor exquisite cuisines from around the world.",
          icon: <Utensils size={20} />,
        },
        {
          label: "Wellness & Fitness",
          href: "/services/wellness",
          description: "Stay active with our top-tier facilities.",
          icon: <Dumbbell size={20} />,
        },
        {
          label: "Menu",
          href: "/services/menu",
          description: "Personalized assistance for all your needs.",
          icon: <Heater size={20} />,
        },
        // {
        //   label: "Relax",
        //   href: "/services/spa",
        //   description: "Relax and rejuvenate your body and mind.",
        //   icon: <Waves size={20} />,
        // },
        {
          label: "Events, Meetings",
          href: "/services/Meetings",
          description: "Host memorable events in stunning spaces.",
          icon: <CalendarDays size={20} />,
        },
        {
          label: "Activities & Experiences",
          href: "/services/activities",
          description: "Explore adventures and cultural experiences in Luxor.",
          icon: <Palmtree size={20} />,
        },
        // {
        //   label: "Our Products",
        //   href: "/services/room-service",
        //   description: "Curated luxury products for your stay.",
        //   icon: <ShoppingBag size={20} />,
        // },
      ],
    },
  },
  //change this links for demo
  {
    label: "About Us",
    href: "/about",
    icon: <ShieldCheck size={20} />,
  },
  // {
  //   label: "Activities",
  //   href: "/activities",
  //   icon: <Palmtree size={20} />,
  //   dropdown: [
  //     { label: "Winter Sports", href: "/activities/winter" },
  //     { label: "Mountain Hiking", href: "/activities/hiking" },
  //     { label: "Spa & Wellness", href: "/activities/spa" },
  //     { label: "Local Tours", href: "/activities/tours" },
  //   ]
  // },
  // {
  //   label: "Features",
  //   href: "/features",
  //   icon: <Gem size={20} />,
  //   dropdown: [
  //     { label: "About Us", href: "/about" },
  //     { label: "Contact Us", href: "/contact" },
  //   ],
  // },
    {
    label: "Contact Us",
    href: "/contact",
    icon: <MessageCircleMore  size={20} />,
  },
];
