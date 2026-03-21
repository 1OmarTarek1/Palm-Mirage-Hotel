import { render, screen } from '@testing-library/react';
import { Label } from './label';

describe('Label component', () => {
  test('renders correctly', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(<Label className="custom-class">Username</Label>);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
