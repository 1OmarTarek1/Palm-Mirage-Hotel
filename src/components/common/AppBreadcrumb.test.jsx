import React from 'react';
import { render, screen } from '@testing-library/react';
import AppBreadcrumb from './AppBreadcrumb';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock the UI breadcrumb components to avoid potential issues with Radix/Lucide in this specific test environment
jest.mock('@/components/ui/breadcrumb', () => ({
  Breadcrumb: ({ children, className }) => <nav className={className}>{children}</nav>,
  BreadcrumbList: ({ children }) => <ol>{children}</ol>,
  BreadcrumbItem: ({ children }) => <li>{children}</li>,
  BreadcrumbLink: ({ children, asChild }) => <span>{children}</span>,
  BreadcrumbPage: ({ children }) => <span>{children}</span>,
  BreadcrumbSeparator: () => <span>/</span>,
}));

describe('AppBreadcrumb component', () => {
  test('renders nothing when at root path', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/' });
    
    const { container } = render(<AppBreadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  test('renders breadcrumbs correctly for deep paths', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/products/electronics' });
    
    render(<AppBreadcrumb />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('formats labels correctly', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/my-cool-category' });
    
    render(<AppBreadcrumb />);

    expect(screen.getByText('My cool category')).toBeInTheDocument();
  });
});
