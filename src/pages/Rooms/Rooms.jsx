import { useMemo, useState, useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import SharedPagination from "@/components/common/SharedPagination";
import { Button } from "@/components/ui/button";
import { usePagination } from "@/hooks/usePagination";
import RoomCard from "@/components/rooms/RoomCard";
import RoomFilter from "@/components/rooms/RoomFilter";
import BookingBar from "@/components/rooms/BookingBar";
import Sidebar from "@/components/common/Sidebar";
import MobileDrawer from "@/components/common/MobileDrawer";
import { RoomsPageSkeleton } from "@/components/common/loading/WebsiteSkeletons";
import { fetchRoomAvailability } from "@/services/roomsApi";
import {
  fetchAllRooms,
  selectListError,
  selectListLoading,
  selectRooms,
} from "../../services/rooms/roomsSlice";

export default function Rooms() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const bookingBarRef = useRef(null);
  const [filter, setFilter] = useState({
    price: [0, Number.MAX_SAFE_INTEGER],
    roomTypes: [],
    ratings: [],
    unrated: false,
  });
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const isLoading = useSelector(selectListLoading);
  const error = useSelector(selectListError);
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const selectedCheckIn = searchParams.get("checkIn") || "";
  const selectedCheckOut = searchParams.get("checkOut") || "";
  const selectedAdults = Math.max(1, Number(searchParams.get("adults") || 1));
  const selectedChildren = Math.max(0, Number(searchParams.get("children") || 0));
  const totalGuests = selectedAdults + selectedChildren;
  const hasAvailabilitySearch = Boolean(selectedCheckIn && selectedCheckOut);
  const roomPrices = useMemo(
    () => rooms.map((room) => Number(room.price ?? 0)).filter((price) => Number.isFinite(price) && price > 0),
    [rooms]
  );

  const minRoomPrice = useMemo(() => {
    if (!roomPrices.length) return 0;
    return Math.floor(Math.min(...roomPrices) / 100) * 100;
  }, [roomPrices]);

  const maxRoomPrice = useMemo(() => {
    if (!roomPrices.length) return Number.MAX_SAFE_INTEGER;
    return Math.ceil(Math.max(...roomPrices) / 100) * 100;
  }, [roomPrices]);

  const roomsPerPage = 8;

  const filteredRooms = useMemo(() => {
    if (!rooms?.length) return [];
    const [minPrice, maxPrice] = filter.price;

    return rooms.filter((room) => {
      const roomPrice = Number(room.price ?? 0);
      const inPrice = roomPrice >= minPrice && roomPrice <= maxPrice;
      const typeMatch =
        !filter.roomTypes.length || filter.roomTypes.includes(String(room.roomType || "").toLowerCase());
      const roomRating = Number(room.rating) || 0;
      const ratingMatch = filter.unrated
        ? roomRating === 0
        : !filter.ratings.length
        ? true
        : filter.ratings.includes(Math.floor(roomRating));
      const roomCapacity = Number(room.capacity ?? room.guests ?? 0);
      const roomId = room._id || room.id;
      const guestMatch = !hasAvailabilitySearch || roomCapacity >= totalGuests;
      const availabilityMatch =
        !hasAvailabilitySearch ||
        !roomId ||
        availabilityMap[roomId]?.isBookable === true;

      return inPrice && typeMatch && ratingMatch && guestMatch && availabilityMatch;
    });
  }, [rooms, filter, hasAvailabilitySearch, totalGuests, availabilityMap]);

  const applyFilter = (criteria) => {
    setFilter({
      price: criteria?.price ?? [minRoomPrice, maxRoomPrice || Number.MAX_SAFE_INTEGER],
      roomTypes: criteria?.roomTypes ?? [],
      ratings: criteria?.ratings ?? [],
      unrated: criteria?.unrated ?? false,
    });
    resetPage();
  };

  const handleResetAll = () => {
    bookingBarRef.current?.resetToDefaults?.();
    navigate("/rooms", { replace: true });
  };

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedRooms,
    resetPage,
  } = usePagination(filteredRooms, roomsPerPage);

  useEffect(() => {
    dispatch(fetchAllRooms());
  }, [dispatch]);

  useEffect(() => {
    if (!hasAvailabilitySearch || !rooms.length) {
      setAvailabilityMap({});
      return;
    }

    let isCancelled = false;

    const loadAvailability = async () => {
      setAvailabilityLoading(true);

      try {
        const results = await Promise.all(
          rooms.map(async (room) => {
            const roomId = room._id || room.id;
            if (!roomId) return null;

            const availability = await fetchRoomAvailability(roomId, {
              checkInDate: selectedCheckIn,
              checkOutDate: selectedCheckOut,
            });

            return [roomId, availability];
          }),
        );

        if (isCancelled) return;
        setAvailabilityMap(Object.fromEntries(results.filter(Boolean)));
      } catch {
        if (!isCancelled) {
          setAvailabilityMap({});
          toast.error("Failed to load availability for the selected stay.");
        }
      } finally {
        if (!isCancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    void loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [hasAvailabilitySearch, rooms, selectedCheckIn, selectedCheckOut]);

  if (isLoading)
    return <RoomsPageSkeleton count={roomsPerPage} />;

  if (error) return <p>Error: {error}</p>;

  return (
    <section className="text-center">
      {/* Header */}
      <div className="mb-10">
        <div className="mt-12">
          <BookingBar
            ref={bookingBarRef}
            variant="default"
            className="max-w-full! px-0!"
          />
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

      <div className="grid grid-cols-12 items-start gap-8">
        <div className="col-span-12 lg:col-span-9">
          {hasAvailabilitySearch ? (
            <div className="mb-5 rounded-2xl border border-border bg-muted/20 px-4 py-3 text-left text-sm text-muted-foreground">
              {availabilityLoading
                ? "Checking room availability for your selected stay..."
                : `Showing rooms available for ${selectedAdults} adult(s), ${selectedChildren} children from ${selectedCheckIn} to ${selectedCheckOut}.`}
            </div>
          ) : null}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedRooms.length ? (
              paginatedRooms.map((room) => (
                <RoomCard key={room._id || room.roomNumber} room={room} />
              ))
            ) : (
              <p className="col-span-full text-left text-stone-500">
                {hasAvailabilitySearch
                  ? "No rooms match the selected stay details and filters."
                  : "No rooms match the selected filters."}
              </p>
            )}
          </div>

        </div>

        <div className="hidden lg:col-span-3 lg:sticky lg:top-24 lg:block lg:self-start">
          <Sidebar className="max-h-[calc(100vh-7rem)] overflow-y-auto">
            <RoomFilter
              rooms={rooms}
              onReset={handleResetAll}
              onFilter={(criteria) => {
                applyFilter(criteria);
                setIsFilterOpen(false);
              }}
            />
          </Sidebar>
        </div>

        <div className="col-span-12">
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-2"
          />
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
          onReset={handleResetAll}
          onFilter={(criteria) => {
            applyFilter(criteria);
            setIsFilterOpen(false);
          }}
        />
      </MobileDrawer>
    </section>
  );
}
