import { render, screen } from '@testing-library/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

describe('Select component', () => {
  test('renders correctly', () => {
    render(
      <Select>
        <SelectTrigger aria-label="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );
    expect(screen.getByLabelText('select-trigger')).toBeInTheDocument();
  });
});
