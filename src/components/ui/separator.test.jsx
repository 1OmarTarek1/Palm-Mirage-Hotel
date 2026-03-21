import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator component', () => {
  test('renders horizontally by default', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveClass('h-[1px]');
    expect(container.firstChild).toHaveClass('w-full');
  });

  test('renders vertically when orientation is set to vertical', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveClass('h-full');
    expect(container.firstChild).toHaveClass('w-[1px]');
  });
});
