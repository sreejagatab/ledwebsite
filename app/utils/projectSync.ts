import { getLocalData, setLocalData, STORAGE_KEYS } from './localStorage';

// Admin project interface
interface AdminProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: boolean;
  mainImage: string;
  galleryImages: any[]; // Could be strings or objects with more metadata
  completionDate: Date;
  createdAt: Date;
  location?: string;
  challenge?: string;
  solution?: string;
  results?: string;
}

// Portfolio project interface
interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  challenge: string;
  solution: string;
  results: string;
  imageSrc: string;
  galleryImages: string[];
}

/**
 * Syncs admin projects with portfolio projects
 * This ensures that when projects are updated in the admin panel,
 * they are also updated in the portfolio
 */
export function syncAdminProjectsWithPortfolio(): void {
  try {
    // Get admin projects
    const adminProjects = getLocalData<AdminProject[]>(STORAGE_KEYS.PROJECTS, []);
    
    if (!adminProjects || adminProjects.length === 0) {
      return; // No projects to sync
    }
    
    // Convert admin projects to portfolio format
    const portfolioProjects: PortfolioProject[] = adminProjects.map(project => ({
      id: project.slug || project.id,
      title: project.title,
      category: project.category,
      location: project.location || 'Location not specified',
      description: project.description,
      challenge: project.challenge || 'Challenge details not available',
      solution: project.solution || 'Solution details not available',
      results: project.results || 'Results details not available',
      imageSrc: project.mainImage,
      galleryImages: Array.isArray(project.galleryImages) 
        ? project.galleryImages.map(img => typeof img === 'string' ? img : img.url)
        : []
    }));
    
    // Save portfolio projects to localStorage
    setLocalData('portfolio_projects', portfolioProjects);
    
    console.log('Projects synced successfully:', portfolioProjects.length);
  } catch (error) {
    console.error('Error syncing projects:', error);
  }
}

/**
 * Gets portfolio projects from localStorage or returns default projects if none exist
 */
export function getPortfolioProjects(): PortfolioProject[] {
  // Try to get synced portfolio projects
  const portfolioProjects = getLocalData<PortfolioProject[]>('portfolio_projects', []);
  
  if (portfolioProjects && portfolioProjects.length > 0) {
    return portfolioProjects;
  }
  
  // If no synced projects, try to sync them now
  syncAdminProjectsWithPortfolio();
  
  // Try again after syncing
  const syncedProjects = getLocalData<PortfolioProject[]>('portfolio_projects', []);
  
  if (syncedProjects && syncedProjects.length > 0) {
    return syncedProjects;
  }
  
  // If still no projects, return default projects
  return [
    {
      id: "corporate-office",
      title: "Corporate Office Complex",
      category: "Commercial",
      location: "New York, NY",
      description: "Complete LED retrofit for a 10-story office building, reducing energy costs by 65% while improving lighting quality and employee satisfaction.",
      challenge: "The client needed to modernize their outdated lighting system to reduce operational costs and improve the work environment for employees.",
      solution: "We designed and installed a comprehensive LED lighting solution with smart controls, occupancy sensors, and daylight harvesting to maximize energy savings.",
      results: "The new lighting system reduced energy consumption by 65%, improved employee satisfaction, and created a more modern and professional atmosphere.",
      imageSrc: "/images/project1.jpg",
      galleryImages: [
        "/images/projects/office-1.jpg",
        "/images/projects/office-2.jpg",
        "/images/projects/office-3.jpg",
      ]
    },
    {
      id: "luxury-retail",
      title: "Luxury Retail Store",
      category: "Commercial",
      location: "Los Angeles, CA",
      description: "Custom accent lighting to highlight products and create an upscale shopping experience for a high-end fashion retailer.",
      challenge: "The retailer needed lighting that would showcase their luxury products while creating an inviting atmosphere for customers.",
      solution: "We implemented precision accent lighting, color-tuned LEDs, and custom fixtures that complemented the store's design aesthetic.",
      results: "The lighting design increased product visibility, enhanced the shopping experience, and contributed to a 30% increase in sales.",
      imageSrc: "/images/project2.jpg",
      galleryImages: [
        "/images/project2-gallery1.jpg",
        "/images/project2-gallery2.jpg",
        "/images/project2-gallery3.jpg",
      ]
    }
  ];
} 