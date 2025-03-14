"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";
import ImageDisplay from "@/app/components/ImageDisplay";
import PlaceholderImage from "@/app/components/PlaceholderImage";

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

export default function TestimonialDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;
  
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    // Fetch testimonial data
    if (status === "authenticated" && testimonialId) {
      fetchTestimonial();
    }
  }, [status, router, testimonialId]);
  
  const fetchTestimonial = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get testimonials from localStorage
      const testimonials = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
      
      // Find the testimonial with the matching ID
      const foundTestimonial = testimonials.find(t => t.id === testimonialId);
      
      if (foundTestimonial) {
        // Convert date strings back to Date objects
        const testimonialWithDates = {
          ...foundTestimonial,
          createdAt: new Date(foundTestimonial.createdAt)
        };
        
        setTestimonial(testimonialWithDates);
      } else {
        setError("Testimonial not found");
      }
    } catch (error) {
      console.error("Error fetching testimonial:", error);
      setError("Failed to load testimonial. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this testimonial? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    
    try {
      // Get testimonials from localStorage
      const testimonials = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
      
      // Filter out the testimonial to delete
      const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
      
      // Save updated testimonials to localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
      
      // Show success message
      setDeleteSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/testimonials");
      }, 1500);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setDeleteError("Failed to delete testimonial. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleToggleFeatured = async () => {
    if (!testimonial) return;
    
    setIsTogglingFeatured(true);
    
    try {
      // Get testimonials from localStorage
      const testimonials = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
      
      // Update the testimonial's featured status
      const updatedTestimonials = testimonials.map(t => {
        if (t.id === testimonialId) {
          return { ...t, featured: !t.featured };
        }
        return t;
      });
      
      // Save updated testimonials to localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
      
      // Update local state
      setTestimonial({ ...testimonial, featured: !testimonial.featured });
    } catch (error) {
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial. Please try again.");
    } finally {
      setIsTogglingFeatured(false);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  
  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href="/admin/testimonials"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Testimonials
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!testimonial) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Testimonial not found</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href="/admin/testimonials"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Testimonials
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Testimonial Details</h1>
          <div className="flex space-x-3">
            <Link
              href={`/admin/testimonials/${testimonialId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Testimonial
            </Link>
            <Link
              href="/admin/testimonials"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Testimonials
            </Link>
          </div>
        </div>
        
        {deleteSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Testimonial deleted successfully! Redirecting...</p>
              </div>
            </div>
          </div>
        )}
        
        {deleteError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Testimonial Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the testimonial.</p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
                    {testimonial.imageUrl ? (
                      <ImageDisplay
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        width={160}
                        height={160}
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        width={160}
                        height={160}
                        text="No image"
                        className="rounded-full"
                      />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                  
                  <div className="mt-4 flex flex-col space-y-2 w-full">
                    <button
                      onClick={handleToggleFeatured}
                      disabled={isTogglingFeatured}
                      className={`inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        testimonial.featured
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Testimonial Details</h1>
          <p className="text-gray-600">ID: {testimonial.id}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/admin/testimonials/${testimonial.id}/edit`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
          >
            Edit
          </Link>
          <button
            onClick={handleDeleteTestimonial}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                {testimonial.imageUrl ? (
                  <div className="text-center">
                    <div className="text-6xl mb-2">👤</div>
                    <p className="text-gray-500">{testimonial.imageUrl}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-2">👤</div>
                    <p>No profile image</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Testimonial Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client Name:</span>
                    <span className="ml-2 text-sm text-gray-900">{testimonial.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Position:</span>
                    <span className="ml-2 text-sm text-gray-900">{testimonial.position || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Company:</span>
                    <span className="ml-2 text-sm text-gray-900">{testimonial.company || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Featured:</span>
                    <span className="ml-2">
                      <button 
                        onClick={handleToggleFeatured}
                        className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                          testimonial.featured ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                          testimonial.featured ? 'translate-x-0' : '-translate-x-2'
                        }`}></span>
                      </button>
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date Added:</span>
                    <span className="ml-2 text-sm text-gray-900">{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                  </div>
                  {testimonial.projectId && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Related Project:</span>
                      <Link 
                        href={`/admin/projects/${testimonial.projectId}`}
                        className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Project
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Testimonial Content</h3>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
                  >
                    Edit Testimonial
                  </Link>
                  <button
                    onClick={handleDeleteTestimonial}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
                  >
                    {isDeleting ? "Deleting..." : "Delete Testimonial"}
                  </button>
                  <button
                    onClick={handleToggleFeatured}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      testimonial.featured 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {testimonial.featured ? 'Remove from Featured' : 'Mark as Featured'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 