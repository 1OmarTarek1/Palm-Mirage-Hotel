import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

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
      fn({ email: 'test@example.com', password: 'password123' });
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
jest.mock('@/components/auth/FormInputField', () => () => <input data-testid="email-input" />);
jest.mock('@/features/auth/authSchema', () => ({ loginSchema: {} }));

const Login = require('./Login').default;

describe('Login page simple', () => {
  test('renders header', () => {
    render(<Login />);
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
  });

  test('renders inputs', () => {
    render(<Login />);
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });
});
