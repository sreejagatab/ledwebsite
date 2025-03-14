# LED Website Admin Dashboard

A modern admin dashboard for managing an LED lighting company's website content, including projects, testimonials, inquiries, and settings.

## Features

- **Authentication**: Secure login system using NextAuth.js
- **Dashboard**: Overview of recent projects, inquiries, and quick stats
- **Projects Management**: Create, view, edit, and delete lighting projects
- **Testimonials Management**: Manage customer testimonials
- **Inquiries Management**: Track and respond to customer inquiries
- **Settings**: Configure website settings

## Technical Implementation

### Data Persistence with localStorage

This project uses browser localStorage for data persistence, making it easy to demonstrate functionality without requiring a backend server. Key features of the localStorage implementation:

- **Storage Keys**: Centralized storage keys in `app/utils/localStorage.ts`
- **Type Safety**: TypeScript generics for type-safe data retrieval
- **Date Handling**: Automatic conversion between Date objects and strings
- **Default Values**: Support for default values when data doesn't exist

### Components

- **DataTable**: Reusable table component with sorting, filtering, and actions
- **DashboardStats**: Statistics cards for the dashboard
- **ProjectForm**: Form for creating and editing projects
- **TestimonialForm**: Form for creating and editing testimonials
- **PlaceholderImage**: Component for displaying placeholders when images are missing

### Pages

- **Dashboard**: Overview of website activity
- **Projects**: List, create, view, edit, and delete projects
- **Testimonials**: List, create, view, edit, and delete testimonials
- **Inquiries**: List, view, and manage customer inquiries
- **Settings**: Configure website settings

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## localStorage Data Structure

The application uses the following localStorage keys:

- `led_website_projects`: Array of project objects
- `led_website_testimonials`: Array of testimonial objects
- `led_website_inquiries`: Array of inquiry objects
- `led_website_settings`: Object containing website settings

Example project structure:
```typescript
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  featured: boolean;
  mainImage: string;
  galleryImages: GalleryImage[];
  completionDate: Date;
  createdAt: Date;
}
```

Example testimonial structure:
```typescript
interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  imageUrl: string;
  featured: boolean;
  projectId?: string;
  createdAt: Date;
}
```

Example inquiry structure:
```typescript
interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: Date;
}
```

## Future Improvements

- Replace localStorage with a real backend API
- Add image upload functionality
- Implement user roles and permissions
- Add analytics and reporting features
- Create a public-facing website to display the managed content
