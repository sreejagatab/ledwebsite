"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  linkHref?: string;
  linkText?: string;
}

interface DashboardStatsProps {
  projectCount?: number;
  testimonialCount?: number;
  newInquiryCount?: number;
  totalInquiryCount?: number;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  change,
  changeType = 'neutral',
  linkHref,
  linkText
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 mr-3">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {(description || change !== undefined) && (
          <div className="mt-4">
            {change !== undefined && (
              <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                changeType === 'increase' ? 'bg-green-100 text-green-800' :
                changeType === 'decrease' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {changeType === 'increase' && (
                  <svg className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {changeType === 'decrease' && (
                  <svg className="-ml-1 mr-0.5 flex-shrink-0 self-center h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="sr-only">
                  {changeType === 'increase' ? 'Increased by' : changeType === 'decrease' ? 'Decreased by' : 'Changed by'}
                </span>
                {change}%
              </div>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
        )}
      </div>
      {linkHref && linkText && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link href={linkHref} className="font-medium text-blue-600 hover:text-blue-500">
              {linkText} <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DashboardStats({
  projectCount = 0,
  testimonialCount = 0,
  newInquiryCount = 0,
  totalInquiryCount = 0,
  loading = false
}: DashboardStatsProps) {
  const [stats, setStats] = useState({
    projectCount,
    testimonialCount,
    newInquiryCount,
    totalInquiryCount
  });
  
  const [isLoading, setIsLoading] = useState(loading);
  
  // Simulate fetching stats if not provided
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      
      // Simulate API call
      const timer = setTimeout(() => {
        setStats({
          projectCount: projectCount || 12,
          testimonialCount: testimonialCount || 24,
          newInquiryCount: newInquiryCount || 5,
          totalInquiryCount: totalInquiryCount || 42
        });
        setIsLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      setStats({
        projectCount,
        testimonialCount,
        newInquiryCount,
        totalInquiryCount
      });
    }
  }, [loading, projectCount, testimonialCount, newInquiryCount, totalInquiryCount]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Projects"
        value={stats.projectCount}
        description="Total number of projects in the portfolio"
        icon={
          <div className="rounded-md bg-blue-50 p-3">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        }
        change={8}
        changeType="increase"
        linkHref="/admin/projects"
        linkText="View all projects"
      />
      
      <StatCard
        title="Testimonials"
        value={stats.testimonialCount}
        description="Total client testimonials"
        icon={
          <div className="rounded-md bg-green-50 p-3">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        }
        change={12}
        changeType="increase"
        linkHref="/admin/testimonials"
        linkText="View all testimonials"
      />
      
      <StatCard
        title="New Inquiries"
        value={stats.newInquiryCount}
        description="Inquiries awaiting response"
        icon={
          <div className="rounded-md bg-yellow-50 p-3">
            <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        }
        change={2}
        changeType="increase"
        linkHref="/admin/inquiries?status=new"
        linkText="View new inquiries"
      />
      
      <StatCard
        title="Total Inquiries"
        value={stats.totalInquiryCount}
        description="All-time inquiries received"
        icon={
          <div className="rounded-md bg-purple-50 p-3">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        }
        change={15}
        changeType="increase"
        linkHref="/admin/inquiries"
        linkText="View all inquiries"
      />
    </div>
  );
} 