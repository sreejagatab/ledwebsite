import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ImageDisplay from '@/app/components/ImageDisplay';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, ...props }: any) => {
    // Simulate the image load or error based on the src
    if (src === '/images/error-image.jpg') {
      setTimeout(() => onError(), 0);
    } else {
      setTimeout(() => onLoad(), 0);
    }
    return <img src={src} alt={alt} {...props} data-testid="next-image" />;
  },
}));

// Mock the PlaceholderImage component
jest.mock('@/app/components/PlaceholderImage', () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="placeholder-image">{text}</div>
  ),
}));

describe('ImageDisplay Component', () => {
  it('should render loading state initially', () => {
    render(<ImageDisplay src="/images/test.jpg" alt="Test Image" />);
    
    // Check if loading spinner is visible
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render the image after loading', async () => {
    render(<ImageDisplay src="/images/test.jpg" alt="Test Image" />);
    
    // Wait for the image to load
    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });
    
    // Check if loading spinner is not visible anymore
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should render placeholder when image fails to load', async () => {
    render(<ImageDisplay src="/images/error-image.jpg" alt="Error Image" />);
    
    // Wait for the error to occur
    await waitFor(() => {
      expect(screen.getByTestId('placeholder-image')).toBeInTheDocument();
    });
    
    // Check if the placeholder has the correct text
    expect(screen.getByTestId('placeholder-image')).toHaveTextContent('No image: Error Image');
  });

  it('should apply custom className', async () => {
    render(
      <ImageDisplay 
        src="/images/test.jpg" 
        alt="Test Image" 
        className="custom-class" 
      />
    );
    
    // Wait for the image to load
    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });
    
    // Check if the container has the custom class
    expect(screen.getByTestId('next-image').parentElement).toHaveClass('custom-class');
  });
}); 