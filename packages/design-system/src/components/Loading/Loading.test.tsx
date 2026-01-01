import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders correctly', () => {
    render(<Loading data-testid="loading" />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('passes through HTML attributes', () => {
    render(<Loading data-testid="loading" aria-label="Loading content" />);
    expect(screen.getByTestId('loading')).toHaveAttribute('aria-label', 'Loading content');
  });
});
