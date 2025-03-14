"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardStats from '@/app/components/DashboardStats';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
    
    // Fetch dashboard data
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // In a real application, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock recent projects
      setRecentProjects([
        {
          id: '1',
          title: 'Commercial Office LED Retrofit',
          date: new Date('2023-05-15'),
          status: 'completed'
        },
        {
          id: '2',
          title: 'Retail Store Lighting Installation',
          date: new Date('2023-06-02'),
          status: 'completed'
        },
        {
          id: '3',
          title: 'Restaurant Ambient Lighting',
          date: new Date('2023-06-20'),
          status: 'in_progress'
        }
      ]);
      
      // Mock recent inquiries
      setRecentInquiries([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          date: new Date('2023-06-25'),
          status: 'new'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          date: new Date('2023-06-24'),
          status: 'in_progress'
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael@example.com',
          date: new Date('2023-06-23'),
          status: 'new'
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily@example.com',
          date: new Date('2023-06-22'),
          status: 'completed'
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
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
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
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
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {/* Stats */}
          <div className="mb-8">
            <DashboardStats loading={loading} />
          </div>
          
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/projects/new"
                className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
              >
                <h5 className="mb-2 text-xl font-medium text-gray-900">Add New Project</h5>
                <p className="text-gray-700">Create a new project in your portfolio</p>
              </Link>
              
              <Link
                href="/admin/testimonials/new"
                className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
              >
                <h5 className="mb-2 text-xl font-medium text-gray-900">Add Testimonial</h5>
                <p className="text-gray-700">Add a new client testimonial</p>
              </Link>
              
              <Link
                href="/admin/inquiries?status=new"
                className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
              >
                <h5 className="mb-2 text-xl font-medium text-gray-900">View New Inquiries</h5>
                <p className="text-gray-700">Check and respond to new inquiries</p>
              </Link>
              
              <Link
                href="/admin/settings"
                className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50"
              >
                <h5 className="mb-2 text-xl font-medium text-gray-900">Settings</h5>
                <p className="text-gray-700">Manage website settings</p>
              </Link>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Projects */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
              </div>
              
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : recentProjects.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No recent projects found</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentProjects.map(project => (
                      <li key={project.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="truncate">
                            <Link
                              href={`/admin/projects/${project.id}`}
                              className="text-sm font-medium text-blue-600 truncate hover:text-blue-800"
                            >
                              {project.title}
                            </Link>
                            <p className="text-sm text-gray-500">{formatDate(project.date)}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(project.status)}`}>
                              {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/projects" className="font-medium text-blue-600 hover:text-blue-500">
                      View all projects <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Inquiries */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Inquiries</h3>
              </div>
              
              <div className="overflow-hidden">
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : recentInquiries.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No recent inquiries found</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentInquiries.map(inquiry => (
                      <li key={inquiry.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="truncate">
                            <Link
                              href={`/admin/inquiries/${inquiry.id}`}
                              className="text-sm font-medium text-blue-600 truncate hover:text-blue-800"
                            >
                              {inquiry.name}
                            </Link>
                            <p className="text-sm text-gray-500">{inquiry.email}</p>
                            <p className="text-xs text-gray-400">{formatDate(inquiry.date)}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                              {inquiry.status.replace('_', ' ').charAt(0).toUpperCase() + inquiry.status.replace('_', ' ').slice(1)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/inquiries" className="font-medium text-blue-600 hover:text-blue-500">
                      View all inquiries <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 