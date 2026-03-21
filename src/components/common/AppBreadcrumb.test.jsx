import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppBreadcrumb from './AppBreadcrumb';

// Mock react-router-dom more simply
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useLocation: jest.fn(),
  };
});

describe('AppBreadcrumb component', () => {
  test('renders nothing when at root path', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/' });
    
    const { container } = render(
      <MemoryRouter>
        <AppBreadcrumb />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders breadcrumbs correctly for deep paths', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/products/electronics' });
    
    render(
      <MemoryRouter>
        <AppBreadcrumb />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });
});
