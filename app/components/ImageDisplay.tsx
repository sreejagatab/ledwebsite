"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export default function ImageDisplay({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = "", 
  priority = false 
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Default placeholder for missing images
  const placeholderSrc = "/images/placeholder.jpg";
  
  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
  };
  
  // Handle image load error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={error ? placeholderSrc : src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoadComplete}
        onError={handleError}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
} 