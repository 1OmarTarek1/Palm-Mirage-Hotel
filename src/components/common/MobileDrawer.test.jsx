import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock everything BEFORE importing the component
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    aside: ({ children, ...props }) => <aside {...props}>{children}</aside>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />,
}));

const MobileDrawer = require('./MobileDrawer').default;

describe('MobileDrawer component', () => {
  test('renders title and children when open', () => {
    render(
      <MobileDrawer isOpen={true} title="My Drawer" onClose={() => {}}>
        <div data-testid="content">Content</div>
      </MobileDrawer>
    );
    
    expect(screen.getByText('My Drawer')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    const { container } = render(
      <MobileDrawer isOpen={false} title="My Drawer" onClose={() => {}}>
        <div>Content</div>
      </MobileDrawer>
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <MobileDrawer isOpen={true} title="My Drawer" onClose={onClose}>
        <div>Content</div>
      </MobileDrawer>
    );
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
