import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="LED lighting installation"
            fill
            priority
            className="object-cover opacity-50"
          />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
            Illuminate Your Space with <span className="text-blue-500">Innovative LED Solutions</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Transform your commercial or residential property with custom LED lighting installations that enhance aesthetics, improve efficiency, and create the perfect ambiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/services" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              Our Services
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent hover:bg-white/10 text-white border border-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Why Choose <span className="text-blue-600">LuminaTech LED</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Energy Efficient</h3>
              <p className="text-gray-600">
                Our LED solutions reduce energy consumption by up to 80% compared to traditional lighting, saving you money while reducing your carbon footprint.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Custom Designs</h3>
              <p className="text-gray-600">
                We create tailored lighting solutions that match your brand, enhance your space, and create the perfect atmosphere for your specific needs.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Expert Installation</h3>
              <p className="text-gray-600">
                Our certified technicians ensure flawless installation with minimal disruption to your business or home, backed by our satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Our <span className="text-blue-600">Services</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/commercial-led.jpg"
                  alt="Commercial LED Installation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Commercial LED Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Enhance your business environment with energy-efficient LED lighting that improves productivity, reduces costs, and creates an inviting atmosphere for customers and employees.
                </p>
                <Link 
                  href="/services#commercial" 
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/residential-led.jpg"
                  alt="Residential LED Lighting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Residential LED Lighting</h3>
                <p className="text-gray-600 mb-4">
                  Transform your home with custom LED lighting solutions that enhance your living spaces, improve energy efficiency, and create the perfect ambiance for every room.
                </p>
                <Link 
                  href="/services#residential" 
                  className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
                >
                  Learn More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 inline-block"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">
            Featured <span className="text-blue-600">Projects</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-80">
                <Image
                  src="/images/project1.jpg"
                  alt="Office Building LED Installation"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2">Corporate Office Complex</h3>
                <p className="text-sm text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Complete LED retrofit for a 10-story office building, reducing energy costs by 65%.
                </p>
                <Link 
                  href="/portfolio/corporate-office" 
                  className="text-blue-300 hover:text-blue-100 font-medium inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"
                >
                  View Project
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Project 2 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-80">
                <Image
                  src="/images/project2.jpg"
                  alt="Retail Store LED Lighting"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2">Luxury Retail Store</h3>
                <p className="text-sm text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Custom accent lighting to highlight products and create an upscale shopping experience.
                </p>
                <Link 
                  href="/portfolio/luxury-retail" 
                  className="text-blue-300 hover:text-blue-100 font-medium inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"
                >
                  View Project
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative h-80">
                <Image
                  src="/images/project3.jpg"
                  alt="Residential Smart Lighting"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-2">Modern Smart Home</h3>
                <p className="text-sm text-gray-200 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  Integrated smart LED system with voice control and automated scenes for a luxury residence.
                </p>
                <Link 
                  href="/portfolio/smart-home" 
                  className="text-blue-300 hover:text-blue-100 font-medium inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"
                >
                  View Project
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/portfolio" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 inline-block"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our <span className="text-blue-400">Clients Say</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <svg className="w-12 h-12 text-blue-500 absolute -top-6 left-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 mb-6 mt-4">
                "LuminaTech transformed our retail space with their custom LED lighting solution. The attention to detail and quality of work exceeded our expectations. Our products now stand out beautifully, and we've seen an increase in customer engagement."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src="/images/testimonial1.jpg"
                    alt="Sarah Johnson"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-400">Retail Store Manager</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <svg className="w-12 h-12 text-blue-500 absolute -top-6 left-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 mb-6 mt-4">
                "We hired LuminaTech for our office renovation, and they delivered a lighting system that not only looks fantastic but has reduced our energy costs by over 60%. Their team was professional, efficient, and a pleasure to work with."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src="/images/testimonial2.jpg"
                    alt="Michael Chen"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Michael Chen</h4>
                  <p className="text-sm text-gray-400">Operations Director</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-lg relative">
              <svg className="w-12 h-12 text-blue-500 absolute -top-6 left-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 mb-6 mt-4">
                "The smart home lighting system LuminaTech installed has completely changed how we experience our home. The ability to control ambiance with voice commands and scheduled scenes is incredible. Their team was knowledgeable and responsive."
              </p>
              <div className="flex items-center">
                <div className="mr-4">
                  <Image
                    src="/images/testimonial3.jpg"
                    alt="Jennifer & David Miller"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-bold">Jennifer & David Miller</h4>
                  <p className="text-sm text-gray-400">Homeowners</p>
                </div>
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
            Contact us today for a free consultation and quote. Our experts will help you design the perfect lighting solution for your needs.
          </p>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors duration-300 inline-block"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
