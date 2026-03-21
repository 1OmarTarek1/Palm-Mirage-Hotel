import React from 'react';
import { render, screen } from '@testing-library/react';
import ChangePassword from './ChangePassword';

describe('ChangePassword dummy page', () => {
  test('renders placeholder text', () => {
    render(<ChangePassword />);
    expect(screen.getByText('ChangePassword')).toBeInTheDocument();
  });
});
