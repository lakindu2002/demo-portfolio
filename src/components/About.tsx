import type { AboutComponentProps } from '../types'
import OptimizedImage from './OptimizedImage'
import InteractiveButton from './InteractiveButton'

const About: React.FC<AboutComponentProps> = ({ personalInfo }) => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Title - Enhanced responsive typography */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16">
            About Me
          </h2>
          
          {/* Main content grid - Optimized responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Professional Photo - Responsive ordering and sizing */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
                <OptimizedImage
                  src={personalInfo.photo}
                  alt={`Professional photo of ${personalInfo.name}`}
                  className="w-full h-auto rounded-2xl shadow-2xl aspect-square"
                  fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iNjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAzMDBDMTAwIDI1NS44MTcgMTM1LjgxNyAyMjAgMTgwIDIyMEgyMjBDMjY0LjE4MyAyMjAgMzAwIDI1NS44MTcgMzAwIDMwMFY0MDBIMTAwVjMwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+"
                  loading="lazy"
                />
                
                {/* Decorative elements - Responsive sizing */}
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-blue-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-indigo-100 rounded-full -z-10"></div>
              </div>
            </div>
            
            {/* About Content - Enhanced responsive layout */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6 lg:space-y-8">
                {/* Main About Text - Responsive typography */}
                <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg lg:text-xl">
                    {personalInfo.about}
                  </p>
                </div>
                
                {/* Professional Highlights - Enhanced responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Education</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Computer Science & Engineering
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Focus on Software Development
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Experience</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Full Stack Development
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Modern Web Technologies
                    </p>
                  </div>
                </div>
                
                {/* Contact CTA - Responsive button */}
                <div className="pt-4 sm:pt-6">
                  <InteractiveButton
                    onClick={() => {
                      const contactSection = document.getElementById('contact')
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    variant="secondary"
                    size="md"
                    ariaLabel="Contact John"
                    icon={
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    Let's Work Together
                  </InteractiveButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About