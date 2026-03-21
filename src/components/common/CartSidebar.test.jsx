import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CartSidebar from './CartSidebar';
import cartReducer from '@/store/slices/cartSlice';
import { MemoryRouter } from 'react-router-dom';

// Framer motion mocks
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Toast mock
jest.mock('react-toastify', () => ({
  toast: {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  },
}));

const renderWithRedux = (
  component,
  {
    initialState,
    store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: initialState,
    }),
  } = {}
) => {
  return {
    ...render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>
    ),
    store,
  };
};

describe('CartSidebar component', () => {
  test('does not render when closed', () => {
    const { container } = renderWithRedux(<CartSidebar />, {
      initialState: { cart: { isOpen: false, items: [], total: 0 } },
    });
    expect(container.firstChild).toBeNull();
  });

  test('renders empty cart message when open and empty', () => {
    renderWithRedux(<CartSidebar />, {
      initialState: { cart: { isOpen: true, items: [], total: 0 } },
    });
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  test('renders items correctly', () => {
    const items = [
      { id: 1, name: 'Deluxe Room', price: 200, quantity: 1, image: 'room1.jpg' },
    ];
    renderWithRedux(<CartSidebar />, {
      initialState: { cart: { isOpen: true, items, total: 200 } },
    });
    expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
    expect(screen.getByText('$200')).toBeInTheDocument();
  });

  test('calls dispatch when close button is clicked', () => {
    const { store } = renderWithRedux(<CartSidebar />, {
      initialState: { cart: { isOpen: true, items: [], total: 0 } },
    });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]); 
    expect(store.getState().cart.isOpen).toBe(false);
  });
});
