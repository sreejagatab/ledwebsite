"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPortfolioProjects } from "@/app/utils/projectSync";
import PlaceholderImage from "@/app/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Portfolio | LuminaTech LED",
  description: "Explore our portfolio of LED lighting projects including commercial, residential, and architectural installations.",
};

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  
  useEffect(() => {
    // Fetch projects
    const portfolioProjects = getPortfolioProjects();
    setProjects(portfolioProjects);
    setLoading(false);
  }, []);
  
  // Filter projects based on category
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);
  
  // Get unique categories
  const categories = ["All", ...new Set(projects.map(project => project.category))];
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-900">
        <div className="absolute inset-0 z-0 opacity-30">
          {/* Use PlaceholderImage as fallback */}
          <div className="relative w-full h-full">
            <PlaceholderImage text="Portfolio" className="w-full h-full" />
          </div>
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
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeFilter === category 
                    ? "text-white bg-blue-600 rounded-md" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Projects Found</h3>
              <p className="text-gray-500">No projects match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-lg group">
                  <div className="relative h-64 overflow-hidden">
                    {project.imageSrc ? (
                      <Image
                        src={project.imageSrc}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <PlaceholderImage text={project.title} className="w-full h-full" />
                    )}
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
          )}
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
            Ready to Transform Your Space with LED Lighting?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to discuss your project and discover how our LED lighting solutions can enhance your space while reducing energy costs.
          </p>
          <Link href="/contact" className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-md hover:bg-gray-100 transition-colors">
            Get a Free Consultation
          </Link>
        </div>
      </section>
    </div>
  );
} 