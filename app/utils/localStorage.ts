// Utility functions for localStorage data persistence

// Generic function to get data from localStorage
export function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting data from localStorage for key "${key}":`, error);
    return defaultValue;
  }
}

// Generic function to set data in localStorage
export function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting data in localStorage for key "${key}":`, error);
  }
}

// Constants for localStorage keys
export const STORAGE_KEYS = {
  PROJECTS: 'led_website_projects',
  TESTIMONIALS: 'led_website_testimonials',
  INQUIRIES: 'led_website_inquiries',
  SETTINGS: {
    GENERAL: 'led_website_settings_general',
    EMAIL: 'led_website_settings_email',
    SOCIAL: 'led_website_settings_social'
  }
}; 