import React from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BedDouble, Maximize2, Users, ShoppingCart, Heart } from "lucide-react";

import {
  selectCartItemById,
  upsertRoomBooking,
} from "@/store/slices/cartSlice";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { Button } from "@/components/ui/button";
import {
  toggleWishlist,
  selectIsInWishlist,
} from "@/store/slices/wishlistSlice";
import RoomBookingModal from "@/components/rooms/RoomBookingModal";
import { normalizeRoomForBooking } from "@/utils/roomBooking";

const normalizeRoomAmenities = (room) => {
  const rawAmenities =
    room?.amenities ||
    room?.room?.amenities ||
    room?._doc?.amenities ||
    room?.data?.amenities ||
    room?.facilities ||
    room?.room?.facilities ||
    room?._doc?.facilities ||
    room?.data?.facilities ||
    [];

  return rawAmenities
    .map((item) => {
      if (typeof item === "string") return { name: item };
      if (item && typeof item === "object") {
        return {
          name: item.name || item.label || "Amenity",
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 3);
};

const resolveRoomImage = (room) => {
  if (typeof room?.image === "string" && room.image) return room.image;
  if (typeof room?.image?.secure_url === "string" && room.image.secure_url) {
    return room.image.secure_url;
  }

  const roomImages = room?.roomImages || room?.images;
  if (Array.isArray(roomImages) && roomImages.length > 0) {
    const firstImage = roomImages[0];
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

export default function RoomCard({ room, className }) {
  const dispatch = useDispatch();
  const { flyToCart } = useFlyToCart();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const roomId = room?._id || room?.id || room?.roomNumber;
  const roomName = room?.roomName || room?.name || "Room";
  const roomType = room?.roomType || room?.type || "Room";
  const roomImage = resolveRoomImage(room);
  const roomAmenities = normalizeRoomAmenities(room);

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, roomId),
  );
  const cartItem = useSelector((state) => selectCartItemById(state, roomId));
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);
  const cartTriggerRef = React.useRef(null);

  if (!room) return null;

  const normalizedRoom = normalizeRoomForBooking(room);

  const handleOpenBookingModal = (e) => {
    e.preventDefault();
    if (isHydrating) {
      toast.info("Loading your saved room selections...");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in first to use cart.");
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (bookingDraft) => {
    dispatch(
      upsertRoomBooking({
        room: {
          ...normalizedRoom,
          image: roomImage,
        },
        bookingDraft,
      })
    );

    setIsBookingModalOpen(false);
    if (cartTriggerRef.current) {
      flyToCart(cartTriggerRef.current);
    }
    toast.success(cartItem ? `${roomName} booking updated in cart` : `${roomName} added to cart`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (isHydrating) {
      toast.info("Loading your saved room selections...");
      return;
    }
    if (!isAuthenticated) {
      toast.info("Please sign in first to use wishlist.");
      return;
    }
    if (!isInWishlist) {
      flyToCart(e.currentTarget, "navbar-wishlist-button");
    }
    dispatch(
      toggleWishlist({
        ...room,
        id: roomId,
      }),
    );
    toast.success(
      isInWishlist
        ? `${roomName} removed from wishlist`
        : `${roomName} added to wishlist`,
    );
  };

  return (
    <div
      className={cn(
        "bg-card rounded-3xl overflow-hidden shadow-sm flex flex-col h-full select-none group border border-transparent hover:border-primary transition-all duration-300",
        className,
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-4/3 rounded-t-3xl text-left">
        <Link to={`/rooms/${roomId}`} className="block w-full h-full">
          <img
            src={roomImage}
            alt={roomName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            draggable={false}
          />
        </Link>
        {/* Type badge */}
        <span className="absolute top-0 left-0 bg-primary backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-br-2xl">
          {roomType}
        </span>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-0 left-0 bg-card px-5 py-3 rounded-tr-3xl transition-colors duration-300">
          <p className="text-foreground font-semibold text-base leading-none">
            <span className="text-xl font-bold">${Number(room.price || 0).toFixed(2)}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              /night
            </span>
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-6 box-border">
        {/* Name */}
        <Link to={`/rooms/${roomId}`}>
          <h3 className="font-header text-2xl text-foreground leading-tight mt-2 text-left group-hover:text-primary transition-colors">
            {roomName}
          </h3>
        </Link>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <BedDouble size={16} className="text-primary/60" />
            <span>
              {room.beds} {room.beds > 1 ? "beds" : "bed"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Maximize2 size={16} className="text-primary/60" />
            <span>{room.size} sqm</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Users size={16} className="text-primary/60" />
            <span>
              {room.guests} {room.guests > 1 ? "adults" : "adult"}
            </span>
          </div>
        </div>

        {!!roomAmenities.length && (
          <div className="flex flex-wrap gap-2">
            {roomAmenities.map((amenity, index) => (
              <span
                key={`${amenity.name}-${index}`}
                className="rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold text-primary"
              >
                {amenity.name}
              </span>
            ))}
          </div>
        )}

        {/* Buttons & Partners */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="palmSecondary" size="sm" className="px-7">
              <Link to={`/rooms/${roomId}`}>Book Now</Link>
            </Button>
            <Button
              onClick={handleOpenBookingModal}
              variant={cartItem ? "palmPrimary" : "palmSecondary"}
              size="icon"
              className="h-9 w-9 shrink-0"
              aria-label={cartItem ? "Update booking in cart" : "Add booking to cart"}
              title={cartItem ? "Update booking in cart" : "Add booking to cart"}
              ref={cartTriggerRef}
            >
              <ShoppingCart size={16} />
            </Button>
            <Button
              onClick={handleToggleWishlist}
              variant={isInWishlist ? "light" : "palmSecondary"}
              size="icon"
              className={cn(
                "h-9 w-9 shrink-0 border-2 border-primary",
                isInWishlist
                  ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                  : "text-primary hover:text-white",
              )}
              aria-label="Toggle wishlist"
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                size={16}
                className={cn("text-current", isInWishlist && "fill-current")}
              />
            </Button>
          </div>
        </div>
      </div>

      <RoomBookingModal
        key={`${roomId}-${isBookingModalOpen ? "open" : "closed"}-${cartItem?.checkInDate || "none"}-${cartItem?.checkOutDate || "none"}`}
        isOpen={isBookingModalOpen}
        room={normalizedRoom}
        initialDraft={cartItem}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}

