import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all sub-components
jest.mock('../../components/home/HeroCarousel', () => () => <div data-testid="hero-carousel" />);
jest.mock('../../components/home/AboutSection', () => () => <div data-testid="about-section" />);
jest.mock('../../components/home/RoomCardsSection', () => () => <div data-testid="room-cards-section" />);
jest.mock('../../components/home/RoomsPlatformsSection', () => () => <div data-testid="rooms-platforms-section" />);
jest.mock('../../components/home/HomeExperience', () => () => <div data-testid="home-experience" />);
jest.mock('../../components/home/ActivitiesSection', () => () => <div data-testid="activities-section" />);
jest.mock('../../components/about/ActivitiesTestimonials', () => () => <div data-testid="activities-testimonials" />);
jest.mock('../../components/home/SectionNavigator', () => () => <div data-testid="section-navigator" />);
jest.mock('../../components/home/AwardsSection', () => () => <div data-testid="awards-section" />);
jest.mock('../../components/home/ContactCTA', () => () => <div data-testid="contact-cta" />);
jest.mock('../../components/home/LazySection', () => ({ children }) => <>{children}</>);

const Home = require('./Home').default;

describe('Home page', () => {
  test('renders all sections', () => {
    render(<Home />);

    expect(screen.getByTestId('section-navigator')).toBeInTheDocument();
    expect(screen.getByTestId('hero-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('about-section')).toBeInTheDocument();
    expect(screen.getByTestId('room-cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('home-experience')).toBeInTheDocument();
    expect(screen.getByTestId('activities-section')).toBeInTheDocument();
    expect(screen.getByTestId('activities-testimonials')).toBeInTheDocument();
    expect(screen.getByTestId('rooms-platforms-section')).toBeInTheDocument();
    expect(screen.getByTestId('awards-section')).toBeInTheDocument();
    expect(screen.getByTestId('contact-cta')).toBeInTheDocument();
  });
});
