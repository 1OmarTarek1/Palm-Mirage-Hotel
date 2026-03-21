import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

// Framer motion mocks
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
  },
}));

// Mock AnimatedScrollToTop
jest.mock('./AnimatedScrollToTop', () => () => <div data-testid="scroll-to-top" />);

describe('Footer component', () => {
  test('renders hotel name and description', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Palm Mirage Hotel')).toBeInTheDocument();
  });

  test('renders quick links', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });

  test('updates email input on change', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('Your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  test('clears email on form submit', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText('Your email');
    const subscribeButton = screen.getByText('Subscribe');
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(subscribeButton);
    
    expect(input.value).toBe('');
  });
});
