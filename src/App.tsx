import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ErrorBoundary from './components/ErrorBoundary'
import type { PersonalInfo, Skill, Project } from './types'
import personalInfoData from './data/personal-info.json'
import skillsData from './data/skills.json'
import projectsData from './data/projects.json'
import { prefersReducedMotion, announceToScreenReader } from './utils/accessibility'
import { initializeProgressiveEnhancement } from './utils/progressiveEnhancement'

function App() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [hasError, setHasError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const sections = useMemo(() => ['hero', 'about', 'skills', 'projects', 'contact'], [])
  
  // Safe data loading with error handling
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Load data with error handling
  useEffect(() => {
    try {
      setPersonalInfo(personalInfoData as PersonalInfo)
      setSkills(skillsData as Skill[])
      setProjects(projectsData as Project[])
    } catch (error) {
      console.error('Error loading portfolio data:', error)
      setHasError(true)
      setErrorMessage('Failed to load portfolio data. Please refresh the page.')
      announceToScreenReader('Error loading portfolio data')
    }
  }, [])

  // Initialize progressive enhancement
  useEffect(() => {
    try {
      initializeProgressiveEnhancement()
    } catch (error) {
      console.error('Error initializing progressive enhancement:', error)
      // Continue without progressive enhancement features
    }
  }, [])

  // Enhanced smooth scrolling navigation handler with fallbacks
  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId)
      if (element) {
        // Check if smooth scrolling is supported and user doesn't prefer reduced motion
        const supportsSmooth = 'scrollBehavior' in document.documentElement.style
        const shouldUseSmooth = supportsSmooth && !prefersReducedMotion()
        
        if (shouldUseSmooth) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        } else {
          // Fallback for browsers that don't support smooth scrolling or users who prefer reduced motion
          element.scrollIntoView({ block: 'start' })
        }
        
        // Announce navigation to screen readers
        announceToScreenReader(`Navigated to ${sectionId} section`)
      } else {
        console.warn(`Section element with id "${sectionId}" not found`)
        // Fallback: try to scroll to top if section not found
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
      }
    } catch (error) {
      console.error('Error during navigation:', error)
      // Fallback: use basic scroll to top
      try {
        window.scrollTo(0, 0)
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError)
      }
    }
  }

  // Track active section based on scroll position with error handling
  useEffect(() => {
    const handleScroll = () => {
      try {
        const scrollPosition = window.scrollY + 100 // Offset for header

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const { offsetTop, offsetHeight } = element
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section)
              break
            }
          }
        }
      } catch (error) {
        console.error('Error tracking scroll position:', error)
        // Continue without updating active section
      }
    }

    try {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    } catch (error) {
      console.error('Error setting up scroll listener:', error)
      return () => {} // Return empty cleanup function
    }
  }, [sections])

  // Error boundary fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Loading state while data is being loaded
  if (!personalInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Component with error boundary */}
      <ErrorBoundary>
        <Header 
          sections={sections}
          activeSection={activeSection}
          onNavigate={scrollToSection}
        />
      </ErrorBoundary>

      {/* Main content container with optimized responsive layout */}
      <main id="main-content" className="pt-16">
        {/* Hero Section - Full viewport on mobile, optimized spacing on desktop */}
        <ErrorBoundary>
          <div className="w-full">
            <Hero personalInfo={personalInfo} />
          </div>
        </ErrorBoundary>

        {/* Content sections with consistent responsive container */}
        <div className="w-full">
          {/* About Section */}
          <ErrorBoundary>
            <About personalInfo={personalInfo} />
          </ErrorBoundary>

          {/* Skills Section */}
          <ErrorBoundary>
            <Skills skills={skills} />
          </ErrorBoundary>

          {/* Projects Section */}
          <ErrorBoundary>
            <Projects projects={projects} />
          </ErrorBoundary>

          {/* Contact Section */}
          <ErrorBoundary>
            <Contact personalInfo={personalInfo} />
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer Component */}
      <ErrorBoundary>
        <Footer 
          socialLinks={personalInfo.socialLinks}
          email={personalInfo.email}
        />
      </ErrorBoundary>

      {/* NoScript fallback */}
      <noscript>
        <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
          <p className="text-yellow-800">
            This website works best with JavaScript enabled. Some interactive features may not work properly without it.
          </p>
        </div>
      </noscript>
    </div>
  )
}

export default App
