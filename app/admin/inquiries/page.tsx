"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DataTable from '@/app/components/DataTable';

// Types
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  createdAt: Date;
  respondedAt?: Date;
}

export default function AdminInquiries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams?.get('status') || 'all');
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    // Fetch inquiries
    if (status === 'authenticated') {
      fetchInquiries();
    }
  }, [status, router, statusFilter]);
  
  const fetchInquiries = async () => {
    setLoading(true);
    
    try {
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock inquiries data
      const mockInquiries: Inquiry[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(555) 123-4567',
          company: 'TechCorp',
          projectType: 'Office Lighting',
          message: 'We are looking to upgrade the lighting in our office space. Can you provide a quote?',
          status: 'new',
          createdAt: new Date('2023-06-25')
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          phone: '(555) 987-6543',
          company: 'Retail Solutions',
          projectType: 'Retail Store Lighting',
          message: 'I need LED lighting for our new retail location. Please contact me to discuss options.',
          status: 'in_progress',
          createdAt: new Date('2023-06-24')
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael@example.com',
          phone: '(555) 456-7890',
          company: 'Restaurant Group',
          projectType: 'Restaurant Lighting',
          message: 'We are renovating our restaurant and need ambient lighting solutions. What do you recommend?',
          status: 'new',
          createdAt: new Date('2023-06-23')
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          phone: '(555) 789-0123',
          company: 'Residential Client',
          projectType: 'Home Lighting',
          message: 'I would like to upgrade the lighting in my home to LED. Can you provide a consultation?',
          status: 'completed',
          createdAt: new Date('2023-06-22'),
          respondedAt: new Date('2023-06-23')
        }
      ];
      
      // Filter by status if needed
      const filteredInquiries = statusFilter === 'all' 
        ? mockInquiries 
        : mockInquiries.filter(inquiry => inquiry.status === statusFilter);
      
      setInquiries(filteredInquiries);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    
    // Update URL query parameter
    const url = new URL(window.location.href);
    if (newStatus === 'all') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', newStatus);
    }
    router.replace(url.pathname + url.search);
  };
  
  const handleUpdateStatus = async (inquiry: Inquiry, newStatus: 'new' | 'in_progress' | 'completed' | 'archived') => {
    try {
      // In a real application, you would call your API to update the inquiry
      console.log('Updating inquiry status:', inquiry.id, 'to', newStatus);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state
      setInquiries(prev => 
        prev.map(i => 
          i.id === inquiry.id 
            ? { 
                ...i, 
                status: newStatus,
                respondedAt: newStatus === 'completed' ? new Date() : i.respondedAt
              } 
            : i
        )
      );
    } catch (error) {
      console.error('Error updating inquiry:', error);
      alert('Failed to update inquiry. Please try again.');
    }
  };
  
  const handleDelete = async (inquiry: Inquiry) => {
    try {
      // In a real application, you would call your API to delete the inquiry
      console.log('Deleting inquiry:', inquiry.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setInquiries(prev => prev.filter(i => i.id !== inquiry.id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry. Please try again.');
    }
  };
  
  // Filter inquiries based on search term
  const filteredInquiries = inquiries.filter(inquiry => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(searchLower) ||
      inquiry.email.toLowerCase().includes(searchLower) ||
      (inquiry.company && inquiry.company.toLowerCase().includes(searchLower)) ||
      (inquiry.projectType && inquiry.projectType.toLowerCase().includes(searchLower)) ||
      inquiry.message.toLowerCase().includes(searchLower)
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
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Define columns for DataTable
  const columns = [
    {
      header: 'Name',
      accessor: 'name' as keyof Inquiry,
      sortable: true
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Inquiry,
      sortable: true
    },
    {
      header: 'Project Type',
      accessor: (inquiry: Inquiry) => inquiry.projectType || 'N/A'
    },
    {
      header: 'Status',
      accessor: (inquiry: Inquiry) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
          {inquiry.status.replace('_', ' ').charAt(0).toUpperCase() + inquiry.status.replace('_', ' ').slice(1)}
        </span>
      )
    },
    {
      header: 'Date',
      accessor: (inquiry: Inquiry) => formatDate(inquiry.createdAt)
    }
  ];
  
  // Define actions for DataTable
  const actions = [
    {
      label: 'Mark as In Progress',
      onClick: (inquiry: Inquiry) => handleUpdateStatus(inquiry, 'in_progress'),
      showCondition: (inquiry: Inquiry) => inquiry.status === 'new',
      className: 'text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50'
    },
    {
      label: 'Mark as Completed',
      onClick: (inquiry: Inquiry) => handleUpdateStatus(inquiry, 'completed'),
      showCondition: (inquiry: Inquiry) => inquiry.status === 'in_progress',
      className: 'text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50'
    },
    {
      label: 'Archive',
      onClick: (inquiry: Inquiry) => handleUpdateStatus(inquiry, 'archived'),
      showCondition: (inquiry: Inquiry) => inquiry.status === 'completed',
      className: 'text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50'
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
        <h1 className="text-2xl font-semibold text-gray-900">Inquiries</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Status filter */}
          <div className="mb-6">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={handleStatusChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <DataTable
            data={filteredInquiries}
            columns={columns}
            keyField="id"
            searchTerm={searchTerm}
            onSearch={handleSearch}
            loading={loading}
            emptyMessage="No inquiries found"
            viewPath="/admin/inquiries"
            onDelete={handleDelete}
            actions={actions}
          />
        </div>
      </div>
    </div>
  );
} 