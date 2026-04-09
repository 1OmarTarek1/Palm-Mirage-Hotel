import cartReducer, {
  addItem,
  addPendingActivityBooking,
  clearCart,
  clearPendingActivityBookings,
  openCart,
} from "@/store/slices/cartSlice";

describe("cartSlice", () => {
  test("clearCart removes only room items", () => {
    const initialState = {
      items: [
        {
          id: "room-1",
          name: "Deluxe Room",
          price: 200,
          quantity: 1,
          checkInDate: "2026-04-10",
          checkOutDate: "2026-04-12",
          nights: 2,
          roomsCount: 1,
          adults: 2,
          children: 0,
          guests: 2,
          availabilityStatus: "available",
        },
      ],
      isOpen: true,
      sidebarTab: "rooms",
      restaurantMenuCart: {},
      pendingRestaurantBookings: [],
      pendingActivityBookings: [
        {
          id: "activity-1",
          activityTitle: "Desert Safari",
          price: 50,
          guests: 2,
        },
      ],
    };

    const nextState = cartReducer(initialState, clearCart());

    expect(nextState.items).toHaveLength(0);
    expect(nextState.pendingActivityBookings).toHaveLength(1);
    expect(nextState.pendingActivityBookings[0].id).toBe("activity-1");
  });

  test("clearPendingActivityBookings removes only activity items", () => {
    const initialState = {
      items: [
        {
          id: "room-1",
          name: "Deluxe Room",
          price: 200,
          quantity: 1,
          checkInDate: "2026-04-10",
          checkOutDate: "2026-04-12",
          nights: 2,
          roomsCount: 1,
          adults: 2,
          children: 0,
          guests: 2,
          availabilityStatus: "available",
        },
      ],
      isOpen: true,
      sidebarTab: "activities",
      restaurantMenuCart: {},
      pendingRestaurantBookings: [],
      pendingActivityBookings: [
        {
          id: "activity-1",
          activityTitle: "Desert Safari",
          price: 50,
          guests: 2,
        },
      ],
    };

    const nextState = cartReducer(initialState, clearPendingActivityBookings());

    expect(nextState.pendingActivityBookings).toHaveLength(0);
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].id).toBe("room-1");
  });

  test("openCart accepts activities tab", () => {
    const initialState = cartReducer(undefined, { type: "@@INIT" });

    const nextState = cartReducer(initialState, openCart({ tab: "activities" }));

    expect(nextState.isOpen).toBe(true);
    expect(nextState.sidebarTab).toBe("activities");
  });
});
