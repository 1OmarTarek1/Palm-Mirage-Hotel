import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppBreadcrumb from './AppBreadcrumb';

// Mock useLocation to control the path
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('AppBreadcrumb component', () => {
  test('renders nothing when at root path', () => {
    require('react-router-dom').useLocation.mockReturnValue({ pathname: '/' });
    const { container } = render(
      <MemoryRouter>
        <AppBreadcrumb />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders breadcrumbs correctly for deep paths', () => {
    require('react-router-dom').useLocation.mockReturnValue({ pathname: '/products/electronics' });
    render(
      <MemoryRouter>
        <AppBreadcrumb />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('formats labels correctly (capitalize and replace hyphens)', () => {
    require('react-router-dom').useLocation.mockReturnValue({ pathname: '/my-cool-category' });
    render(
      <MemoryRouter>
        <AppBreadcrumb />
      </MemoryRouter>
    );

    expect(screen.getByText('My cool category')).toBeInTheDocument();
  });
});
