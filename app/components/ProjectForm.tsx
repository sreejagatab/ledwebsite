"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectImage {
  id: string;
  url: string;
  alt: string | null;
  isFeatured: boolean;
}

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title: string;
    description: string;
    challenge: string;
    solution: string;
    results: string;
    category: string;
    client: string;
    location: string;
    completionDate: string;
    featured: boolean;
    mainImage: string;
  };
  galleryImages?: ProjectImage[];
  onSubmit: (formData: any, galleryImages: ProjectImage[]) => Promise<void>;
  submitButtonText?: string;
  cancelHref?: string;
  isEdit?: boolean;
}

export default function ProjectForm({
  initialData = {
    title: "",
    description: "",
    challenge: "",
    solution: "",
    results: "",
    category: "commercial",
    client: "",
    location: "",
    completionDate: "",
    featured: false,
    mainImage: ""
  },
  galleryImages: initialGalleryImages = [],
  onSubmit,
  submitButtonText = "Save",
  cancelHref = "/admin/projects",
  isEdit = false
}: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState(initialData);
  
  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<ProjectImage[]>(initialGalleryImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleAddGalleryImage = () => {
    if (!newImageUrl.trim()) {
      alert("Please enter an image URL");
      return;
    }
    
    const newImage: ProjectImage = {
      id: `temp-${Date.now()}`,
      url: newImageUrl,
      alt: newImageAlt || null,
      isFeatured: galleryImages.length === 0 // First image is featured by default
    };
    
    setGalleryImages(prev => [...prev, newImage]);
    setNewImageUrl("");
    setNewImageAlt("");
  };
  
  const handleRemoveGalleryImage = (id: string) => {
    setGalleryImages(prev => prev.filter(image => image.id !== id));
  };
  
  const handleToggleFeatureImage = (id: string) => {
    setGalleryImages(prev => 
      prev.map(image => ({
        ...image,
        isFeatured: image.id === id
      }))
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    
    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      
      if (!formData.mainImage.trim()) {
        throw new Error("Main image URL is required");
      }
      
      // Call the onSubmit handler
      await onSubmit(formData, galleryImages);
      
      // Show success message
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving project:", error);
      setSaveError(error instanceof Error ? error.message : "An error occurred while saving the project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Project {isEdit ? "updated" : "created"} successfully!
        </div>
      )}
      
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {saveError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="industrial">Industrial</option>
                <option value="architectural">Architectural</option>
                <option value="smart-home">Smart Home</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="completionDate" className="block text-sm font-medium text-gray-700 mb-1">
                Completion Date
              </label>
              <input
                type="date"
                id="completionDate"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-1">
                Main Image URL *
              </label>
              <input
                type="text"
                id="mainImage"
                name="mainImage"
                value={formData.mainImage}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/images/project1.jpg"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a brief overview of the project..."
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-1">
                Challenge
              </label>
              <textarea
                id="challenge"
                name="challenge"
                value={formData.challenge}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the challenges faced in this project..."
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
                Solution
              </label>
              <textarea
                id="solution"
                name="solution"
                value={formData.solution}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Explain the solution implemented..."
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="results" className="block text-sm font-medium text-gray-700 mb-1">
                Results
              </label>
              <textarea
                id="results"
                name="results"
                value={formData.results}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the outcomes and benefits achieved..."
              ></textarea>
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                  Featured Project
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Featured projects will be highlighted on the homepage.
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Gallery Images</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {galleryImages.map(image => (
                <div key={image.id} className="border border-gray-200 rounded-md p-3">
                  <div className="bg-gray-100 h-40 flex items-center justify-center mb-2">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-xs text-gray-500 truncate">{image.url}</p>
                    </div>
                  </div>
                  <div className="text-sm mb-2 truncate">
                    <span className="font-medium">Alt:</span> {image.alt || 'None'}
                  </div>
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatureImage(image.id)}
                      className={`px-2 py-1 text-xs rounded ${
                        image.isFeatured 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {image.isFeatured ? 'Featured' : 'Set as Featured'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(image.id)}
                      className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Add New Image</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Alt Text (optional)"
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link
              href={cancelHref}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
            >
              {isSaving ? "Saving..." : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 