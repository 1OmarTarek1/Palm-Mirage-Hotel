import { render, screen } from '@testing-library/react';
import { Slider } from './slider';

describe('Slider component', () => {
  test('renders correctly', () => {
    const { container } = render(<Slider aria-label="volume" />);
    expect(container.firstChild).toHaveClass('relative', 'flex', 'w-full');
  });

  test('renders the correct number of thumbs', () => {
    // Radix UI Slider thumbs might not have a role="slider" if not fully interactive in test environment
    // But they should have the class from Slider component
    const { container } = render(<Slider defaultValue={[20, 50]} />);
    const thumbs = container.querySelectorAll('.block.h-4.w-4');
    expect(thumbs).toHaveLength(2);
  });
});
