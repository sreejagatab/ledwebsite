"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl: string;
  faviconUrl: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  replyToEmail: string;
}

interface SocialMediaSettings {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  pinterest: string;
}

interface SettingsFormProps {
  initialGeneralSettings?: GeneralSettings;
  initialEmailSettings?: EmailSettings;
  initialSocialMediaSettings?: SocialMediaSettings;
  onSubmit: (
    generalSettings: GeneralSettings,
    emailSettings: EmailSettings,
    socialMediaSettings: SocialMediaSettings,
    activeTab: string
  ) => Promise<void>;
  isSubmitting?: boolean;
  submitError?: string;
  submitSuccess?: boolean;
}

export default function SettingsForm({
  initialGeneralSettings,
  initialEmailSettings,
  initialSocialMediaSettings,
  onSubmit,
  isSubmitting = false,
  submitError,
  submitSuccess = false
}: SettingsFormProps) {
  const router = useRouter();
  
  // Default values for settings
  const defaultGeneralSettings: GeneralSettings = {
    siteName: 'LuminaTech LED',
    siteDescription: 'Professional LED Installation Services',
    contactEmail: 'contact@luminatechled.com',
    contactPhone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico'
  };
  
  const defaultEmailSettings: EmailSettings = {
    smtpHost: 'smtp.example.com',
    smtpPort: '587',
    smtpUser: 'user@example.com',
    smtpPassword: '',
    fromEmail: 'noreply@luminatechled.com',
    fromName: 'LuminaTech LED',
    replyToEmail: 'contact@luminatechled.com'
  };
  
  const defaultSocialMediaSettings: SocialMediaSettings = {
    facebook: 'https://facebook.com/luminatechled',
    twitter: 'https://twitter.com/luminatechled',
    instagram: 'https://instagram.com/luminatechled',
    linkedin: 'https://linkedin.com/company/luminatechled',
    youtube: 'https://youtube.com/channel/luminatechled',
    pinterest: 'https://pinterest.com/luminatechled'
  };
  
  // State for settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    ...defaultGeneralSettings,
    ...initialGeneralSettings
  });
  
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    ...defaultEmailSettings,
    ...initialEmailSettings
  });
  
  const [socialMediaSettings, setSocialMediaSettings] = useState<SocialMediaSettings>({
    ...defaultSocialMediaSettings,
    ...initialSocialMediaSettings
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle general settings change
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle email settings change
  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle social media settings change
  const handleSocialMediaSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialMediaSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate general settings
    if (activeTab === 'general') {
      if (!generalSettings.siteName.trim()) {
        newErrors.siteName = 'Site name is required';
      }
      
      if (!generalSettings.contactEmail.trim()) {
        newErrors.contactEmail = 'Contact email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(generalSettings.contactEmail)) {
        newErrors.contactEmail = 'Invalid email format';
      }
      
      if (!generalSettings.contactPhone.trim()) {
        newErrors.contactPhone = 'Contact phone is required';
      }
    }
    
    // Validate email settings
    if (activeTab === 'email') {
      if (!emailSettings.smtpHost.trim()) {
        newErrors.smtpHost = 'SMTP host is required';
      }
      
      if (!emailSettings.smtpPort.trim()) {
        newErrors.smtpPort = 'SMTP port is required';
      } else if (!/^\d+$/.test(emailSettings.smtpPort)) {
        newErrors.smtpPort = 'SMTP port must be a number';
      }
      
      if (!emailSettings.fromEmail.trim()) {
        newErrors.fromEmail = 'From email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(emailSettings.fromEmail)) {
        newErrors.fromEmail = 'Invalid email format';
      }
      
      if (!emailSettings.fromName.trim()) {
        newErrors.fromName = 'From name is required';
      }
    }
    
    // Validate social media settings
    if (activeTab === 'social') {
      // Optional validation for URLs
      const urlFields = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest'];
      urlFields.forEach(field => {
        const value = (socialMediaSettings as any)[field];
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          newErrors[field] = 'URL must start with http:// or https://';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(generalSettings, emailSettings, socialMediaSettings, activeTab);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social Media
          </button>
        </nav>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Settings saved successfully!</span>
          </div>
        )}
        
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}
        
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={generalSettings.siteName}
                  onChange={handleGeneralSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.siteName ? 'border-red-300' : ''
                  }`}
                />
                {errors.siteName && (
                  <p className="mt-1 text-sm text-red-600">{errors.siteName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Description
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  name="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={generalSettings.contactEmail}
                  onChange={handleGeneralSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.contactEmail ? 'border-red-300' : ''
                  }`}
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={generalSettings.contactPhone}
                  onChange={handleGeneralSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.contactPhone ? 'border-red-300' : ''
                  }`}
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={generalSettings.address}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                  Logo URL
                </label>
                <input
                  type="text"
                  id="logoUrl"
                  name="logoUrl"
                  value={generalSettings.logoUrl}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="faviconUrl" className="block text-sm font-medium text-gray-700">
                  Favicon URL
                </label>
                <input
                  type="text"
                  id="faviconUrl"
                  name="faviconUrl"
                  value={generalSettings.faviconUrl}
                  onChange={handleGeneralSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Email Settings */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700">
                  SMTP Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="smtpHost"
                  name="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={handleEmailSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.smtpHost ? 'border-red-300' : ''
                  }`}
                />
                {errors.smtpHost && (
                  <p className="mt-1 text-sm text-red-600">{errors.smtpHost}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="smtpPort"
                  name="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={handleEmailSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.smtpPort ? 'border-red-300' : ''
                  }`}
                />
                {errors.smtpPort && (
                  <p className="mt-1 text-sm text-red-600">{errors.smtpPort}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input
                  type="text"
                  id="smtpUser"
                  name="smtpUser"
                  value={emailSettings.smtpUser}
                  onChange={handleEmailSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input
                  type="password"
                  id="smtpPassword"
                  name="smtpPassword"
                  value={emailSettings.smtpPassword}
                  onChange={handleEmailSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to keep the current password
                </p>
              </div>
              
              <div>
                <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                  From Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="fromEmail"
                  name="fromEmail"
                  value={emailSettings.fromEmail}
                  onChange={handleEmailSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.fromEmail ? 'border-red-300' : ''
                  }`}
                />
                {errors.fromEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromEmail}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                  From Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fromName"
                  name="fromName"
                  value={emailSettings.fromName}
                  onChange={handleEmailSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.fromName ? 'border-red-300' : ''
                  }`}
                />
                {errors.fromName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fromName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="replyToEmail" className="block text-sm font-medium text-gray-700">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  id="replyToEmail"
                  name="replyToEmail"
                  value={emailSettings.replyToEmail}
                  onChange={handleEmailSettingsChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Social Media Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook URL
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  value={socialMediaSettings.facebook}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.facebook ? 'border-red-300' : ''
                  }`}
                  placeholder="https://facebook.com/yourpage"
                />
                {errors.facebook && (
                  <p className="mt-1 text-sm text-red-600">{errors.facebook}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter URL
                </label>
                <input
                  type="text"
                  id="twitter"
                  name="twitter"
                  value={socialMediaSettings.twitter}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.twitter ? 'border-red-300' : ''
                  }`}
                  placeholder="https://twitter.com/yourhandle"
                />
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-600">{errors.twitter}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram URL
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={socialMediaSettings.instagram}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.instagram ? 'border-red-300' : ''
                  }`}
                  placeholder="https://instagram.com/yourhandle"
                />
                {errors.instagram && (
                  <p className="mt-1 text-sm text-red-600">{errors.instagram}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  type="text"
                  id="linkedin"
                  name="linkedin"
                  value={socialMediaSettings.linkedin}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.linkedin ? 'border-red-300' : ''
                  }`}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
                {errors.linkedin && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                  YouTube URL
                </label>
                <input
                  type="text"
                  id="youtube"
                  name="youtube"
                  value={socialMediaSettings.youtube}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.youtube ? 'border-red-300' : ''
                  }`}
                  placeholder="https://youtube.com/channel/yourchannel"
                />
                {errors.youtube && (
                  <p className="mt-1 text-sm text-red-600">{errors.youtube}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="pinterest" className="block text-sm font-medium text-gray-700">
                  Pinterest URL
                </label>
                <input
                  type="text"
                  id="pinterest"
                  name="pinterest"
                  value={socialMediaSettings.pinterest}
                  onChange={handleSocialMediaSettingsChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.pinterest ? 'border-red-300' : ''
                  }`}
                  placeholder="https://pinterest.com/yourhandle"
                />
                {errors.pinterest && (
                  <p className="mt-1 text-sm text-red-600">{errors.pinterest}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
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
              'Save Settings'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 