import { Link } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import { useFlyToCart } from "@/hooks/useFlyToCart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  toggleWishlist,
  selectIsInWishlist,
} from '@/store/slices/wishlistSlice';
import { BedDouble, Maximize2, Users, ShoppingCart, Heart } from 'lucide-react';

export default function RoomCard({ room, className }) {
  const dispatch = useDispatch();
  const { flyToCart } = useFlyToCart();

  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, room.id)
  );
  if (!room) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    flyToCart(e.currentTarget, 'navbar-cart-button');
    dispatch(
      addItem({
        id: room.id,
        name: room.name,
        image: room.image,
        price: room.price,
        category: room.type,
        quantity: 1,
        nights: 1,
      })
    );
    toast.success(`${room.name} added to cart`);
  };
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!isInWishlist) {
      flyToCart(e.currentTarget, 'navbar-wishlist-button');
    }
    dispatch(toggleWishlist(room));
    toast.success(
      isInWishlist
        ? `${room.name} removed from wishlist`
        : `${room.name} added to wishlist`
    );
  };
  return (
    <div
      className={cn(
        'bg-card rounded-3xl overflow-hidden shadow-sm flex flex-col h-full select-none group border border-transparent hover:border-primary transition-all duration-300',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-4/3 rounded-t-3xl text-left">
        <Link to={`/rooms/${room.id}`} className="block w-full h-full">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
            draggable={false}
          />
        </Link>
        {/* Type badge */}
        <span className="absolute top-0 left-0 bg-primary backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-br-2xl">
          {room.type}
        </span>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-0 left-0 bg-card px-5 py-3 rounded-tr-3xl transition-colors duration-300">
          <p className="text-foreground font-semibold text-base leading-none">
            <span className="text-xl font-bold">${room.price}.00</span>
            <span className="text-sm font-normal text-muted-foreground">
              {' '}
              /night
            </span>
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-6 box-border">
        {/* Name */}
        <Link to={`/rooms/${room.id}`}>
          <h3 className="font-header text-2xl text-foreground leading-tight mt-2 text-left group-hover:text-primary transition-colors">
            {room.name}
          </h3>
        </Link>

        {/* Details */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <BedDouble size={16} className="text-primary/60" />
            <span>
              {room.beds} {room.beds > 1 ? 'beds' : 'bed'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Maximize2 size={16} className="text-primary/60" />
            <span>{room.size}sqm m²</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
            <Users size={16} className="text-primary/60" />
            <span>
              {room.guests} {room.guests > 1 ? 'adults' : 'adult'}
            </span>
          </div>
        </div>

        {/* Buttons & Partners */}
        <div className="flex items-center justify-between gap-4 mt-auto pt-2">
          <div className="flex items-center gap-2">
            <Button asChild variant="palmSecondary" size="sm" className="px-7">
              <Link to={`/rooms/${room.id}`}>Book Now</Link>
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="palmSecondary"
              size="icon"
              className="h-9 w-9 shrink-0"
              aria-label="Add to cart"
              title="Add to cart"
            >
              <ShoppingCart size={16} />
            </Button>
            <Button
              onClick={handleToggleWishlist}
              variant="palmSecondary"
              size="icon"
              className="h-9 w-9 shrink-0 text-primary hover:text-white"
              aria-label="Toggle wishlist"
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className={cn('text-current', isInWishlist && 'fill-current')}
              />
            </Button>
          </div>

          {room.partners && room.partners.length > 0 && (
            <div className="flex items-center gap-2">
              {room.partners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-8 h-8 rounded-lg object-contain bg-white p-1 border border-border/50 shadow-sm"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
