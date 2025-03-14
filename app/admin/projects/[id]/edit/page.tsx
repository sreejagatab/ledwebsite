"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/app/components/ProjectForm";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";
import { syncAdminProjectsWithPortfolio } from '@/app/utils/projectSync';

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

interface SubmitStatus {
  success: boolean;
  message: string;
}

export default function EditProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
    
    // Fetch project data
    const fetchProject = () => {
      try {
        setIsLoading(true);
        
        // Get projects from localStorage
        const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
        const foundProject = projects.find(p => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
          setFormData(foundProject);
          setGalleryImages(foundProject.galleryImages || []);
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (status === "authenticated") {
      fetchProject();
    }
  }, [projectId, router, status]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.title || !formData.category) {
        setSubmitStatus({ success: false, message: 'Title and category are required' });
        return;
      }
      
      setSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing projects
      const existingProjects = getLocalData(STORAGE_KEYS.PROJECTS, []);
      
      // Find and update the project
      const updatedProjects = existingProjects.map((p: any) => 
        p.id === projectId ? { ...p, ...formData, galleryImages, updatedAt: new Date() } : p
      );
      
      // Save to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Sync with portfolio
      syncAdminProjectsWithPortfolio();
      
      setSubmitStatus({ 
        success: true, 
        message: 'Project updated successfully' 
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1500);
    } catch (error) {
      console.error('Error updating project:', error);
      setSubmitStatus({ 
        success: false, 
        message: 'Failed to update project. Please try again.' 
      });
    } finally {
      setSubmitting(false);
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
            {submitStatus && (
              <div className={`mb-4 ${submitStatus.success ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'} p-4`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{submitStatus.message}</p>
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
              isSubmitting={submitting}
              submitError={submitStatus?.message}
              submitSuccess={submitStatus?.success}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 