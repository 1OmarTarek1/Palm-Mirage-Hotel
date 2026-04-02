import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock EVERYTHING before importing
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(() => ({})),
    handleSubmit: (fn) => (e) => {
      e.preventDefault();
      fn({});
    },
    formState: { isSubmitting: false, errors: {} },
  }),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));

jest.mock('@/components/auth/AuthHeader', () => () => <div data-testid="auth-header" />);
jest.mock('@/components/auth/AuthButton', () => ({ children }) => <button type="submit">{children}</button>);
jest.mock('@/components/auth/PasswordField', () => () => <input data-testid="password-input" />);
jest.mock('@/components/auth/FormInputField', () => () => <input data-testid="form-input" />);
jest.mock('@/features/auth/authSchema', () => ({ registerSchema: {} }));

const Register = require('./Register').default;

describe('Register page simple', () => {
  test('renders header', () => {
    render(<Register />);
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
  });

  test('renders multiple inputs', () => {
    render(<Register />);
    expect(screen.getAllByTestId('form-input').length).toBeGreaterThan(1);
    expect(screen.getAllByTestId('password-input').length).toBe(2);
  });
});
