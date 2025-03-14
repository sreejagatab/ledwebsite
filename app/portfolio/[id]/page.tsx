"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPortfolioProjects } from '@/app/utils/projectSync';
import PlaceholderImage from '@/app/components/PlaceholderImage';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetchProject = () => {
      try {
        setLoading(true);
        
        // Get projects from our utility function
        const projects = getPortfolioProjects();
        const foundProject = projects.find(p => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
          setActiveImage(foundProject.imageSrc || "");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // If project not found after loading, show 404
  if (!loading && !project) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : project && (
        <>
          {/* Hero Section */}
          <section className="relative py-20 bg-gray-900">
            <div className="absolute inset-0 z-0 opacity-40">
              {project.imageSrc ? (
                <Image
                  src={project.imageSrc}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <PlaceholderImage text={project.title} className="w-full h-full" />
              )}
            </div>
            <div className="container mx-auto px-4 z-10 relative">
              <div className="max-w-3xl">
                <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-md mb-4">
                  {project.category}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {project.title}
                </h1>
                <p className="text-xl text-gray-200 mb-2">
                  {project.description}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Location:</span> {project.location}
                </p>
              </div>
            </div>
          </section>

          {/* Project Details */}
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
                <p className="text-lg text-gray-700 mb-8">{project.description}</p>
                
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">Challenge</h3>
                    <p className="text-gray-700">{project.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">Solution</h3>
                    <p className="text-gray-700">{project.solution}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-600">Results</h3>
                    <p className="text-gray-700">{project.results}</p>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <h2 className="text-3xl font-bold mb-8">Project Gallery</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.galleryImages && project.galleryImages.length > 0 ? (
                    project.galleryImages.map((image: string, index: number) => (
                      <div key={index} className="rounded-lg overflow-hidden shadow-md h-64 relative">
                        <Image 
                          src={image} 
                          alt={`${project.title} - Gallery image ${index + 1}`} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No gallery images available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Back to Portfolio */}
              <div className="mt-16 text-center">
                <Link href="/portfolio" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Back to Portfolio
                </Link>
              </div>
            </div>
          </div>

          {/* Project Gallery */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Project Gallery</h2>
              
              <div className="mb-8">
                <div className="relative h-96 rounded-lg overflow-hidden">
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt="Gallery image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderImage text="Gallery Image" className="w-full h-full" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {project.imageSrc && (
                  <div 
                    className={`relative h-24 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === project.imageSrc ? 'border-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveImage(project.imageSrc)}
                  >
                    <Image
                      src={project.imageSrc}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                {project.galleryImages && project.galleryImages.map((img: string, index: number) => (
                  <div 
                    key={index}
                    className={`relative h-24 rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === img ? 'border-blue-600' : 'border-transparent'}`}
                    onClick={() => setActiveImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                
                {(!project.galleryImages || project.galleryImages.length === 0) && !project.imageSrc && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No gallery images available for this project.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Related Projects */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Related Projects</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {getPortfolioProjects()
                  .filter(p => p.id !== project.id && p.category === project.category)
                  .slice(0, 3)
                  .map(relatedProject => (
                    <div key={relatedProject.id} className="bg-white rounded-lg overflow-hidden shadow-lg group">
                      <div className="relative h-48 overflow-hidden">
                        {relatedProject.imageSrc ? (
                          <Image
                            src={relatedProject.imageSrc}
                            alt={relatedProject.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <PlaceholderImage text={relatedProject.title} className="w-full h-full" />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{relatedProject.title}</h3>
                        <p className="text-gray-600 mb-4">{relatedProject.description}</p>
                        <Link 
                          href={`/portfolio/${relatedProject.id}`} 
                          className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                        >
                          View Details
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                
                {getPortfolioProjects().filter(p => p.id !== project.id && p.category === project.category).length === 0 && (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No related projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 