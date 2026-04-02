import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox component', () => {
  test('renders correctly', () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByLabelText('agree')).toBeInTheDocument();
  });

  test('can be checked and unchecked', () => {
    render(<Checkbox aria-label="agree" />);
    const checkbox = screen.getByLabelText('agree');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  test('is disabled when the disabled prop is passed', () => {
    render(<Checkbox disabled aria-label="agree" />);
    expect(screen.getByLabelText('agree')).toBeDisabled();
  });
});
