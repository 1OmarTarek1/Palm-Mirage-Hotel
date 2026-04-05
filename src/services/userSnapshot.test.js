/* global afterEach, beforeEach, describe, expect, it, jest */

import axiosInstance from "@/services/axiosInstance";
import {
  fetchMyActivityBookings,
} from "@/services/activityBookings/activityBookingsSlice";
import { fetchMyBookings } from "@/services/booking/bookingSlice";
import {
  fetchMyTableBookings,
} from "@/services/restaurantBookings/restaurantBookingsSlice";
import { fetchUserPreferences } from "@/services/userPreferencesApi";
import { setCredentials } from "@/store/slices/authSlice";
import { hydrateCart } from "@/store/slices/cartSlice";
import { hydrateWishlist } from "@/store/slices/wishlistSlice";

import { applyUserSnapshot, refreshUserSnapshot } from "./userSnapshot";

jest.mock("@/services/axiosInstance", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("@/services/userPreferencesApi", () => ({
  fetchUserPreferences: jest.fn(),
}));

jest.mock("@/services/booking/bookingSlice", () => ({
  fetchMyBookings: jest.fn(),
}));

jest.mock("@/services/activityBookings/activityBookingsSlice", () => ({
  fetchMyActivityBookings: jest.fn(),
}));

jest.mock("@/services/restaurantBookings/restaurantBookingsSlice", () => ({
  fetchMyTableBookings: jest.fn(),
}));

describe("userSnapshot", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("hydrates preferences before setting credentials", () => {
    const dispatch = jest.fn();
    const user = { _id: "user-1", userName: "Palm Mirage Guest" };
    const entries = [
      {
        key: "preferences",
        result: {
          status: "fulfilled",
          value: {
            cartItems: [{ id: "room-1" }],
            wishlistItems: [{ id: "room-2" }],
          },
        },
      },
    ];

    applyUserSnapshot({ dispatch, user, entries });

    expect(dispatch.mock.calls[0][0]).toEqual(hydrateCart([{ id: "room-1" }]));
    expect(dispatch.mock.calls[1][0]).toEqual(hydrateWishlist([{ id: "room-2" }]));
    expect(dispatch.mock.calls[2][0]).toEqual(
      setCredentials({ user, skipCollectionsSync: true }),
    );
  });

  it("retries the full snapshot after an auth failure", async () => {
    const user = { _id: "user-2", userName: "Reloaded Guest" };
    const axiosPrivate = {
      get: jest
        .fn()
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce({ data: { data: { user } } }),
    };
    const roomBookingsAction = { unwrap: jest.fn().mockResolvedValue([]) };
    const activityBookingsAction = { unwrap: jest.fn().mockResolvedValue([]) };
    const tableBookingsAction = { unwrap: jest.fn().mockResolvedValue([]) };
    const dispatch = jest.fn((action) => action);

    fetchUserPreferences.mockResolvedValue({
      cartItems: [{ id: "room-3" }],
      wishlistItems: [{ id: "room-4" }],
    });
    fetchMyBookings.mockReturnValue(roomBookingsAction);
    fetchMyActivityBookings.mockReturnValue(activityBookingsAction);
    fetchMyTableBookings.mockReturnValue(tableBookingsAction);
    axiosInstance.get.mockResolvedValue({});

    const snapshot = await refreshUserSnapshot({ dispatch, axiosPrivate });

    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/refresh-token");
    expect(axiosPrivate.get).toHaveBeenCalledTimes(2);
    expect(fetchUserPreferences).toHaveBeenCalledTimes(2);
    expect(fetchMyBookings).toHaveBeenCalledTimes(2);
    expect(fetchMyActivityBookings).toHaveBeenCalledTimes(2);
    expect(fetchMyTableBookings).toHaveBeenCalledTimes(2);
    expect(snapshot).toEqual(
      expect.objectContaining({
        status: "authenticated",
        user,
      }),
    );

    const dispatchedActions = dispatch.mock.calls.map(([action]) => action);
    expect(dispatchedActions).toContainEqual(hydrateCart([{ id: "room-3" }]));
    expect(dispatchedActions).toContainEqual(hydrateWishlist([{ id: "room-4" }]));
    expect(dispatchedActions).toContainEqual(
      setCredentials({ user, skipCollectionsSync: true }),
    );
  });
});
