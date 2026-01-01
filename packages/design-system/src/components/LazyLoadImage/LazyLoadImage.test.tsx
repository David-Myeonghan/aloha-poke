import { render, screen, fireEvent } from '@testing-library/react';
import { LazyLoadImage } from './LazyLoadImage';

describe('LazyLoadImage', () => {
  const testImageUrl = 'https://example.com/image.png';
  const testAlt = 'Test image';

  it('renders image with correct src', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', testImageUrl);
  });

  it('renders image with alt text', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    expect(screen.getByAltText(testAlt)).toBeInTheDocument();
  });

  it('renders with lazy loading attribute', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders loading spinner initially', () => {
    const { container } = render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('hides loading spinner after image loads', () => {
    const { container } = render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const img = screen.getByRole('img');

    fireEvent.load(img);

    const loadingBox = container.querySelector('.loadingBox');
    expect(loadingBox).toHaveStyle({ display: 'none' });
  });

  it('shows image after load', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const img = screen.getByRole('img');

    fireEvent.load(img);

    expect(img).toHaveStyle({ visibility: 'visible' });
  });

  it('applies custom className to image', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} className="custom-class" />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('custom-class');
  });

  it('passes through additional img attributes', () => {
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} width={100} height={100} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });
});
