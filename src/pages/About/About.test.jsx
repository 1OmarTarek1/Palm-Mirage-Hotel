import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all sub-components
jest.mock('@/components/about/AboutHero', () => () => <div data-testid="about-hero" />);
jest.mock('@/components/about/AchievementsSection', () => () => <div data-testid="achievements-section" />);
jest.mock('@/components/about/HistoryDevelopmentSection', () => () => <div data-testid="history-development" />);
jest.mock('@/components/about/ActivitiesTestimonials', () => () => <div data-testid="activities-testimonials" />);
jest.mock('@/components/about/PartnersSection', () => () => <div data-testid="partners-section" />);

const About = require('./About').default;

describe('About page', () => {
  test('renders all sections', () => {
    render(<About />);
    
    expect(screen.getByTestId('about-hero')).toBeInTheDocument();
    expect(screen.getByTestId('achievements-section')).toBeInTheDocument();
    expect(screen.getByTestId('history-development')).toBeInTheDocument();
    expect(screen.getByTestId('activities-testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('partners-section')).toBeInTheDocument();
  });
});
