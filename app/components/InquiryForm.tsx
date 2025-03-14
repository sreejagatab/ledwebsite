"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  message: string;
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  createdAt?: Date;
  respondedAt?: Date;
}

interface InquiryFormProps {
  initialData: Inquiry;
  onSubmit: (data: Inquiry, response: string) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string;
  submitSuccess?: boolean;
  readOnly?: boolean;
}

export default function InquiryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitError,
  submitSuccess = false,
  readOnly = false
}: InquiryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Inquiry>(initialData);
  const [response, setResponse] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (readOnly) return;
    
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      status: value as Inquiry['status']
    }));
  };
  
  // Handle response change
  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    setResponse(e.target.value);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.status === 'completed' && !response.trim()) {
      newErrors.response = 'A response is required when marking an inquiry as completed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readOnly) return;
    
    if (validateForm()) {
      await onSubmit(formData, response);
    }
  };
  
  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Inquiry updated successfully!</span>
        </div>
      )}
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{submitError}</span>
        </div>
      )}
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Inquiry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-base">{formData.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base">{formData.email}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-base">{formData.phone || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Company</p>
            <p className="text-base">{formData.company || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Project Type</p>
            <p className="text-base">{formData.projectType || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Date Received</p>
            <p className="text-base">{formatDate(formData.createdAt)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">Message</p>
          <div className="mt-1 p-3 bg-white border border-gray-200 rounded-md">
            <p className="text-base whitespace-pre-wrap">{formData.message}</p>
          </div>
        </div>
      </div>
      
      {!readOnly && (
        <>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleStatusChange}
              disabled={readOnly}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="response" className="block text-sm font-medium text-gray-700">
              Response {formData.status === 'completed' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="response"
              name="response"
              rows={6}
              value={response}
              onChange={handleResponseChange}
              disabled={readOnly}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.response ? 'border-red-300' : ''
              }`}
              placeholder="Enter your response to this inquiry..."
            />
            {errors.response && (
              <p className="mt-1 text-sm text-red-600">{errors.response}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This response will be sent to the client via email when you mark the inquiry as completed.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Link
              href="/admin/inquiries"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || readOnly}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Update Inquiry'
              )}
            </button>
          </div>
        </>
      )}
      
      {readOnly && (
        <div className="flex justify-end">
          <Link
            href="/admin/inquiries"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Inquiries
          </Link>
        </div>
      )}
      
      {formData.respondedAt && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-800">Response History</h4>
          <p className="text-xs text-blue-600 mt-1">Responded on: {formatDate(formData.respondedAt)}</p>
          {/* In a real application, you would display previous responses here */}
        </div>
      )}
    </form>
  );
} 