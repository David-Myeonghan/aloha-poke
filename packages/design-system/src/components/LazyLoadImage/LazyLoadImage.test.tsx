import { render, screen } from '@testing-library/react';
import { LazyLoadImage } from './LazyLoadImage';

describe('LazyLoadImage', () => {
  const testImageUrl = 'https://example.com/image.png';
  const testAlt = 'Test image';

  it('renders image with correct src', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', testImageUrl);
  });

  it('renders image with alt text', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    expect(screen.getByAltText(testAlt)).toBeInTheDocument();
  });

  it('has lazy loading attribute', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
  });

  it('passes through HTML attributes', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} width={100} height={100} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });
});
