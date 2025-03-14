import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luminatechled.com' },
    update: {},
    create: {
      email: 'admin@luminatechled.com',
      name: 'Admin User',
      hashedPassword: adminPassword,
      role: 'admin',
    },
  });
  
  console.log({ admin });
  
  // Add a sample project
  const project = await prisma.project.upsert({
    where: { slug: 'commercial-office-lighting' },
    update: {},
    create: {
      title: 'Commercial Office Lighting',
      slug: 'commercial-office-lighting',
      category: 'Commercial',
      location: 'Downtown Business District',
      description: 'Modern LED lighting solution for a corporate office building.',
      challenge: 'The client needed an energy-efficient lighting system that would reduce operational costs while providing optimal lighting for productivity.',
      solution: 'We implemented a smart LED lighting system with motion sensors and daylight harvesting capabilities.',
      results: 'Reduced energy consumption by 40% and improved employee satisfaction with the workspace.',
      imageSrc: '/images/project1.jpg',
      featured: true,
      galleryImages: {
        create: [
          {
            url: '/images/project1-gallery1.jpg',
            alt: 'Office reception area with LED lighting',
            order: 0,
          },
          {
            url: '/images/project1-gallery2.jpg',
            alt: 'Conference room with adjustable LED lighting',
            order: 1,
          },
        ],
      },
    },
  });
  
  console.log({ project });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 