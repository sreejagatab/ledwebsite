import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import ImageDisplay from '@/app/components/ImageDisplay';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, priority, className, ...props }: any) => {
    // Simulate the image load or error based on the src
    if (src === '/images/error-image.jpg') {
      setTimeout(() => onError && onError(), 0);
    } else {
      setTimeout(() => onLoad && onLoad(), 0);
    }
    // Convert priority to a string to avoid React warnings
    const priorityStr = priority ? 'true' : 'false';
    return (
      <img 
        src={src} 
        alt={alt} 
        data-priority={priorityStr} 
        className={className}
        {...props} 
        data-testid="next-image" 
      />
    );
  },
}));

// Mock the PlaceholderImage component
jest.mock('@/app/components/PlaceholderImage', () => ({
  __esModule: true,
  default: ({ text, ...props }: { text: string, [key: string]: any }) => (
    <div data-testid="placeholder-image" {...props}>{text}</div>
  ),
}));

describe('ImageDisplay Component', () => {
  it('should render loading state initially', () => {
    render(<ImageDisplay src="/images/test.jpg" alt="Test Image" />);
    
    // Check if loading spinner is visible by looking for the animate-spin class
    const spinnerContainer = screen.getByTestId('next-image').parentElement?.querySelector('.animate-spin');
    expect(spinnerContainer).toBeInTheDocument();
  });

  it('should render the image after loading', async () => {
    const { rerender } = render(<ImageDisplay src="/images/test.jpg" alt="Test Image" />);
    
    // Get the image element
    const image = screen.getByTestId('next-image');
    
    // Manually trigger the load event
    await act(async () => {
      fireEvent.load(image);
    });
    
    // Force a re-render to ensure state updates are applied
    rerender(<ImageDisplay src="/images/test.jpg" alt="Test Image" />);
    
    // Now check if the image has the opacity-100 class
    await waitFor(() => {
      expect(screen.getByTestId('next-image')).toHaveClass('opacity-100');
    });
    
    // The spinner should no longer be visible
    const spinnerContainer = screen.queryByText('', { selector: '.animate-spin' });
    expect(spinnerContainer).not.toBeInTheDocument();
  });

  it('should render placeholder when image fails to load', async () => {
    render(<ImageDisplay src="/images/error-image.jpg" alt="Error Image" />);
    
    // Get the image element
    const image = screen.getByTestId('next-image');
    
    // Manually trigger the error event
    await act(async () => {
      fireEvent.error(image);
    });
    
    // Check if the placeholder is shown
    await waitFor(() => {
      expect(screen.getByTestId('placeholder-image')).toBeInTheDocument();
    });
    
    // Check if the placeholder has the correct text
    expect(screen.getByTestId('placeholder-image')).toHaveTextContent('No image: Error Image');
  });

  it('should apply custom className', async () => {
    const customClass = "custom-class";
    render(
      <ImageDisplay 
        src="/images/test.jpg" 
        alt="Test Image" 
        className={customClass} 
      />
    );
    
    // Check if the container has the custom class
    const container = screen.getByTestId('next-image').closest('div');
    expect(container).toHaveClass(customClass);
  });
}); 