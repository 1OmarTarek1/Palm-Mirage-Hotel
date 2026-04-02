import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock sub-components
jest.mock('@/components/activities/ActivityHero', () => () => <div data-testid="activity-hero" />);
jest.mock('@/components/activities/ActivityCategories', () => ({ active, onChange }) => (
  <div data-testid="activity-categories">
    <button onClick={() => onChange('Summer')}>Summer</button>
  </div>
));
jest.mock('@/components/activities/ActivityDetails', () => ({ activities }) => (
  <div data-testid="activity-details">
    {activities.map(a => <div key={a.id}>{a.title}</div>)}
  </div>
));
jest.mock('@/components/activities/ActivityBooking', () => () => <div data-testid="activity-booking" />);

jest.mock('@/services/activityService', () => ({
  fetchActivities: jest.fn().mockResolvedValue([
    { id: 1, title: 'Skiing', category: 'Winter' },
    { id: 2, title: 'Hiking', category: 'Summer' },
  ]),
}));

const Activities = require('./Activities').default;

describe('Activities page', () => {
  test('renders hero and booking sections', () => {
    render(<Activities />);
    expect(screen.getByTestId('activity-hero')).toBeInTheDocument();
    expect(screen.getByTestId('activity-booking')).toBeInTheDocument();
  });

  test('filters activities when category changes', () => {
    render(<Activities />);

    // Initially all activities
    expect(screen.getByText('Loading activities...')).toBeInTheDocument();
  });

  test('shows fetched activities and filters when category changes', async () => {
    render(<Activities />);

    expect(await screen.findByText('Skiing')).toBeInTheDocument();
    expect(screen.getByText('Hiking')).toBeInTheDocument();

    // Change category to Summer
    const summerBtn = screen.getByText('Summer');
    fireEvent.click(summerBtn);

    expect(screen.queryByText('Skiing')).not.toBeInTheDocument();
    expect(screen.getByText('Hiking')).toBeInTheDocument();
  });
});
