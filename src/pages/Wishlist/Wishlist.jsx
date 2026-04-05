import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectWishlistItems,
  clearWishlist,
} from '@/store/slices/wishlistSlice';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import RoomCard from '@/components/rooms/RoomCard';
import { Trash2, Heart } from 'lucide-react';

export default function Wishlist() {
  const dispatch = useDispatch();
  const isHydrating = useSelector((state) => state.auth.isHydrating);
  const wishlistItems = useSelector(selectWishlistItems);

  const handleClearAll = () => {
    if (wishlistItems.length === 0) return;
    dispatch(clearWishlist());
    toast.success('Wishlist cleared');
  };

  if (isHydrating) return null;

  return (
    <div className="min-h-screen py-3 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
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
                <RoomCard key={room.id} room={room} className="h-full" />
              ))}
            </div>

            {/* Footer */}
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
