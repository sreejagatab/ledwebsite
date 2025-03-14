"use client";

import React from 'react';

interface PlaceholderImageProps {
  text?: string;
  width?: number;
  height?: number;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  text = 'No Image',
  width,
  height,
  className = '',
}) => {
  // Generate a random background color based on the text
  const getBackgroundColor = (text: string) => {
    const colors = [
      'bg-blue-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-red-200',
      'bg-purple-200',
      'bg-pink-200',
      'bg-indigo-200',
      'bg-gray-200',
    ];
    
    // Use the text to determine a consistent color
    const index = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };
  
  const bgColor = getBackgroundColor(text);
  
  return (
    <div
      className={`flex items-center justify-center ${bgColor} text-gray-700 font-medium ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : '100%' }}
    >
      <div className="text-center p-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default PlaceholderImage; 