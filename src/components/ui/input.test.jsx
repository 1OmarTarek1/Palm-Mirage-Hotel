import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input';

describe('Input component', () => {
  test('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('is disabled when the disabled prop is passed', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
