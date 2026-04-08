import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dependencies BEFORE importing
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

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, className }) => (
    <button disabled={disabled} className={className}>{children}</button>
  ),
  buttonVariants: () => ""
}));

jest.mock('lucide-react', () => ({
  Facebook: () => <div />,
  Twitter: () => <div />,
  Linkedin: () => <div />,
  Instagram: () => <div />,
}));

jest.mock('@/components/auth/FormInputField', () => ({
  __esModule: true,
  default: ({ id, label, placeholder, error, className, ...props }) => (
    <div className={className} data-testid="form-input-container">
      <label htmlFor={id}>{label}</label>
      <input id={id} placeholder={placeholder} data-testid="form-input" {...props} />
      {error && <span>{error.message}</span>}
    </div>
  )
}));

jest.mock('@/features/contact/contactSchema', () => ({ contactSchema: {} }));

const Contact = require('./Contact').default;

describe('Contact page', () => {
  test('renders contact info and form', () => {
    render(<Contact />);
    
    // Check for heading part
    expect(screen.getByText(/Always Ready To Help You/i)).toBeInTheDocument();
    
    // Check for form inputs (mocked FormInputField)
    const inputs = screen.getAllByTestId('form-input');
    expect(inputs.length).toBeGreaterThan(0);
    
    // Check for textarea
    expect(screen.getByPlaceholderText(/Enter your message/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Send A Message/i })).toBeInTheDocument();
  });
});
