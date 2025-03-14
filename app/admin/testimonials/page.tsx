"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/app/components/DataTable';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

// Types
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

export default function AdminTestimonials() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    // Fetch testimonials
    if (status === 'authenticated') {
      fetchTestimonials();
    }
  }, [status, router]);
  
  const fetchTestimonials = async () => {
    setLoading(true);
    
    try {
      // First check if we have data in localStorage
      const savedTestimonials = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, []);
      
      if (savedTestimonials && savedTestimonials.length > 0) {
        // Convert date strings back to Date objects
        const testimonialsWithDates = savedTestimonials.map(testimonial => ({
          ...testimonial,
          createdAt: new Date(testimonial.createdAt)
        }));
        
        setTestimonials(testimonialsWithDates);
        setLoading(false);
        return;
      }
      
      // If no data in localStorage, use mock data
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock testimonials data
      const mockTestimonials: Testimonial[] = [
        {
          id: '1',
          name: 'John Smith',
          position: 'CEO',
          company: 'TechCorp',
          content: 'The LED installation transformed our office space. Energy costs are down and employee satisfaction is up!',
          imageUrl: '/images/testimonials/john-smith.jpg',
          featured: true,
          createdAt: new Date('2023-05-10')
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          position: 'Store Manager',
          company: 'Retail Solutions',
          content: 'LuminaTech LED provided exceptional service from consultation to installation. Our products look amazing under the new lighting.',
          imageUrl: '/images/testimonials/sarah-johnson.jpg',
          featured: true,
          createdAt: new Date('2023-05-15')
        },
        {
          id: '3',
          name: 'Michael Brown',
          position: 'Facilities Director',
          company: 'Corporate Offices Inc.',
          content: 'The energy savings from our LED retrofit has exceeded our expectations. The project paid for itself in just 14 months.',
          imageUrl: '/images/testimonials/michael-brown.jpg',
          featured: false,
          createdAt: new Date('2023-05-20')
        },
        {
          id: '4',
          name: 'Emily Davis',
          position: 'Restaurant Owner',
          company: 'Fine Dining Experience',
          content: 'The ambient lighting created the perfect atmosphere for our restaurant. Our customers love it!',
          imageUrl: '/images/testimonials/emily-davis.jpg',
          featured: false,
          createdAt: new Date('2023-05-25')
        }
      ];
      
      setTestimonials(mockTestimonials);
      
      // Save to localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, mockTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleDelete = async (testimonial: Testimonial) => {
    setIsDeleting(true);
    
    try {
      // In a real application, you would call your API to delete the testimonial
      console.log('Deleting testimonial:', testimonial.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      const updatedTestimonials = testimonials.filter(t => t.id !== testimonial.id);
      setTestimonials(updatedTestimonials);
      
      // Update localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleToggleFeatured = async (testimonial: Testimonial) => {
    try {
      // In a real application, you would call your API to update the testimonial
      console.log('Toggling featured status for testimonial:', testimonial.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      const updatedTestimonials = testimonials.map(t => 
        t.id === testimonial.id ? { ...t, featured: !t.featured } : t
      );
      
      setTestimonials(updatedTestimonials);
      
      // Update localStorage
      setLocalData(STORAGE_KEYS.TESTIMONIALS, updatedTestimonials);
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('Failed to update testimonial. Please try again.');
    }
  };
  
  // Filter testimonials based on search term
  const filteredTestimonials = testimonials.filter(testimonial => {
    const searchLower = searchTerm.toLowerCase();
    return (
      testimonial.name.toLowerCase().includes(searchLower) ||
      testimonial.company.toLowerCase().includes(searchLower) ||
      testimonial.content.toLowerCase().includes(searchLower)
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
      header: 'Name',
      accessor: 'name' as keyof Testimonial,
      sortable: true
    },
    {
      header: 'Company',
      accessor: 'company' as keyof Testimonial,
      sortable: true
    },
    {
      header: 'Position',
      accessor: 'position' as keyof Testimonial,
      sortable: true
    },
    {
      header: 'Featured',
      accessor: (testimonial: Testimonial) => (
        <span className={testimonial.featured ? 'text-green-600' : 'text-gray-400'}>
          {testimonial.featured ? 'Yes' : 'No'}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: (testimonial: Testimonial) => formatDate(testimonial.createdAt)
    }
  ];
  
  // Define actions for DataTable
  const actions = [
    {
      label: testimonial => testimonial.featured ? 'Unfeature' : 'Feature',
      onClick: handleToggleFeatured,
      className: (testimonial: Testimonial) => 
        testimonial.featured 
          ? 'text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded hover:bg-yellow-50' 
          : 'text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50'
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
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Testimonial
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <DataTable
            data={filteredTestimonials}
            columns={columns}
            keyField="id"
            searchTerm={searchTerm}
            onSearch={handleSearch}
            loading={loading}
            emptyMessage="No testimonials found"
            viewPath="/admin/testimonials"
            editPath="/admin/testimonials"
            onDelete={handleDelete}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
} 