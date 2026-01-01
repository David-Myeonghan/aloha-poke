import { render, screen } from '@testing-library/react';
import { Loading } from './Loading';

describe('Loading', () => {
  it('renders with accessible role', () => {
    render(<Loading />);
    const loading = screen.getByRole('status');
    expect(loading).toBeInTheDocument();
    expect(loading).toHaveAttribute('aria-busy', 'true');
  });

  it('passes through HTML attributes', () => {
    render(<Loading aria-label="Loading content" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading content');
  });
});
