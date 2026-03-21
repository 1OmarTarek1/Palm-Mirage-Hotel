import React from 'react';
import { render, screen } from '@testing-library/react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

jest.mock('input-otp', () => ({
  OTPInput: React.forwardRef(({ containerClassName, className, render, ...props }, ref) => {
    return (
      <div ref={ref} className={containerClassName} role="textbox">
        {render({
          slots: Array.from({ length: props.maxLength || 6 }).map((_, i) => ({
            char: '',
            hasFakeCaret: false,
            isActive: false,
          })),
        })}
      </div>
    );
  }),
  OTPInputContext: React.createContext({
    slots: Array.from({ length: 6 }).map(() => ({
      char: '',
      hasFakeCaret: false,
      isActive: false,
    })),
  }),
}));

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
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
});
