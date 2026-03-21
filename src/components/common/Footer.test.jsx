import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin" />,
  Phone: () => <div data-testid="phone" />,
  Mail: () => <div data-testid="mail" />,
  Facebook: () => <div data-testid="facebook" />,
  Twitter: () => <div data-testid="twitter" />,
  Linkedin: () => <div data-testid="linkedin" />,
  Instagram: () => <div data-testid="instagram" />,
  Hotel: () => <div data-testid="hotel" />,
  ChevronUp: () => <div data-testid="chevron-up" />,
}));

// Mock AnimatedScrollToTop
jest.mock('./AnimatedScrollToTop', () => () => <div data-testid="scroll-to-top" />);

describe('Footer component', () => {
  test('renders hotel name', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Palm Mirage Hotel')).toBeInTheDocument();
  });

  test('updates email input', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('Your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });
});
