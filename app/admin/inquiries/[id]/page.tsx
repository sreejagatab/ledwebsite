"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  respondedAt: string | null;
}

export default function InquiryDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchInquiry();
    }
  }, [status, router, params.id]);

  const fetchInquiry = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real application, you would call your API to fetch the inquiry
      // For now, we'll get it from localStorage
      
      // Get inquiries from localStorage
      const inquiries = getLocalData<any[]>(STORAGE_KEYS.INQUIRIES, []);
      
      // Find the inquiry by ID
      const foundInquiry = inquiries.find(i => i.id === inquiryId);
      
      if (!foundInquiry) {
        setError('Inquiry not found');
        setIsLoading(false);
        return;
      }
      
      // Convert date strings back to Date objects
      const formattedInquiry = {
        ...foundInquiry,
        createdAt: foundInquiry.createdAt ? new Date(foundInquiry.createdAt) : new Date()
      };
      
      setInquiry(formattedInquiry);
      setSelectedStatus(formattedInquiry.status);
      setNotes(formattedInquiry.notes || "");
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      setError('Failed to load inquiry details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    // Ask for confirmation
    const confirmed = window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.');
    
    if (!confirmed) {
      return;
    }
    
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);
    
    try {
      // In a real application, you would call your API to delete the inquiry
      // For now, we'll remove it from localStorage
      
      // Get inquiries from localStorage
      const inquiries = getLocalData<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
      
      // Filter out the inquiry to delete
      const updatedInquiries = inquiries.filter(i => i.id !== inquiryId);
      
      // Save updated inquiries to localStorage
      setLocalData(STORAGE_KEYS.INQUIRIES, updatedInquiries);
      
      // Show success message
      setDeleteSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/inquiries');
      }, 1500);
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      setDeleteError('Failed to delete inquiry. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!inquiry) return;
    
    try {
      // Get inquiries from localStorage
      const inquiries = getLocalData<Inquiry[]>(STORAGE_KEYS.INQUIRIES, []);
      
      // Find the inquiry and update its status
      const updatedInquiries = inquiries.map(i => {
        if (i.id === inquiryId) {
          return {
            ...i,
            status: newStatus
          };
        }
        return i;
      });
      
      // Save updated inquiries to localStorage
      setLocalData(STORAGE_KEYS.INQUIRIES, updatedInquiries);
      
      // Update the local state
      setInquiry({
        ...inquiry,
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update inquiry status. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiry details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Inquiry not found.
        </div>
        <button
          onClick={() => router.push("/admin/inquiries")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Back to Inquiries
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inquiry Details</h1>
          <p className="text-gray-600">ID: {inquiry.id}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      {deleteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Inquiry deleted successfully!
        </div>
      )}

      {deleteError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {deleteError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <span className="ml-2 text-sm text-gray-900">{inquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <a href={`mailto:${inquiry.email}`} className="ml-2 text-sm text-blue-600 hover:text-blue-800">
                      {inquiry.email}
                    </a>
                  </div>
                  {inquiry.phone && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Phone:</span>
                      <a href={`tel:${inquiry.phone}`} className="ml-2 text-sm text-blue-600 hover:text-blue-800">
                        {inquiry.phone}
                      </a>
                    </div>
                  )}
                  {inquiry.company && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Company:</span>
                      <span className="ml-2 text-sm text-gray-900">{inquiry.company}</span>
                    </div>
                  )}
                  {inquiry.projectType && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Project Type:</span>
                      <span className="ml-2 text-sm text-gray-900">{inquiry.projectType}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Inquiry Status</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Current Status:</span>
                    <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(inquiry.status)}`}>
                      {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date Received:</span>
                    <span className="ml-2 text-sm text-gray-900">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                  </div>
                  {inquiry.respondedAt && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date Responded:</span>
                      <span className="ml-2 text-sm text-gray-900">{new Date(inquiry.respondedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Message</h3>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
              
              <h3 className="text-lg font-medium text-gray-800 mb-3">Update Status</h3>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Add internal notes about this inquiry..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(selectedStatus)}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
                  >
                    {isDeleting ? "Deleting..." : "Update Inquiry"}
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`mailto:${inquiry.email}?subject=RE: Your Inquiry - LuminaTech LED`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reply via Email
                  </a>
                  {inquiry.phone && (
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-300"
                    >
                      Call Client
                    </a>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
                  >
                    {isDeleting ? "Deleting..." : "Delete Inquiry"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 