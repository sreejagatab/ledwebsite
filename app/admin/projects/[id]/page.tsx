"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';
import PlaceholderImage from '@/app/components/PlaceholderImage';

interface GalleryImage {
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
  category: string;
  featured: boolean;
  mainImage: string;
  galleryImages: GalleryImage[];
  completionDate: Date;
  createdAt: Date;
}

export default function ProjectDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchProject();
    }
  }, [status, projectId, router]);
  
  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, you would call your API to fetch the project
      // For now, we'll get it from localStorage
      
      // Get projects from localStorage
      const projects = getLocalData<any[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Find the project by ID
      const foundProject = projects.find(p => p.id === projectId);
      
      if (!foundProject) {
        setError('Project not found');
        setIsLoading(false);
        return;
      }
      
      // Convert date strings back to Date objects
      const formattedProject = {
        ...foundProject,
        completionDate: foundProject.completionDate ? new Date(foundProject.completionDate) : null,
        createdAt: foundProject.createdAt ? new Date(foundProject.createdAt) : new Date()
      };
      
      // Set gallery images
      if (Array.isArray(foundProject.galleryImages)) {
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
        
        formattedProject.galleryImages = formattedGalleryImages;
      } else {
        formattedProject.galleryImages = [];
      }
      
      setProject(formattedProject);
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    // Ask for confirmation
    const confirmed = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    
    if (!confirmed) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    
    try {
      // In a real application, you would call your API to delete the project
      // For now, we'll remove it from localStorage
      
      // Get projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Filter out the project to delete
      const updatedProjects = projects.filter(p => p.id !== projectId);
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Show success message
      setDeleteSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1500);
    } catch (error) {
      console.error('Error deleting project:', error);
      setDeleteError('Failed to delete project. Please try again.');
      setIsDeleting(false);
    }
  };
  
  const handleToggleFeatured = async () => {
    if (!project) return;
    
    try {
      // Get projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Find the project and update its featured status
      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            featured: !project.featured
          };
        }
        return p;
      });
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Update the local state
      setProject({
        ...project,
        featured: !project.featured
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Failed to update featured status. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error || 'Project not found'}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
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
        {deleteSuccess && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">Project deleted successfully!</p>
              </div>
            </div>
          </div>
        )}
        
        {deleteError && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleToggleFeatured}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                project.featured
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {project.featured ? 'Featured' : 'Set as Featured'}
            </button>
            <Link
              href={`/admin/projects/${projectId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">View detailed information about this project.</p>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.title}</dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Slug</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.slug}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{project.category}</dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.featured ? 'Featured' : 'Not Featured'}
                  </span>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {project.completionDate ? format(new Date(project.completionDate), 'MMMM d, yyyy') : 'Not specified'}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {format(new Date(project.createdAt), 'MMMM d, yyyy')}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                  {project.description}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Main Image</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="w-full h-64 relative rounded-lg overflow-hidden">
                    {project.mainImage ? (
                      <Image
                        src={project.mainImage}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <PlaceholderImage text={project.title} />
                    )}
                  </div>
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Gallery Images</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {project.galleryImages && project.galleryImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {project.galleryImages.map((image, index) => (
                        <div key={image.id || index} className="relative h-48 rounded-lg overflow-hidden">
                          {image.url ? (
                            <>
                              <Image
                                src={image.url}
                                alt={image.alt || `Gallery image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {image.isFeatured && (
                                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                  Featured
                                </div>
                              )}
                            </>
                          ) : (
                            <PlaceholderImage text={`Gallery ${index + 1}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No gallery images</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 