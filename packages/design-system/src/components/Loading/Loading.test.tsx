import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders correctly', () => {
    render(<Loading data-testid="loading" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Loading data-testid="loading" size="small" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    rerender(<Loading data-testid="loading" size="medium" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders with default size', () => {
    render(<Loading data-testid="loading" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Loading data-testid="loading" className="custom-class" />);
    expect(screen.getByTestId('loading')).toHaveClass('custom-class');
  });

  it('passes through additional HTML attributes', () => {
    render(<Loading data-testid="loading" aria-label="Loading content" />);
    expect(screen.getByTestId('loading')).toHaveAttribute('aria-label', 'Loading content');
  });
});
