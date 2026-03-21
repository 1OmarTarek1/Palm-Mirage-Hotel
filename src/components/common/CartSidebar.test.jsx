import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartSidebar from './CartSidebar';

// Mock everything external
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector) => {
    // Return mock states based on the component's needs
    // We can't easily check which selector is which without more setup,
    // so let's just return a default state that makes it render.
    return selector.name === 'selectCartIsOpen' ? true : 
           selector.name === 'selectCartItems' ? [] : 
           selector.name === 'selectCartTotal' ? 0 : null;
  },
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  ArrowRight: () => <div data-testid="arrow-icon" />,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock the store slices to avoid importing the actual store logic
jest.mock('@/store/slices/cartSlice', () => ({
  closeCart: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  selectCartItems: () => [],
  selectCartIsOpen: () => true,
  selectCartTotal: () => 0,
}));

describe('CartSidebar component simplistic', () => {
  test('renders cart header', () => {
    render(<CartSidebar />);
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  test('renders empty cart message', () => {
    render(<CartSidebar />);
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });
});
