import React, { useState, useEffect } from 'react'
import type { Project } from '../types'
import OptimizedImage from './OptimizedImage'
import InteractiveButton from './InteractiveButton'
import { trapFocus, scrollLock, announceToScreenReader } from '../utils/accessibility'

interface ProjectsProps {
  projects: Project[]
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Sort projects by featured status first, then by relevance (assuming featured projects are most relevant)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  const handleProjectClick = (project: Project) => {
    // Show detailed project information in modal
    setSelectedProject(project)
    scrollLock.lock()
    announceToScreenReader(`Opened project details for ${project.title}`)
  }

  const closeModal = () => {
    setSelectedProject(null)
    scrollLock.unlock()
    announceToScreenReader('Closed project details')
  }

  const handleGitHubClick = (e: React.MouseEvent, githubUrl: string) => {
    e.stopPropagation() // Prevent triggering the card click
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  }

  const handleLiveClick = (e: React.MouseEvent, liveUrl: string) => {
    e.stopPropagation() // Prevent triggering the card click
    window.open(liveUrl, '_blank', 'noopener,noreferrer')
  }

  const handleModalLiveClick = (liveUrl: string) => {
    window.open(liveUrl, '_blank', 'noopener,noreferrer')
  }

  const handleModalGitHubClick = (githubUrl: string) => {
    window.open(githubUrl, '_blank', 'noopener,noreferrer')
  }

  // Handle ESC key to close modal and manage focus
  useEffect(() => {
    let cleanupFocusTrap: (() => void) | undefined

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedProject) {
        closeModal()
      }
    }

    if (selectedProject) {
      document.addEventListener('keydown', handleEscKey)
      
      // Set up focus trap after modal renders
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement
        if (modal) {
          cleanupFocusTrap = trapFocus(modal)
        }
      }, 0)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      cleanupFocusTrap?.()
    }
  }, [selectedProject])

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Enhanced responsive typography */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
            Projects
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg px-4 sm:px-0">
            Here are some of the projects I've worked on, showcasing my skills in web development and software engineering.
          </p>

          {/* Projects Grid - Enhanced responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sortedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-105"
                onClick={() => handleProjectClick(project)}
              >
                {/* Project Preview Image - Responsive sizing */}
                <div className="relative overflow-hidden">
                  <OptimizedImage
                    src={project.previewImage}
                    alt={`${project.title} preview`}
                    className="w-full h-32 sm:h-40 lg:h-48 group-hover:scale-110 transition-transform duration-300"
                    fallbackSrc="/images/project-placeholder.svg"
                    loading="lazy"
                  />
                  {project.featured && (
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Project Content - Enhanced responsive spacing */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-3 text-sm sm:text-base">
                    {project.description}
                  </p>

                  {/* Technologies Used - Responsive layout */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {project.technologies.slice(0, 4).map((tech, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs sm:text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs sm:text-sm">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Project Duration - Responsive text */}
                  <div className="mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-500">
                      Duration: {project.duration}
                    </span>
                  </div>

                  {/* Action Buttons - Enhanced responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <InteractiveButton
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedProject(project)
                      }}
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                    >
                      View Details
                    </InteractiveButton>
                    {project.liveUrl && (
                      <InteractiveButton
                        onClick={(e) => handleLiveClick(e, project.liveUrl!)}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        Live Demo
                      </InteractiveButton>
                    )}
                    {project.githubUrl && (
                      <InteractiveButton
                        onClick={(e) => handleGitHubClick(e, project.githubUrl!)}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        GitHub
                      </InteractiveButton>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal - Enhanced responsive design */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div 
            className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Responsive spacing */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h3 id="modal-title" className="text-xl sm:text-2xl font-bold text-gray-900 pr-4">
                {selectedProject.title}
              </h3>
              <InteractiveButton
                onClick={closeModal}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold flex-shrink-0"
                ariaLabel="Close project details"
              >
                ×
              </InteractiveButton>
            </div>

            {/* Modal Content - Enhanced responsive layout */}
            <div className="p-4 sm:p-6" id="modal-description">
              {/* Project Image - Responsive sizing */}
              <div className="mb-4 sm:mb-6">
                <OptimizedImage
                  src={selectedProject.previewImage}
                  alt={`${selectedProject.title} preview`}
                  className="w-full h-48 sm:h-64 lg:h-80 rounded-lg"
                  fallbackSrc="/images/project-placeholder.svg"
                  loading="eager"
                />
              </div>

              {/* Project Details - Enhanced responsive grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Project Description
                  </h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    {selectedProject.detailedDescription || selectedProject.description}
                  </p>

                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Duration
                  </h4>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                    {selectedProject.duration}
                  </p>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                    {selectedProject.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons - Responsive layout */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {selectedProject.liveUrl && (
                      <InteractiveButton
                        onClick={() => handleModalLiveClick(selectedProject.liveUrl!)}
                        variant="primary"
                        size="lg"
                        className="flex-1"
                      >
                        View Live Project
                      </InteractiveButton>
                    )}
                    {selectedProject.githubUrl && (
                      <InteractiveButton
                        onClick={() => handleModalGitHubClick(selectedProject.githubUrl!)}
                        variant="secondary"
                        size="lg"
                        className="flex-1"
                      >
                        View on GitHub
                      </InteractiveButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Projects