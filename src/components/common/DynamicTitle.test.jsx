import React from 'react';
import { render, screen } from '@testing-library/react';
import DynamicTitle from './DynamicTitle';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

// Mock navLinks
jest.mock('./Navbar/navLinks', () => ({
  navLinks: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { 
      href: '/products', 
      label: 'Products',
      dropdown: [
        { href: '/products/electronics', label: 'Electronics' }
      ]
    }
  ],
}));

describe('DynamicTitle component', () => {
  test('renders customTitle when provided', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/anywhere' });
    
    render(<DynamicTitle customTitle="CUSTOM PAGE" />);
    expect(screen.getByText('CUSTOM PAGE')).toBeInTheDocument();
  });

  test('renders HOME for root path', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/' });
    
    render(<DynamicTitle />);
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });

  test('renders matching label from navLinks', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/about' });
    
    render(<DynamicTitle />);
    expect(screen.getByText('ABOUT US')).toBeInTheDocument();
  });

  test('renders matching nested label from dropdown', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/products/electronics' });
    
    render(<DynamicTitle />);
    expect(screen.getByText('ELECTRONICS')).toBeInTheDocument();
  });

  test('formats last segment as fallback', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/some-random-page' });
    
    render(<DynamicTitle />);
    expect(screen.getByText('SOME RANDOM PAGE')).toBeInTheDocument();
  });

  test('handles ID segment by showing parent Details', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/rooms/123' });
    
    render(<DynamicTitle />);
    expect(screen.getByText('ROOMS DETAILS')).toBeInTheDocument();
  });
});
