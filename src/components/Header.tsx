import { useState } from 'react'
import type { HeaderComponentProps } from '../types'
import { getPersonalInfo } from '../utils/dataLoader';
import { announceToScreenReader } from '../utils/accessibility';

interface HeaderProps extends HeaderComponentProps {
  onNavigate: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ sections, activeSection, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [personalName, setPersonalName] = useState<string>('Portfolio')

  // Safely get personal info with fallback
  useState(() => {
    try {
      const info = getPersonalInfo()
      setPersonalName(info.name || 'Portfolio')
    } catch (error) {
      console.error('Error loading personal info for header:', error)
      setPersonalName('Portfolio') // Fallback name
    }
  })

  const toggleMobileMenu = () => {
    try {
      const newState = !isMobileMenuOpen
      setIsMobileMenuOpen(newState)
      announceToScreenReader(newState ? 'Mobile menu opened' : 'Mobile menu closed')
    } catch (error) {
      console.error('Error toggling mobile menu:', error)
    }
  }

  const handleNavigation = (sectionId: string) => {
    try {
      onNavigate(sectionId)
      setIsMobileMenuOpen(false) // Close mobile menu after navigation
    } catch (error) {
      console.error('Error during navigation:', error)
      // Still try to close the mobile menu
      setIsMobileMenuOpen(false)
    }
  }

  const getSectionDisplayName = (section: string) => {
    return section === 'hero' ? 'Home' : section.charAt(0).toUpperCase() + section.slice(1)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200" role="banner">
      <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="text-xl font-bold text-gray-900" role="img" aria-label={`${personalName} Portfolio Logo`}>
            {personalName}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8" role="menubar">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigation(section)}
                className={`cursor-pointer capitalize transition-colors duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 ${
                  activeSection === section
                    ? 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={`Navigate to ${getSectionDisplayName(section)} section`}
                aria-current={activeSection === section ? 'page' : undefined}
                role="menuitem"
                tabIndex={0}
              >
                {getSectionDisplayName(section)}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center" aria-hidden="true">
              <span
                className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-64 opacity-100 mt-4'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          role="menu"
          aria-labelledby="mobile-menu-button"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="py-2 space-y-2 border-t border-gray-200 mt-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleNavigation(section)}
                className={`block w-full text-left px-4 py-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeSection === section
                    ? 'text-blue-600 font-medium bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-label={`Navigate to ${getSectionDisplayName(section)} section`}
                aria-current={activeSection === section ? 'page' : undefined}
                role="menuitem"
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                {getSectionDisplayName(section)}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header