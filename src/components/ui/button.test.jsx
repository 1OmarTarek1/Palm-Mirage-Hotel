import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button component', () => {
  test('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('applies default classes', () => {
    const { container } = render(<Button>Click me</Button>);
    // Basic classes from buttonVariants
    expect(container.firstChild).toHaveClass('inline-flex');
    expect(container.firstChild).toHaveClass('items-center');
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('applies variant classes correctly', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });
});
