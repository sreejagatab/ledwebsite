"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/app/components/DataTable';
import Image from 'next/image';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';
import PlaceholderImage from '@/app/components/PlaceholderImage';
import { syncAdminProjectsWithPortfolio } from '@/app/utils/projectSync';

// Types
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: boolean;
  mainImage: string;
  galleryImages: string[];
  completionDate: Date;
  createdAt: Date;
}

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    // Fetch projects
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status, router]);
  
  const fetchProjects = async () => {
    setLoading(true);
    
    try {
      // First check if we have data in localStorage
      const savedProjects = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      
      if (savedProjects && savedProjects.length > 0) {
        // Convert date strings back to Date objects
        const projectsWithDates = savedProjects.map(project => ({
          ...project,
          completionDate: new Date(project.completionDate),
          createdAt: new Date(project.createdAt)
        }));
        
        setProjects(projectsWithDates);
        setLoading(false);
        return;
      }
      
      // If no data in localStorage, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock projects data
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Commercial Office LED Retrofit',
          slug: 'commercial-office-led-retrofit',
          description: 'Complete LED lighting upgrade for a 10,000 sq ft office space, reducing energy costs by 40%.',
          category: 'Commercial',
          featured: true,
          mainImage: '/images/projects/office-main.jpg',
          galleryImages: [
            '/images/projects/office-1.jpg',
            '/images/projects/office-2.jpg',
            '/images/projects/office-3.jpg'
          ],
          completionDate: new Date('2023-05-15'),
          createdAt: new Date('2023-04-10')
        },
        {
          id: '2',
          title: 'Retail Store Lighting Installation',
          slug: 'retail-store-lighting-installation',
          description: 'Custom lighting design for a high-end retail store, enhancing product displays and customer experience.',
          category: 'Retail',
          featured: true,
          mainImage: '/images/projects/retail-main.jpg',
          galleryImages: [
            '/images/projects/retail-1.jpg',
            '/images/projects/retail-2.jpg'
          ],
          completionDate: new Date('2023-06-02'),
          createdAt: new Date('2023-05-01')
        },
        {
          id: '3',
          title: 'Restaurant Ambient Lighting',
          slug: 'restaurant-ambient-lighting',
          description: 'Mood lighting installation for a fine dining restaurant, creating the perfect atmosphere for guests.',
          category: 'Hospitality',
          featured: false,
          mainImage: '/images/projects/restaurant-main.jpg',
          galleryImages: [
            '/images/projects/restaurant-1.jpg',
            '/images/projects/restaurant-2.jpg',
            '/images/projects/restaurant-3.jpg',
            '/images/projects/restaurant-4.jpg'
          ],
          completionDate: new Date('2023-06-20'),
          createdAt: new Date('2023-05-15')
        },
        {
          id: '4',
          title: 'Residential Smart Lighting System',
          slug: 'residential-smart-lighting-system',
          description: 'Integrated smart home lighting system for a luxury residence, with voice and app control.',
          category: 'Residential',
          featured: false,
          mainImage: '/images/projects/residential-main.jpg',
          galleryImages: [
            '/images/projects/residential-1.jpg',
            '/images/projects/residential-2.jpg'
          ],
          completionDate: new Date('2023-07-05'),
          createdAt: new Date('2023-06-01')
        }
      ];
      
      setProjects(mockProjects);
      
      // Save to localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleDelete = async (id: string) => {
    console.log("Deleting project:", id);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      
      // Update localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
      
      // Sync with portfolio
      syncAdminProjectsWithPortfolio();
      
      // Show success message
      setAlert({
        type: 'success',
        message: 'Project deleted successfully'
      });
      
      // Clear alert after 3 seconds
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
      setAlert({
        type: 'error',
        message: 'Failed to delete project'
      });
    }
  };
  
  const handleToggleFeatured = async (project: Project) => {
    try {
      // In a real application, you would call your API to update the project
      console.log('Toggling featured status for project:', project.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, featured: !p.featured } : p
      );
      
      setProjects(updatedProjects);
      
      // Update localStorage
      setLocalData(STORAGE_KEYS.PROJECTS, updatedProjects);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    }
  };
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.category.toLowerCase().includes(searchLower)
    );
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Define columns for DataTable
  const columns = [
    {
      header: 'Project',
      accessor: (project: Project) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden rounded-md">
            {project.mainImage ? (
              <Image
                src={project.mainImage}
                alt={project.title}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <PlaceholderImage width={40} height={40} text="" />
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{project.title}</div>
            <div className="text-sm text-gray-500">{project.category}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: (project: Project) => (
        <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
      )
    },
    {
      header: 'Featured',
      accessor: (project: Project) => (
        <span className={project.featured ? 'text-green-600' : 'text-gray-400'}>
          {project.featured ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Completion Date',
      accessor: (project: Project) => formatDate(project.completionDate)
    }
  ];
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <Link 
          href="/admin/projects/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Project
        </Link>
      </div>
      
      {alert && (
        <div className={`mb-4 p-4 rounded-md ${
          alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {alert.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Search and filter */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search projects..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Projects list */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DataTable
              data={filteredProjects}
              columns={columns}
              keyField="id"
              onDelete={handleDelete}
              editPath="/admin/projects/:id/edit"
              actions={[
                {
                  label: 'Toggle Featured',
                  onClick: handleToggleFeatured,
                  className: 'text-purple-600 hover:text-purple-800 px-2 py-1 rounded hover:bg-gray-50'
                }
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
} 