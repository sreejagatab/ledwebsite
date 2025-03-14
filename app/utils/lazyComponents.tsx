"use client";

import { lazy, Suspense } from 'react';

// Loading fallback component
export const LoadingFallback = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-3 text-gray-600">Loading component...</p>
  </div>
);

// Lazy loaded components
export const LazyProjectForm = lazy(() => import('@/app/components/ProjectForm'));
export const LazyTestimonialForm = lazy(() => import('@/app/components/TestimonialForm'));
export const LazyInquiryForm = lazy(() => import('@/app/components/InquiryForm'));
export const LazySettingsForm = lazy(() => import('@/app/components/SettingsForm'));
export const LazyDataTable = lazy(() => import('@/app/components/DataTable'));
export const LazyDashboardStats = lazy(() => import('@/app/components/DashboardStats'));

// Higher-order component to wrap lazy-loaded components with Suspense
export function withSuspense<T>(Component: React.ComponentType<T>) {
  return function WithSuspense(props: T) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    );
  };
} 