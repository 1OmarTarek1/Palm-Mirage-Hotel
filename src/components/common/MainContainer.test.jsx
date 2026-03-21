import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('./AppBreadcrumb', () => () => <div data-testid="breadcrumb" />);
jest.mock('./DynamicTitle', () => ({ customTitle }) => (
  <div data-testid="dynamic-title">{customTitle || 'DYNAMIC'}</div>
));

jest.mock('@/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const MainContainer = require('./MainContainer').default;

describe('MainContainer component', () => {
  test('renders children correctly', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/some-page' });
    
    render(
      <MainContainer>
        <div data-testid="child">Hello World</div>
      </MainContainer>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('renders title and breadcrumb when not on home page', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/about' });
    
    render(<MainContainer />);
    
    expect(screen.getByTestId('dynamic-title')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  test('hides header on home page', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/' });
    
    render(<MainContainer />);
    
    expect(screen.queryByTestId('dynamic-title')).not.toBeInTheDocument();
    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
  });

  test('respects showBreadcrumb prop', () => {
    const { useLocation } = require('react-router-dom');
    useLocation.mockReturnValue({ pathname: '/about' });
    
    render(<MainContainer showBreadcrumb={false} />);
    
    expect(screen.getByTestId('dynamic-title')).toBeInTheDocument();
    expect(screen.queryByTestId('breadcrumb')).not.toBeInTheDocument();
  });
});
