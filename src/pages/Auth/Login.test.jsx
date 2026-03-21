import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock dependencies BEFORE importing the component
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('@/components/auth/AuthHeader', () => () => <div data-testid="auth-header" />);
jest.mock('@/components/auth/AuthButton', () => ({ children, isSubmitting }) => (
  <button type="submit" disabled={isSubmitting}>{children}</button>
));
jest.mock('@/components/auth/PasswordField', () => ({ register }) => (
  <input data-testid="password-input" name={register.name} onChange={register.onChange} onBlur={register.onBlur} ref={register.ref} type="password" />
));
jest.mock('@/components/auth/FormInputField', () => ({ register }) => (
  <input data-testid="email-input" name={register.name} onChange={register.onChange} onBlur={register.onBlur} ref={register.ref} />
));

// Mock the schema
jest.mock('@/features/auth/authSchema', () => ({
  loginSchema: require('zod').z.object({
    email: require('zod').z.string().email(),
    password: require('zod').z.string().min(6),
  }),
}));

const Login = require('./Login').default;

describe('Login page', () => {
  test('renders header and form fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('auth-header')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });

  test('submits form and navigates on valid input', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
    
    const submitBtn = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
