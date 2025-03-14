// Script to generate placeholder images for development
const fs = require('fs');
const path = require('path');

// Define the directories where placeholder images should be created
const directories = [
  'public/images',
  'public/images/projects',
  'public/images/team',
];

// Define the placeholder images to create
const placeholders = [
  // Home page
  { path: 'public/images/hero-bg.jpg', width: 1920, height: 1080 },
  { path: 'public/images/commercial-led.jpg', width: 600, height: 400 },
  { path: 'public/images/residential-led.jpg', width: 600, height: 400 },
  { path: 'public/images/testimonial1.jpg', width: 100, height: 100 },
  { path: 'public/images/testimonial2.jpg', width: 100, height: 100 },
  { path: 'public/images/testimonial3.jpg', width: 100, height: 100 },
  { path: 'public/images/testimonial-ceo.jpg', width: 100, height: 100 },
  
  // About page
  { path: 'public/images/about-hero.jpg', width: 1920, height: 600 },
  { path: 'public/images/our-story.jpg', width: 800, height: 600 },
  { path: 'public/images/team-1.jpg', width: 400, height: 400 },
  { path: 'public/images/team-2.jpg', width: 400, height: 400 },
  { path: 'public/images/team-3.jpg', width: 400, height: 400 },
  { path: 'public/images/team-4.jpg', width: 400, height: 400 },
  
  // Services page
  { path: 'public/images/services-hero.jpg', width: 1920, height: 600 },
  { path: 'public/images/commercial-led-service.jpg', width: 600, height: 400 },
  { path: 'public/images/residential-led-service.jpg', width: 600, height: 400 },
  { path: 'public/images/architectural-led-service.jpg', width: 600, height: 400 },
  { path: 'public/images/smart-led-service.jpg', width: 600, height: 400 },
  { path: 'public/images/maintenance-led-service.jpg', width: 600, height: 400 },
  
  // Portfolio page
  { path: 'public/images/project1.jpg', width: 800, height: 600 },
  { path: 'public/images/project2.jpg', width: 800, height: 600 },
  { path: 'public/images/project3.jpg', width: 800, height: 600 },
  { path: 'public/images/project4.jpg', width: 800, height: 600 },
  { path: 'public/images/project5.jpg', width: 800, height: 600 },
  { path: 'public/images/project6.jpg', width: 800, height: 600 },
  { path: 'public/images/featured-project.jpg', width: 800, height: 600 },
  
  // Project gallery images
  { path: 'public/images/projects/office-1.jpg', width: 800, height: 600 },
  { path: 'public/images/projects/office-2.jpg', width: 800, height: 600 },
  { path: 'public/images/projects/office-3.jpg', width: 800, height: 600 },
  { path: 'public/images/project1-gallery1.jpg', width: 800, height: 600 },
  { path: 'public/images/project1-gallery2.jpg', width: 800, height: 600 },
  { path: 'public/images/project1-gallery3.jpg', width: 800, height: 600 },
  { path: 'public/images/project2-gallery1.jpg', width: 800, height: 600 },
  { path: 'public/images/project2-gallery2.jpg', width: 800, height: 600 },
  { path: 'public/images/project2-gallery3.jpg', width: 800, height: 600 },
  { path: 'public/images/project3-gallery1.jpg', width: 800, height: 600 },
  { path: 'public/images/project3-gallery2.jpg', width: 800, height: 600 },
  { path: 'public/images/project3-gallery3.jpg', width: 800, height: 600 },
];

// Create directories if they don't exist
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create placeholder images
placeholders.forEach(placeholder => {
  const { path: filePath, width, height } = placeholder;
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log(`File already exists: ${filePath}`);
    return;
  }
  
  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
  
  // Create a simple text file as a placeholder
  // In a real application, you would generate actual images
  const content = `This is a placeholder for an image (${width}x${height}).
In a real application, this would be an actual image file.
Filename: ${path.basename(filePath)}
Dimensions: ${width}x${height}
`;
  
  fs.writeFileSync(filePath, content);
  console.log(`Created placeholder: ${filePath}`);
});

console.log('Placeholder generation complete!'); 