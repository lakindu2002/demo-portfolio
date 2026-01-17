import type { HeroComponentProps } from '../types'
import InteractiveButton from './InteractiveButton'
import { prefersReducedMotion, announceToScreenReader } from '../utils/accessibility'

const Hero: React.FC<HeroComponentProps> = ({ personalInfo }) => {
  const handleScrollToSection = (sectionId: string, sectionName: string) => {
    try {
      const element = document.getElementById(sectionId)
      if (element) {
        const shouldUseSmooth = !prefersReducedMotion()
        element.scrollIntoView({ 
          behavior: shouldUseSmooth ? 'smooth' : 'auto', 
          block: 'start' 
        })
        announceToScreenReader(`Navigating to ${sectionName} section`)
      }
    } catch (error) {
      console.error(`Error navigating to ${sectionId}:`, error)
    }
  }

  return (
    <section 
      id="hero" 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"
      aria-labelledby="hero-heading"
      role="banner"
    >
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Name - Responsive typography */}
          <h1 
            id="hero-heading"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            {personalInfo.name}
          </h1>
          
          {/* Professional Title - Responsive sizing */}
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-blue-600 mb-6 sm:mb-8">
            {personalInfo.title}
          </h2>
          
          {/* Brief Introduction - Responsive text and spacing */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            {personalInfo.introduction}
          </p>
          
          {/* Call to Action Buttons - Enhanced responsive layout */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto" role="group" aria-label="Navigation actions">
            <InteractiveButton
              onClick={() => handleScrollToSection('about', 'About')}
              variant="primary"
              size="lg"
              className="w-full xs:w-auto"
              ariaLabel="Learn more about John - navigate to about section"
            >
              Learn More
            </InteractiveButton>
            
            <InteractiveButton
              onClick={() => handleScrollToSection('contact', 'Contact')}
              variant="outline"
              size="lg"
              className="w-full xs:w-auto"
              ariaLabel="Get in touch with John - navigate to contact section"
            >
              Get In Touch
            </InteractiveButton>
          </div>
        </div>
      </div>
    </section>
  )
}


export default Hero