import React from 'react';
import { render, screen } from '@testing-library/react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from './carousel';

// Embla carousel needs to be mocked or it will fail in JSDOM
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => [jest.fn(), {
    on: jest.fn(),
    off: jest.fn(),
    canScrollPrev: jest.fn(() => true),
    canScrollNext: jest.fn(() => true),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
  }]);
});

describe('Carousel component', () => {
  test('renders Carousel with items and controls', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    expect(screen.getByRole('region')).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Previous slide')).toBeInTheDocument();
    expect(screen.getByText('Next slide')).toBeInTheDocument();
  });
});
