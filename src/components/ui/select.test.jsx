import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock dependencies BEFORE importing
jest.mock('@radix-ui/react-select', () => ({
  Root: ({ children }) => <div data-testid="select">{children}</div>,
  Trigger: ({ children, className }) => <button className={className}>{children}</button>,
  Value: ({ placeholder }) => <span>{placeholder}</span>,
  Portal: ({ children }) => <div>{children}</div>,
  Content: ({ children, className }) => <div className={className}>{children}</div>,
  Viewport: ({ children }) => <div>{children}</div>,
  Item: ({ children, className }) => <div className={className}>{children}</div>,
  ItemText: ({ children }) => <span>{children}</span>,
  ItemIndicator: ({ children }) => <div>{children}</div>,
  Label: ({ children }) => <label>{children}</label>,
  Separator: () => <hr />,
  Group: ({ children }) => <div>{children}</div>,
  Icon: ({ children }) => <div>{children}</div>,
  ScrollUpButton: ({ children }) => <div>{children}</div>,
  ScrollDownButton: ({ children }) => <div>{children}</div>,
}));

jest.mock('lucide-react', () => ({
  Check: () => <div />,
  ChevronDown: () => <div />,
  ChevronUp: () => <div />,
}));

jest.mock('@/lib/utils', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
}));

const { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } = require('./select');

describe('Select component', () => {
  test('renders basic structure', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    );
    
    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });
});
