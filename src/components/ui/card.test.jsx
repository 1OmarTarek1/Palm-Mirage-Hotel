import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';

describe('Card components', () => {
  test('renders Card and its children', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  test('applies custom className to Card', () => {
    const { container } = render(<Card className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
