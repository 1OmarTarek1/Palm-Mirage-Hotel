import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import RoomCard from "@/components/rooms/RoomCard";
import RoomFilter from "@/components/rooms/RoomFilter";
import BookingBar from "@/components/rooms/BookingBar";
import Sidebar from "@/components/common/Sidebar";
import MobileDrawer from "@/components/common/MobileDrawer";
import { DUMMY_ROOMS } from "@/utils/constants";
// import AppBreadcrumb from "@/components/common/AppBreadcrumb";

export default function Rooms() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
      <section className="text-center">
        {/* Header */}
        <div className="mb-10">
          {/* <h1 className="text-6xl font-header text-foreground font-medium">
            Rooms
          </h1>
          <div className="flex justify-center">
            <AppBreadcrumb />
          </div> */}
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
            {DUMMY_ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <Sidebar>
            <RoomFilter onFilter={() => setIsFilterOpen(false)} />
          </Sidebar>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        title="Filter Rooms"
      >
        <RoomFilter onFilter={() => setIsFilterOpen(false)} />
      </MobileDrawer>
      </section>
  );
}
