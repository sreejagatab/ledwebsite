"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectForm from '@/app/components/ProjectForm';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

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

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);
  
  const handleSubmit = async (formData: Omit<Project, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // In a real application, you would call your API to create the project
      console.log('Creating project:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a unique ID and slug for the new project
      const newProjectId = `project-${Date.now()}`;
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');
      
      // Create the new project object
      const newProject = {
        id: newProjectId,
        ...formData,
        slug,
        createdAt: new Date()
      };
      
      // Get current projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Add the new project to the array
      const updatedProjects = [...projects, newProject];
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/projects/${newProjectId}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === "loading") {
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
          <h1 className="text-2xl font-semibold text-gray-900">Add New Project</h1>
          <Link
            href="/admin/projects"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter the details for the new project.</p>
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
                    <p className="text-sm text-green-700">Project created successfully!</p>
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
            
            <ProjectForm
              initialData={{
                title: '',
                slug: '',
                description: '',
                category: '',
                featured: false,
                mainImage: '',
                completionDate: new Date()
              }}
              galleryImages={[]}
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