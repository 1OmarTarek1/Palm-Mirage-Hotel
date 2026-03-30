import { render, screen } from '@testing-library/react';

describe('Initial Setup Test', () => {
  test('should pass', () => {
    render(<div>Test</div>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
