import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from '@/store/slices/wishlistSlice';
import { addItem } from '@/store/slices/cartSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {
  BedDouble,
  Maximize2,
  Users,
  ShoppingCart,
  Heart,
  Trash2,
} from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const handleRemove = (roomId, roomName) => {
    dispatch(removeFromWishlist(roomId));
    toast.warning(`${roomName} removed from wishlist`);
  };

  const handleClearAll = () => {
    if (wishlistItems.length === 0) return;
    dispatch(clearWishlist());
    toast.error('Wishlist cleared');
  };

  const handleAddToCart = (room) => {
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              My Wishlist
            </h1>
            <p className="text-muted-foreground text-lg">
              {wishlistItems.length} room
              {wishlistItems.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              onClick={handleClearAll}
              variant="outline"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} className="mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start adding rooms to your wishlist by clicking the heart icon on
              any room card.
            </p>
            <Button asChild size="lg">
              <Link to="/rooms">Explore Rooms</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {wishlistItems.map((room) => (
                <div
                  key={room.id}
                  className="bg-card rounded-3xl overflow-hidden shadow-sm border border-transparent hover:border-primary transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-4/3 rounded-t-3xl">
                    <Link
                      to={`/rooms/${room.id}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Type Badge */}
                    <span className="absolute top-0 left-0 bg-primary backdrop-blur-sm text-white text-[10px] font-bold tracking-widest uppercase px-6 py-2.5 rounded-br-2xl">
                      {room.type}
                    </span>

                    {/* Wishlist Badge */}
                    <div className="absolute top-4 right-4 bg-red-500/90 text-white p-2 rounded-full">
                      <Heart size={20} className="fill-current" />
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-0 left-0 bg-card px-5 py-3 rounded-tr-3xl">
                      <p className="text-foreground font-semibold">
                        <span className="text-xl font-bold">
                          ${room.price}.00
                        </span>
                        <span className="text-sm font-normal text-muted-foreground">
                          {' '}
                          /night
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex flex-1 flex-col gap-4 px-6 pt-2 pb-6">
                    {/* Name */}
                    <Link to={`/rooms/${room.id}`}>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {room.name}
                      </h3>
                    </Link>

                    {/* Details */}
                    <div className="flex flex-col gap-2 text-sm">
                      {room.beds && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BedDouble size={16} className="text-primary/60" />
                          <span>
                            {room.beds} {room.beds > 1 ? 'beds' : 'bed'}
                          </span>
                        </div>
                      )}
                      {room.size && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Maximize2 size={16} className="text-primary/60" />
                          <span>{room.size}m²</span>
                        </div>
                      )}
                      {room.guests && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Users size={16} className="text-primary/60" />
                          <span>
                            {room.guests} {room.guests > 1 ? 'adults' : 'adult'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-auto pt-4">
                      <Button asChild className="flex-1">
                        <Link to={`/rooms/${room.id}`}>View Details</Link>
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(room)}
                        variant="outline"
                        size="icon"
                        title="Add to cart"
                        className="shrink-0"
                      >
                        <ShoppingCart size={16} />
                      </Button>
                      <Button
                        onClick={() => handleRemove(room.id, room.name)}
                        variant="outline"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/rooms">Continue Exploring</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
