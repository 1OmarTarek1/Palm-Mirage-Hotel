import { render, screen } from '@testing-library/react';
import { Field, FieldLabel, FieldDescription, FieldError } from './field';

describe('Field components', () => {
  test('renders Field correctly', () => {
    render(
      <Field>
        <FieldLabel>Name</FieldLabel>
        <FieldDescription>Enter your full name</FieldDescription>
        <FieldError errors={[{ message: 'Required' }]}>Required</FieldError>
      </Field>
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });
});
