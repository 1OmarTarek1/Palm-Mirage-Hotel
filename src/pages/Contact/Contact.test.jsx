import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dependencies
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(() => ({})),
    handleSubmit: (fn) => (e) => {
      e.preventDefault();
      fn({});
    },
    formState: { isSubmitting: false, errors: {} },
    reset: jest.fn(),
  }),
}));

jest.mock('@/components/ui/button', () => ({ children, ...props }) => <button {...props}>{children}</button>);
jest.mock('lucide-react', () => ({
  Facebook: () => <div />,
  Twitter: () => <div />,
  Linkedin: () => <div />,
  Instagram: () => <div />,
}));

jest.mock('@/components/auth/FormInputField', () => () => <input data-testid="form-input" />);
jest.mock('@/features/contact/contactSchema', () => ({ contactSchema: {} }));

const Contact = require('./Contact').default;

describe('Contact page', () => {
  test('renders contact info and form', () => {
    render(<Contact />);
    expect(screen.getByText(/We Are Always Ready To Help You/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('form-input').length).toBe(3); // Name, Email, Subject
    expect(screen.getByPlaceholderText(/Enter your message/i)).toBeInTheDocument();
  });
});
