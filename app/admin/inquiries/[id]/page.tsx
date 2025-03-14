"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function InquiryDetail({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    try {
      // In a real app, you would fetch this data from your API
      // For now, we'll use placeholder data
      const mockInquiry: Inquiry = {
        id: params.id,
        name: "David Wilson",
        email: "david.wilson@example.com",
        phone: "+1 (555) 123-4567",
        company: "Wilson Enterprises",
        projectType: "Commercial",
        message: "We're renovating our office space and interested in energy-efficient LED lighting solutions. Please contact me to discuss options.",
        status: "new",
        notes: null,
        createdAt: "2023-12-10",
        respondedAt: null
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInquiry(mockInquiry);
      setSelectedStatus(mockInquiry.status);
      setNotes(mockInquiry.notes || "");
    } catch (error) {
      console.error("Error fetching inquiry:", error);
      setError("Failed to load inquiry details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInquiry = async () => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // In a real app, you would call your API to delete the inquiry
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to inquiries list after successful deletion
      router.push("/admin/inquiries");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("Failed to delete inquiry. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!inquiry) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // In a real app, you would call your API to update the inquiry
      // For now, we'll just update the local state
      const updatedInquiry = {
        ...inquiry,
        status: selectedStatus,
        notes: notes,
        respondedAt: selectedStatus === "responded" ? new Date().toISOString() : inquiry.respondedAt
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInquiry(updatedInquiry);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating inquiry:", error);
      alert("Failed to update inquiry. Please try again.");
    } finally {
      setIsSaving(false);
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
            onClick={handleDeleteInquiry}
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

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          Inquiry updated successfully!
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
                    onClick={handleUpdateStatus}
                    disabled={isSaving}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors duration-300 disabled:opacity-70"
                  >
                    {isSaving ? "Saving..." : "Update Inquiry"}
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
                    onClick={handleDeleteInquiry}
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