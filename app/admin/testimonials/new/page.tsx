"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TestimonialForm from '@/app/components/TestimonialForm';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  projectId?: string;
  createdAt: Date;
}

export default function NewTestimonial() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  const handleSubmit = async (formData: Testimonial) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // In a real application, you would call your API to create the testimonial
      console.log('Creating testimonial:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID for the new testimonial
      const newTestimonialId = `testimonial-${Date.now()}`;
      
      // Create the new testimonial object
      const newTestimonial = {
        id: newTestimonialId,
        ...formData,
        createdAt: new Date()
      };
      
      // Get current testimonials from localStorage
      const testimonials = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
      
      // Add the new testimonial to the array
      const updatedTestimonials = [...testimonials, newTestimonial];
      
      // Save updated testimonials to localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/testimonials/${newTestimonialId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating testimonial:', error);
      setSubmitError('Failed to create testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Testimonial</h1>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Testimonial Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the details for the new testimonial.</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {submitSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Testimonial created successfully!</p>
                  </div>
                </div>
              </div>
            )}
            
            {submitError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                </div>
              </div>
            )}
            
            <TestimonialForm
              initialData={{
                name: '',
                position: '',
                company: '',
                content: '',
                imageUrl: '',
                featured: false
              }}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitError={submitError || undefined}
              submitSuccess={submitSuccess}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 