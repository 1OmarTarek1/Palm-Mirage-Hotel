import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

describe('InputOTP components', () => {
  test('renders InputOTP correctly', () => {
    render(
      <InputOTP 
        maxLength={6} 
        containerClassName="test-container"
        render={({ slots }) => (
          <InputOTPGroup>
            {slots.map((slot, index) => (
              <InputOTPSlot key={index} index={index} {...slot} />
            ))}
          </InputOTPGroup>
        )} 
      />
    );
    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toBeInTheDocument();
  });
});
