import React from "react";
import { render, screen } from "@testing-library/react";
import CartSidebar from "./CartSidebar";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => {
    return selector.name === "selectCartIsOpen"
      ? true
      : selector.name === "selectCartItems"
        ? []
        : selector.name === "selectCartTotal"
          ? 0
          : selector.name === "selectCartSidebarTab"
            ? "rooms"
            : null;
  },
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useReducedMotion: () => true,
}));

jest.mock("lucide-react", () => ({
  X: () => <div data-testid="x-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  ArrowRight: () => <div data-testid="arrow-icon" />,
  BedDouble: () => <div data-testid="bed-icon" />,
  UtensilsCrossed: () => <div data-testid="utensils-icon" />,
  CalendarDays: () => <div data-testid="cal-icon" />,
  Eye: () => <div data-testid="eye-icon" />,
  Edit3: () => <div data-testid="edit-icon" />,
}));

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock("react-toastify", () => ({
  toast: {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("@/context/RestaurantCartContext", () => ({
  useRestaurantCart: () => ({ cart: {} }),
}));

jest.mock("@/components/restaurant/RestaurantCartChrome", () => ({
  RestaurantOrderSidebarSection: () => <div data-testid="restaurant-order-panel" />,
}));

jest.mock("@/store/slices/cartSlice", () => ({
  closeCart: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  setCartSidebarTab: jest.fn(),
  selectCartItems: () => [],
  selectCartIsOpen: () => true,
  selectCartTotal: () => 0,
  selectCartSidebarTab: () => "rooms",
}));

describe("CartSidebar component simplistic", () => {
  test("renders cart header", () => {
    render(<CartSidebar />);
    expect(screen.getByText("Your cart")).toBeInTheDocument();
  });

  test("renders empty rooms panel message", () => {
    render(<CartSidebar />);
    expect(screen.getByText("No rooms in your cart")).toBeInTheDocument();
  });
});
