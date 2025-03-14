"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';
import ImageDisplay from '@/app/components/ImageDisplay';
import PlaceholderImage from '@/app/components/PlaceholderImage';

interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  isFeatured: boolean;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  category: string;
  client: string;
  location: string;
  completionDate: Date;
  featured: boolean;
  mainImage: string;
  galleryImages: ProjectImage[];
  createdAt: Date;
}

export default function ProjectDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    // Fetch project data
    if (status === 'authenticated' && projectId) {
      fetchProject();
    }
  }, [status, router, projectId]);
  
  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Find the project with the matching ID
      const foundProject = projects.find(p => p.id === projectId);
      
      if (foundProject) {
        // Convert date strings back to Date objects
        const projectWithDates = {
          ...foundProject,
          completionDate: new Date(foundProject.completionDate),
          createdAt: new Date(foundProject.createdAt)
        };
        
        setProject(projectWithDates);
        
        // Set gallery images
        if (Array.isArray(foundProject.galleryImages)) {
          // Ensure gallery images have the correct structure
          const formattedGalleryImages = foundProject.galleryImages.map(image => {
            if (typeof image === "string") {
              return {
                id: Math.random().toString(36).substring(2, 9),
                url: image,
                alt: null,
                isFeatured: false
              };
            }
            return image;
          });
          
          setGalleryImages(formattedGalleryImages);
        }
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (status === 'loading' || loading) {
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
              href="/admin/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
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
                <p className="text-sm text-yellow-700">Project not found</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Projects
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
          <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/admin/projects/${projectId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Project
            </Link>
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Projects
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about the project.</p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="md:col-span-2">
                <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg">
                  {project.mainImage ? (
                    <ImageDisplay
                      src={project.mainImage}
                      alt={project.title}
                      width={1200}
                      height={800}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <PlaceholderImage
                      width={1200}
                      height={800}
                      text="No main image"
                      className="w-full h-full"
                    />
                  )}
                  
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.category}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Client</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.client || 'N/A'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{project.location || 'N/A'}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(project.completionDate)}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Description</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description}</p>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Project Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Challenge</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.challenge || 'No challenge information provided.'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Solution</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.solution || 'No solution information provided.'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-2">Results</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.results || 'No results information provided.'}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gallery</h3>
                
                {project.galleryImages && project.galleryImages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.galleryImages.map((image, index) => (
                      <div key={index} className="relative h-48 overflow-hidden rounded-lg">
                        <ImageDisplay
                          src={image.url || image}
                          alt={image.alt || `Gallery image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                        {image.isFeatured && (
                          <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                            Featured
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No gallery images available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 