import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders children correctly', () => {
    render(<Typography size="t3">Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders h1 tag for t1 size', () => {
    render(<Typography size="t1">Heading 1</Typography>);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders h2 tag for t2 size', () => {
    render(<Typography size="t2">Heading 2</Typography>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders p tag for t3/t4 size', () => {
    const { container, rerender } = render(<Typography size="t3">Paragraph</Typography>);
    expect(container.querySelector('p')).toBeInTheDocument();

    rerender(<Typography size="t4">Small text</Typography>);
    expect(container.querySelector('p')).toBeInTheDocument();
  });

  it('uses custom tag when as prop is provided', () => {
    const { container } = render(<Typography size="t1" as="span">Span text</Typography>);
    expect(container.querySelector('span')).toBeInTheDocument();
    expect(container.querySelector('h1')).not.toBeInTheDocument();
  });

  it('passes through HTML attributes', () => {
    render(<Typography size="t3" data-testid="typography" aria-label="Description">Test</Typography>);
    const element = screen.getByTestId('typography');
    expect(element).toHaveAttribute('aria-label', 'Description');
  });
});
