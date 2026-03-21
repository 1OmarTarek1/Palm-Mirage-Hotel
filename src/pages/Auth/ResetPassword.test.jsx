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
jest.mock('@/features/auth/authSchema', () => ({ resetPasswordSchema: {} }));

const ResetPassword = require('./ResetPassword').default;

describe('ResetPassword page', () => {
  test('renders and fields works', () => {
    render(<ResetPassword />);
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
  });

  test('renders all inputs', () => {
    render(<ResetPassword />);
    expect(screen.getByTestId('form-input')).toBeInTheDocument();
    expect(screen.getAllByTestId('password-input').length).toBe(2);
  });
});
