import { render, screen, fireEvent } from '@testing-library/react';
import { LazyLoadImage } from './LazyLoadImage';

describe('LazyLoadImage', () => {
  const testImageUrl = 'https://example.com/image.png';
  const testAlt = 'Test image';

  it('shows loading spinner initially', () => {
    // Arrange & Act
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);

    // Assert
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('hides loading spinner after image loads', () => {
    // Arrange
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);
    const img = screen.getByAltText(testAlt);

    // Act
    fireEvent.load(img);

    // Assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders image with correct src and lazy loading', () => {
    // Arrange & Act
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} />);

    // Assert
    const img = screen.getByAltText(testAlt);
    expect(img).toHaveAttribute('src', testImageUrl);
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('passes through HTML attributes', () => {
    // Arrange & Act
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} width={100} height={100} />);

    // Assert
    const img = screen.getByAltText(testAlt);
    expect(img).toHaveAttribute('width', '100');
    expect(img).toHaveAttribute('height', '100');
  });

  it('uses fallbackSrc when image fails to load', () => {
    // Arrange
    const fallbackUrl = 'https://example.com/fallback.png';
    render(<LazyLoadImage imageSource={testImageUrl} alt={testAlt} fallbackSrc={fallbackUrl} />);
    const img = screen.getByAltText(testAlt);

    // Act
    fireEvent.error(img);

    // Assert
    expect(img).toHaveAttribute('src', fallbackUrl);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
