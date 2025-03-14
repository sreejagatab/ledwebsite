"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import DataTable from '@/app/components/DataTable';
import { getLocalData, setLocalData, STORAGE_KEYS } from '@/app/utils/localStorage';

// Types
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed' | 'archived';
  createdAt: Date;
  respondedAt?: Date;
}

export default function AdminInquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchInquiries();
    }
  }, [status, router]);
  
  const fetchInquiries = async () => {
    setIsLoading(true);
    
    try {
      // In a real application, you would call your API to fetch inquiries
      // For now, we'll get them from localStorage or use mock data if none exists
      
      // Get inquiries from localStorage
      let inquiries = getLocalData<any[]>(STORAGE_KEYS.INQUIRIES, null);
      
      // If no inquiries in localStorage, create mock data
      if (!inquiries) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create mock inquiries
        inquiries = [
          {
            id: 'inq-1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '555-123-4567',
            message: 'I need LED lighting for my new office building. Can you provide a quote?',
            status: 'new',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: 'inq-2',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '555-987-6543',
            message: 'Looking for outdoor LED solutions for a residential project.',
            status: 'in-progress',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
          },
          {
            id: 'inq-3',
            name: 'Michael Brown',
            email: 'mbrown@example.com',
            message: 'Need information about your smart lighting systems for a hotel renovation.',
            status: 'completed',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
          },
          {
            id: 'inq-4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            phone: '555-555-5555',
            message: 'Interested in energy-efficient lighting for a retail store. Please contact me with options.',
            status: 'new',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            id: 'inq-5',
            name: 'Robert Wilson',
            email: 'rwilson@example.com',
            message: 'Looking for custom LED solutions for an art installation.',
            status: 'in-progress',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          }
        ];
        
        // Save mock inquiries to localStorage
        setLocalData(STORAGE_KEYS.INQUIRIES, inquiries);
      }
      
      // Convert date strings back to Date objects
      const formattedInquiries = inquiries.map(inquiry => ({
        ...inquiry,
        createdAt: inquiry.createdAt ? new Date(inquiry.createdAt) : new Date()
      }));
      
      setInquiries(formattedInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleDelete = async (id: string) => {
    // Ask for confirmation
    const confirmed = window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.');
    
    if (!confirmed) {
      return;
    }
    
    try {
      // Get inquiries from localStorage
      const storedInquiries = getLocalData<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
      
      // Filter out the inquiry to delete
      const updatedInquiries = storedInquiries.filter(inquiry => inquiry.id !== id);
      
      // Save updated inquiries to localStorage
      setLocalData(STORAGE_KEYS.INQUIRIES, updatedInquiries);
      
      // Update local state
      setInquiries(updatedInquiries);
      
      alert('Inquiry deleted successfully');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry. Please try again.');
    }
  };
  
  const handleUpdateStatus = async (id: string, newStatus: 'new' | 'in-progress' | 'completed') => {
    try {
      // Get inquiries from localStorage
      const storedInquiries = getLocalData<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
      
      // Update the status of the inquiry
      const updatedInquiries = storedInquiries.map(inquiry => {
        if (inquiry.id === id) {
          return {
            ...inquiry,
            status: newStatus
          };
        }
        return inquiry;
      });
      
      // Save updated inquiries to localStorage
      setLocalData(STORAGE_KEYS.INQUIRIES, updatedInquiries);
      
      // Update local state
      setInquiries(updatedInquiries);
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update inquiry status. Please try again.');
    }
  };
  
  // Filter inquiries based on search term
  const filteredInquiries = inquiries.filter(inquiry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      (inquiry.phone && inquiry.phone.toLowerCase().includes(searchLower)) ||
      inquiry.message.toLowerCase().includes(searchLower) ||
      inquiry.status.toLowerCase().includes(searchLower)
    );
  });
  
  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Define columns for the data table
  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      sortable: true
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      sortable: true,
      cell: (row: Inquiry) => formatDate(row.createdAt)
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row: Inquiry) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
          {row.status === 'in-progress' ? 'In Progress' : row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      )
    }
  ];
  
  // Define actions for the data table
  const actions = [
    {
      label: 'View',
      onClick: (row: Inquiry) => router.push(`/admin/inquiries/${row.id}`),
      primary: true
    },
    {
      label: 'Mark as New',
      onClick: (row: Inquiry) => handleUpdateStatus(row.id, 'new'),
      show: (row: Inquiry) => row.status !== 'new'
    },
    {
      label: 'Mark In Progress',
      onClick: (row: Inquiry) => handleUpdateStatus(row.id, 'in-progress'),
      show: (row: Inquiry) => row.status !== 'in-progress'
    },
    {
      label: 'Mark Completed',
      onClick: (row: Inquiry) => handleUpdateStatus(row.id, 'completed'),
      show: (row: Inquiry) => row.status !== 'completed'
    },
    {
      label: 'Delete',
      onClick: (row: Inquiry) => handleDelete(row.id),
      danger: true
    }
  ];
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Customer Inquiries</h1>
            </div>
            
            <DataTable
              data={filteredInquiries}
              columns={columns}
              actions={actions}
              onSearch={handleSearch}
              searchPlaceholder="Search inquiries..."
              emptyMessage="No inquiries found"
            />
          </>
        )}
      </div>
    </div>
  );
} 