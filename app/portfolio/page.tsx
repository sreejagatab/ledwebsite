import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | LuminaTech LED",
  description: "Explore our portfolio of LED lighting projects including commercial, residential, and architectural installations.",
};

// Portfolio project data
const projects = [
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
      "/images/project1-gallery1.jpg",
      "/images/project1-gallery2.jpg",
      "/images/project1-gallery3.jpg",
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
  },
  {
    id: "smart-home",
    title: "Modern Smart Home",
    category: "Residential",
    location: "Seattle, WA",
    description: "Integrated smart LED system with voice control and automated scenes for a luxury residence.",
    challenge: "The homeowners wanted a lighting system that would enhance their modern home while offering convenience and energy efficiency.",
    solution: "We installed a fully integrated smart lighting system with voice control, mobile app access, and automated scenes for different activities and times of day.",
    results: "The homeowners now enjoy complete control over their lighting environment, with customized scenes for entertaining, relaxing, and everyday living.",
    imageSrc: "/images/project3.jpg",
    galleryImages: [
      "/images/project3-gallery1.jpg",
      "/images/project3-gallery2.jpg",
      "/images/project3-gallery3.jpg",
    ]
  },
  {
    id: "hotel-renovation",
    title: "Boutique Hotel Renovation",
    category: "Hospitality",
    location: "Miami, FL",
    description: "Complete lighting redesign for a boutique hotel, enhancing ambiance while reducing energy consumption by 70%.",
    challenge: "The hotel needed to update its outdated lighting to create a more luxurious atmosphere while reducing operational costs.",
    solution: "We designed a comprehensive lighting plan that included lobby, corridor, guest room, and exterior lighting with smart controls and energy-efficient LEDs.",
    results: "The new lighting created a distinctive atmosphere that aligned with the hotel's brand, while significantly reducing energy and maintenance costs.",
    imageSrc: "/images/project4.jpg",
    galleryImages: [
      "/images/project4-gallery1.jpg",
      "/images/project4-gallery2.jpg",
      "/images/project4-gallery3.jpg",
    ]
  },
  {
    id: "historic-building",
    title: "Historic Building Facade",
    category: "Architectural",
    location: "Chicago, IL",
    description: "Architectural lighting for a historic building facade, highlighting its unique features while respecting its historical significance.",
    challenge: "The client wanted to showcase their historic building at night without compromising its architectural integrity.",
    solution: "We designed a subtle yet effective lighting system that highlighted key architectural features using carefully positioned fixtures and precise beam control.",
    results: "The lighting transformed the building's nighttime appearance, making it a landmark in the city skyline while preserving its historical character.",
    imageSrc: "/images/project5.jpg",
    galleryImages: [
      "/images/project5-gallery1.jpg",
      "/images/project5-gallery2.jpg",
      "/images/project5-gallery3.jpg",
    ]
  },
  {
    id: "restaurant-chain",
    title: "Restaurant Chain Standardization",
    category: "Commercial",
    location: "Multiple Locations",
    description: "Standardized LED lighting system for a national restaurant chain, ensuring consistent ambiance across all locations.",
    challenge: "The restaurant chain needed consistent lighting across all locations that would enhance the dining experience while being energy efficient.",
    solution: "We developed a standardized lighting package that could be implemented across all locations, with adjustments for different space configurations.",
    results: "The chain now has consistent lighting that reinforces their brand identity, improves the dining experience, and reduces operational costs.",
    imageSrc: "/images/project6.jpg",
    galleryImages: [
      "/images/project6-gallery1.jpg",
      "/images/project6-gallery2.jpg",
      "/images/project6-gallery3.jpg",
    ]
  },
];

export default function PortfolioPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/images/portfolio-hero.jpg"
            alt="LED lighting portfolio"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-blue-400">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Explore our showcase of LED lighting projects that demonstrate our expertise, creativity, and commitment to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="px-4 py-2 text-white bg-blue-600 rounded-md font-medium transition-colors">
              All Projects
            </a>
            <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Commercial
            </a>
            <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Residential
            </a>
            <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Architectural
            </a>
            <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Hospitality
            </a>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-lg group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{project.category}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{project.location}</span>
                    <Link 
                      href={`/portfolio/${project.id}`} 
                      className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                    >
                      View Details
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Featured <span className="text-blue-600">Project</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/featured-project.jpg"
                alt="City Skyline LED Project"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-800">City Skyline Transformation</h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Architectural</span>
              </div>
              <p className="text-gray-600 mb-6">
                A landmark project that transformed the city skyline with synchronized LED lighting across multiple buildings, creating a dynamic and iconic nighttime vista that has become a tourist attraction.
              </p>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-bold text-gray-800">The Challenge:</h4>
                  <p className="text-gray-600">
                    Coordinate multiple building owners and create a unified lighting system that could be synchronized for special events and holidays.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Our Solution:</h4>
                  <p className="text-gray-600">
                    We developed a centralized control system that allows individual building control while enabling city-wide coordination for special displays and events.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">The Results:</h4>
                  <p className="text-gray-600">
                    The skyline lighting has become a signature feature of the city, attracting tourism and providing a platform for celebrating important events and causes.
                  </p>
                </div>
              </div>
              
              <Link 
                href="/portfolio/city-skyline" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 inline-block"
              >
                View Full Case Study
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <svg className="w-12 h-12 text-blue-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              "Working with LuminaTech LED was a game-changer for our corporate headquarters. Their team understood our vision and delivered a lighting solution that not only reduced our energy costs significantly but also transformed our workspace into a more productive and visually appealing environment. The attention to detail and professionalism throughout the project was exceptional."
            </p>
            <div className="flex items-center justify-center">
              <div className="mr-4">
                <Image
                  src="/images/testimonial-ceo.jpg"
                  alt="James Wilson"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold">James Wilson</h4>
                <p className="text-sm text-gray-400">CEO, Global Innovations Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Own Success Story?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to discuss your LED lighting project and join our portfolio of satisfied clients.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors duration-300 inline-block"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </div>
  );
} 