"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SettingsForm from "@/app/components/SettingsForm";
import { getLocalData, setLocalData, STORAGE_KEYS } from "@/app/utils/localStorage";

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Initial settings data
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "LuminaTech LED",
    siteDescription: "Professional LED Installation Services",
    contactEmail: "contact@luminatechled.com",
    contactPhone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico"
  });
  
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUser: "user@example.com",
    smtpPassword: "",
    fromEmail: "noreply@luminatechled.com",
    fromName: "LuminaTech LED",
    replyToEmail: "contact@luminatechled.com"
  });
  
  const [socialMediaSettings, setSocialMediaSettings] = useState({
    facebook: "https://facebook.com/luminatechled",
    twitter: "https://twitter.com/luminatechled",
    instagram: "https://instagram.com/luminatechled",
    linkedin: "https://linkedin.com/company/luminatechled",
    youtube: "https://youtube.com/channel/luminatechled",
    pinterest: "https://pinterest.com/luminatechled"
  });
  
  useEffect(() => {
    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
    
    // Fetch settings data
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status, router]);
  
  const fetchSettings = async () => {
    setIsLoading(true);
    
    try {
      // Get settings from localStorage
      const savedGeneralSettings = getLocalData(STORAGE_KEYS.SETTINGS.GENERAL, null);
      const savedEmailSettings = getLocalData(STORAGE_KEYS.SETTINGS.EMAIL, null);
      const savedSocialMediaSettings = getLocalData(STORAGE_KEYS.SETTINGS.SOCIAL, null);
      
      // If we have saved settings, use them
      if (savedGeneralSettings) {
        setGeneralSettings(savedGeneralSettings);
      }
      
      if (savedEmailSettings) {
        setEmailSettings(savedEmailSettings);
      }
      
      if (savedSocialMediaSettings) {
        setSocialMediaSettings(savedSocialMediaSettings);
      }
      
      // If no saved settings, we'll use the default values already set in state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (
    generalSettings: any,
    emailSettings: any,
    socialMediaSettings: any,
    activeTab: string
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // In a real application, you would send this data to your API
      console.log("Saving settings:", { generalSettings, emailSettings, socialMediaSettings, activeTab });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setGeneralSettings(generalSettings);
      setEmailSettings(emailSettings);
      setSocialMediaSettings(socialMediaSettings);
      
      // Save to localStorage
      setLocalData(STORAGE_KEYS.SETTINGS.GENERAL, generalSettings);
      setLocalData(STORAGE_KEYS.SETTINGS.EMAIL, emailSettings);
      setLocalData(STORAGE_KEYS.SETTINGS.SOCIAL, socialMediaSettings);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSubmitError("Failed to save settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <SettingsForm
            initialGeneralSettings={generalSettings}
            initialEmailSettings={emailSettings}
            initialSocialMediaSettings={socialMediaSettings}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitError={submitError || undefined}
            submitSuccess={submitSuccess}
          />
        </div>
      </div>
    </div>
  );
} 