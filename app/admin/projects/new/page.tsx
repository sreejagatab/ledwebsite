"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProjectForm from '@/app/components/ProjectForm';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';
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

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    category: '',
    featured: false,
    mainImage: '',
    galleryImages: []
  });
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);
  
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
      
      // Generate a unique ID and slug for the new project
      const newProjectId = `project-${Date.now()}`;
      const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-');
      
      // Create the new project object
      const newProject = {
        id: newProjectId,
        ...formData,
        galleryImages,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Get current projects from localStorage
      const projects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      // Add the new project to the array
      const updatedProjects = [...projects, newProject];
      
      // Save updated projects to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Sync with portfolio
      syncAdminProjectsWithPortfolio();
      
      // Show success message
      setSubmitStatus({ 
        success: true, 
        message: 'Project created successfully' 
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/projects');
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      setSubmitStatus({ 
        success: false, 
        message: 'Failed to create project. Please try again.' 
      });
    } finally {
      setSubmitting(false);
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Create New Project</h1>
        <Link 
          href="/admin/projects" 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Projects
        </Link>
      </div>
      
      {submitStatus && (
        <div className={`mb-4 p-4 rounded-md ${
          submitStatus.success ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Architectural">Architectural</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleFormChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL
                </label>
                <input
                  type="text"
                  name="imageSrc"
                  value={formData.imageSrc || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  Featured Project
                </label>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/admin/projects')}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 