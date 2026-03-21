import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock everything BEFORE importing the component
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
  },
}));

jest.mock('lucide-react', () => ({
  MapPin: () => <div />,
  Phone: () => <div />,
  Mail: () => <div />,
  Facebook: () => <div />,
  Twitter: () => <div />,
  Linkedin: () => <div />,
  Instagram: () => <div />,
  Hotel: () => <div />,
  ChevronUp: () => <div />,
}));

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('./AnimatedScrollToTop', () => () => <div />);
jest.mock('@/assets/logo.png', () => 'test-file-stub');

const Footer = require('./Footer').default;

describe('Footer component final attempt', () => {
  test('renders correctly', () => {
    render(<Footer />);
    expect(screen.getByText('Palm Mirage Hotel')).toBeInTheDocument();
  });

  test('email input works', () => {
    render(<Footer />);
    const input = screen.getByPlaceholderText('Your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });
});
