"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/app/components/ProjectForm";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";

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
  challenge: string | null;
  solution: string | null;
  results: string | null;
  category: string;
  client: string | null;
  location: string | null;
  completionDate: string | null;
  featured: boolean;
  mainImage: string;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export default function EditProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    // Fetch project data
    if (status === "authenticated" && projectId) {
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
        // Format date for the form
        const formattedProject = {
          ...foundProject,
          completionDate: foundProject.completionDate instanceof Date 
            ? foundProject.completionDate.toISOString().split("T")[0] 
            : new Date(foundProject.completionDate).toISOString().split("T")[0]
        };
        
        setProject(formattedProject);
        
        // Set gallery images
        if (Array.isArray(foundProject.images)) {
          // Ensure gallery images have the correct structure
          const formattedGalleryImages = foundProject.images.map(image => {
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
        setError("Project not found");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (formData: any, galleryImages: ProjectImage[]) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // In a real application, you would call your API to update the project
      console.log("Updating project:", { formData, galleryImages });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get current projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Update the project in the array
      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
          return {
            ...p,
            ...formData,
            galleryImages,
            updatedAt: new Date()
          };
        }
        return p;
      });
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/admin/projects/${projectId}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating project:", error);
      setSubmitError("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-semibold text-gray-900">Edit Project</h1>
          <Link
            href={`/admin/projects/${projectId}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Project Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit the project details below.</p>
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
                    <p className="text-sm text-green-700">Project updated successfully!</p>
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
              initialData={project}
              galleryImages={galleryImages}
              onSubmit={handleSubmit}
              submitButtonText="Update Project"
              cancelHref={`/admin/projects/${projectId}`}
              isEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 