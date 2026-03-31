import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import RoomCard from "@/components/rooms/RoomCard";
import RoomFilter from "@/components/rooms/RoomFilter";
import BookingBar from "@/components/rooms/BookingBar";
import Sidebar from "@/components/common/Sidebar";
import MobileDrawer from "@/components/common/MobileDrawer";
import { RoomCardSkeleton } from "../../components/rooms/RoomCardSkeleton";
import {
  fetchAllRooms,
  selectListError,
  selectListLoading,
  selectRooms,
} from "../../services/rooms/roomsSlice";

export default function Rooms() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    price: [0, 1000],
    roomTypes: [],
    ratings: [],
    unrated: false,
  });
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const isLoading = useSelector(selectListLoading);
  const error = useSelector(selectListError);

  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 8;

  const filteredRooms = useMemo(() => {
    if (!rooms?.length) return [];
    const [minPrice, maxPrice] = filter.price;

    return rooms.filter((room) => {
      const inPrice = room.price >= minPrice && room.price <= maxPrice;
      const typeMatch =
        !filter.roomTypes.length || filter.roomTypes.includes(room.roomType?.toLowerCase());
      const roomRating = Number(room.rating) || 0;
      const ratingMatch = filter.unrated
        ? roomRating === 0
        : !filter.ratings.length
        ? true
        : filter.ratings.includes(roomRating);

      return inPrice && typeMatch && ratingMatch;
    });
  }, [rooms, filter]);

  const applyFilter = (criteria) => {
    setFilter({
      price: criteria?.price ?? [0, 1000],
      roomTypes: criteria?.roomTypes ?? [],
      ratings: criteria?.ratings ?? [],
      unrated: criteria?.unrated ?? false,
    });
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / roomsPerPage));
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage,
  );

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  if (isLoading)
    return (
      <section className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: roomsPerPage }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}
        </div>
      </section>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <section className="text-center">
      {/* Header */}
      <div className="mb-10">
        <div className="mt-12">
          <BookingBar variant="default" className="max-w-full! px-0!" />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-end mb-6 px-4">
        <Button
          variant="palmPrimary"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal size={18} />
          Filter Rooms
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedRooms.length ? (
              paginatedRooms.map((room) => (
                <RoomCard key={room._id || room.roomNumber} room={room} />
              ))
            ) : (
              <p className="col-span-full text-left text-stone-500">
                No rooms match the selected filters.
              </p>
            )}
          </div>

          <div className="col-span-full mt-6 flex justify-center items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-stone-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <Sidebar>
            <RoomFilter
              rooms={rooms}
              onFilter={(criteria) => {
                applyFilter(criteria);
                setIsFilterOpen(false);
              }}
            />
          </Sidebar>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Rooms"
      >
        <RoomFilter
          rooms={rooms}
          onFilter={(criteria) => {
            applyFilter(criteria);
            setIsFilterOpen(false);
          }}
        />
      </MobileDrawer>
    </section>
  );
}
