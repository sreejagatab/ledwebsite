"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
}

interface Action<T> {
  label: string;
  icon?: string;
  onClick: (item: T) => void;
  className?: string;
  showCondition?: (item: T) => boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  keyField: keyof T;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  pagination?: boolean;
  itemsPerPage?: number;
  loading?: boolean;
  emptyMessage?: string;
  viewPath?: string;
  editPath?: string;
  deletePath?: string;
  onDelete?: (item: T) => Promise<void>;
}

export default function DataTable<T>({
  data,
  columns,
  actions = [],
  keyField,
  searchTerm = '',
  onSearch,
  pagination = true,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = "No data found",
  viewPath,
  editPath,
  deletePath,
  onDelete
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (onSearch) {
      onSearch(value);
    }
  };
  
  // Handle sort
  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle delete
  const handleDelete = async (item: T) => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      const itemId = String(item[keyField]);
      setIsDeleting(itemId);
      
      try {
        await onDelete(item);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  // Sort and paginate data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Sort data if sortField is set
    if (sortField) {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue < bValue ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }
    
    // Paginate data if pagination is enabled
    if (pagination) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      result = result.slice(startIndex, startIndex + itemsPerPage);
    }
    
    return result;
  }, [data, sortField, sortDirection, currentPage, pagination, itemsPerPage]);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return pagination ? Math.ceil(data.length / itemsPerPage) : 1;
  }, [data.length, pagination, itemsPerPage]);
  
  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages - 1, start + maxVisiblePages - 3);
      
      // Adjust start if end is at max
      if (end === totalPages - 1) {
        start = Math.max(2, end - (maxVisiblePages - 3));
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    const value = item[column.accessor];
    
    // Handle different value types
    if (value === null || value === undefined) {
      return '-';
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return String(value);
  };
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {onSearch && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              value={localSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && typeof column.accessor !== 'function' && handleSort(column.accessor)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && typeof column.accessor !== 'function' && sortField === column.accessor && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(actions.length > 0 || viewPath || editPath || deletePath) && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 || viewPath || editPath || deletePath ? 1 : 0)} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              processedData.map((item) => (
                <tr key={String(item[keyField])} className="hover:bg-gray-50">
                  {columns.map((column, columnIndex) => (
                    <td key={columnIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {(actions.length > 0 || viewPath || editPath || deletePath) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {viewPath && (
                          <Link
                            href={`${viewPath}/${item[keyField]}`}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            View
                          </Link>
                        )}
                        {editPath && (
                          <Link
                            href={`${editPath}/${item[keyField]}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
                          >
                            Edit
                          </Link>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting === String(item[keyField])}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                          >
                            {isDeleting === String(item[keyField]) ? 'Deleting...' : 'Delete'}
                          </button>
                        )}
                        {actions.map((action, actionIndex) => (
                          action.showCondition ? (action.showCondition(item) && (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={action.className || "text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"}
                            >
                              {action.label}
                            </button>
                          )) : (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              className={action.className || "text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50"}
                            >
                              {action.label}
                            </button>
                          )
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {pageNumbers.map((page, index) => (
                  typeof page === 'number' ? (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ) : (
                    <span
                      key={index}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  )
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 