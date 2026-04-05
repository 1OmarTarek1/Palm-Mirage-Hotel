import { Calendar, Clock3, ShoppingBag, ShoppingCart, Ticket, User, UtensilsCrossed } from "lucide-react";

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      type: "spring",
      stiffness: 170,
      damping: 20,
    },
  }),
};

export const resolveImage = (item) => {
  if (typeof item?.image === "string" && item.image) return item.image;
  if (typeof item?.image?.secure_url === "string" && item.image.secure_url) {
    return item.image.secure_url;
  }
  if (typeof item?.image?.url === "string" && item.image.url) {
    return item.image.url;
  }

  const imageCollections = [
    item?.roomImages,
    item?.images,
    item?.room?.roomImages,
    item?.room?.images,
  ];

  for (const collection of imageCollections) {
    if (!Array.isArray(collection) || collection.length === 0) continue;

    const firstImage = collection[0];
    if (typeof firstImage === "string" && firstImage) return firstImage;
    if (typeof firstImage?.secure_url === "string" && firstImage.secure_url) {
      return firstImage.secure_url;
    }
    if (typeof firstImage?.url === "string" && firstImage.url) {
      return firstImage.url;
    }
  }

  return "";
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const formatDateTime = (value) => {
  if (!value) return "TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDateOnly = (value) => {
  if (!value) return "TBA";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBA";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getWishlistRoomId = (room) => room?.id || room?._id || room?.roomNumber;
export const getWishlistRoomName = (room) => room?.roomName || room?.name || "Room";
export const getWishlistRoomType = (room) => room?.roomType || room?.type || "Room";

export const getStatusTone = (status) => {
  switch (status) {
    case "confirmed":
    case "paid":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "pending":
    case "unpaid":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "completed":
      return "bg-sky-500/10 text-sky-600 border-sky-500/20";
    case "cancelled":
    case "rejected":
    case "refunded":
    case "no-show":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    case "checked-in":
      return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const isRoomBookingCancellable = (booking) => {
  if (booking?.paymentStatus === "paid") return false;
  return !["completed", "cancelled"].includes(booking?.status);
};

export const isActivityBookingCancellable = (booking) => {
  if (booking?.paymentStatus === "paid") return false;
  return !["cancelled", "rejected"].includes(booking?.status);
};

export const isTableBookingCancellable = (booking) => {
  if (booking?.paymentStatus === "paid") return false;
  if (["cancelled", "completed"].includes(booking?.status)) return false;

  const endTime = new Date(booking?.endTime);
  return !Number.isNaN(endTime.getTime()) && endTime >= new Date();
};

export const buildProfileStats = ({
  wishlistCount,
  cartCount,
  cartRequiresAttention,
  activeRoomBookingsCount,
  activeActivityBookingsCount,
  activeTableBookingsCount,
}) => [
  {
    icon: ShoppingBag,
    label: "Saved Rooms",
    value: wishlistCount,
    subtitle: "Rooms currently sitting in your wishlist.",
  },
  {
    icon: ShoppingCart,
    label: "Cart Items",
    value: cartCount,
    subtitle: cartRequiresAttention
      ? "Some cart dates still need review."
      : "Your ready-to-review room selections.",
  },
  {
    icon: Calendar,
    label: "Upcoming Stays",
    value: activeRoomBookingsCount,
    subtitle: "Room reservations you can still manage.",
  },
  {
    icon: Ticket,
    label: "Planned Experiences",
    value: activeActivityBookingsCount + activeTableBookingsCount,
    subtitle: "Activities and dining plans linked to your account.",
  },
];

export const roomBookingMeta = (booking, formatBookingDateLabel) => [
  {
    icon: Calendar,
    label: `${formatBookingDateLabel(booking?.checkInDate)} - ${formatBookingDateLabel(
      booking?.checkOutDate,
    )}`,
  },
  {
    icon: User,
    label: `${booking?.guests || 1} guest(s)`,
  },
  {
    icon: Clock3,
    label: `${booking?.nights || 1} night(s)`,
  },
  {
    icon: ShoppingBag,
    label: formatCurrency(booking?.totalPrice || 0),
  },
];

export const activityBookingMeta = (booking) => [
  {
    icon: Calendar,
    label: formatDateOnly(booking?.bookingDate),
  },
  {
    icon: Clock3,
    label: `${booking?.startTime || "TBA"} - ${booking?.endTime || "TBA"}`,
  },
  {
    icon: User,
    label: `${booking?.guests || 1} guest(s)`,
  },
  {
    icon: Ticket,
    label: booking?.activity?.location || "Palm Mirage Hotel",
  },
];

export const tableBookingMeta = (booking) => [
  {
    icon: Calendar,
    label: formatDateOnly(booking?.startTime),
  },
  {
    icon: Clock3,
    label: `${formatDateTime(booking?.startTime).split(", ").slice(-1)[0]} - ${
      formatDateTime(booking?.endTime).split(", ").slice(-1)[0]
    }`,
  },
  {
    icon: User,
    label: `${booking?.guests || 1} guest(s)`,
  },
  {
    icon: UtensilsCrossed,
    label: booking?.tableNumber === null ? "Pending assignment" : "Table assigned",
  },
];
