import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dependencies
jest.mock('@/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const Sidebar = require('./Sidebar').default;

describe('Sidebar component', () => {
  test('renders children correctly', () => {
    render(
      <Sidebar>
        <div data-testid="child">Sidebar Content</div>
      </Sidebar>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Sidebar className="custom-class">
        <div>Content</div>
      </Sidebar>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
