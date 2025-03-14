"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/app/components/ProjectForm";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";

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

export default function EditProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
    
    if (status === "authenticated") {
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
        setError("Project not found");
        setIsLoading(false);
        return;
      }
      
      // Convert date strings back to Date objects
      const formattedProject = {
        ...foundProject,
        completionDate: foundProject.completionDate ? new Date(foundProject.completionDate) : new Date(),
        createdAt: foundProject.createdAt ? new Date(foundProject.createdAt) : new Date()
      };
      
      setProject(formattedProject);
      
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
        
        setGalleryImages(formattedGalleryImages);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      setError("Failed to load project details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (formData: Omit<Project, "id" | "createdAt">) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // In a real application, you would call your API to update the project
      console.log("Updating project:", { ...formData, galleryImages });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get current projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Find the project index
      const projectIndex = projects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error("Project not found");
      }
      
      // Create the updated project object
      const updatedProject = {
        ...projects[projectIndex],
        ...formData,
        galleryImages,
        updatedAt: new Date()
      };
      
      // Update the project in the array
      const updatedProjects = [...projects];
      updatedProjects[projectIndex] = updatedProject;
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Update local state
      setProject(updatedProject);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating project:", error);
      setSubmitError("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
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
                <p className="text-sm text-red-700">{error || "Project not found"}</p>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Project: {project.title}</h1>
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
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Edit the details for this project.</p>
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
              initialData={{
                title: project.title,
                slug: project.slug,
                description: project.description,
                category: project.category,
                featured: project.featured,
                mainImage: project.mainImage,
                completionDate: project.completionDate
              }}
              galleryImages={galleryImages}
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