// Progressive enhancement utilities for JavaScript-disabled environments

/**
 * Checks if JavaScript is enabled (this will always return true when JS is running)
 * Used for conditional rendering and fallbacks
 */
export const isJavaScriptEnabled = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Adds a CSS class to indicate JavaScript is enabled
 * This allows CSS to provide different styles for JS-enabled vs JS-disabled states
 */
export const addJavaScriptEnabledClass = (): void => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('js-enabled')
    document.documentElement.classList.remove('no-js')
  }
}

/**
 * Creates a noscript fallback element
 */
export const createNoScriptFallback = (content: string, className?: string): HTMLElement => {
  const noscript = document.createElement('noscript')
  const div = document.createElement('div')
  
  if (className) {
    div.className = className
  }
  
  div.innerHTML = content
  noscript.appendChild(div)
  
  return noscript
}

/**
 * Provides fallback navigation for when smooth scrolling fails
 */
export const fallbackNavigation = (targetId: string): void => {
  try {
    // Try hash-based navigation first (works without JS)
    window.location.hash = targetId
  } catch (error) {
    console.error('Fallback navigation failed:', error)
    // Last resort: try to scroll to top
    try {
      window.scrollTo(0, 0)
    } catch (scrollError) {
      console.error('Even basic scrolling failed:', scrollError)
    }
  }
}

/**
 * Enhances forms with progressive enhancement
 * Provides basic functionality even when JS is disabled
 */
export const enhanceForm = (formElement: HTMLFormElement): void => {
  if (!formElement) return

  // Add novalidate to prevent browser validation when JS is enabled
  // (we'll handle validation with JS for better UX)
  formElement.setAttribute('novalidate', 'true')
  
  // Add a hidden field to indicate JS is enabled
  const jsEnabledField = document.createElement('input')
  jsEnabledField.type = 'hidden'
  jsEnabledField.name = 'js_enabled'
  jsEnabledField.value = 'true'
  formElement.appendChild(jsEnabledField)
}

/**
 * Creates accessible loading states that work without JS
 */
export const createAccessibleLoadingState = (container: HTMLElement, message: string = 'Loading...'): void => {
  const loadingDiv = document.createElement('div')
  loadingDiv.className = 'loading-state'
  loadingDiv.setAttribute('aria-live', 'polite')
  loadingDiv.setAttribute('aria-label', message)
  loadingDiv.textContent = message
  
  container.appendChild(loadingDiv)
}

/**
 * Removes loading states
 */
export const removeLoadingState = (container: HTMLElement): void => {
  const loadingStates = container.querySelectorAll('.loading-state')
  loadingStates.forEach(state => state.remove())
}

/**
 * Provides keyboard navigation fallbacks
 */
export const enhanceKeyboardNavigation = (): void => {
  // Add skip links for better accessibility
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50'
  
  document.body.insertBefore(skipLink, document.body.firstChild)
  
  // Enhance focus management
  document.addEventListener('keydown', (e) => {
    // Handle escape key globally
    if (e.key === 'Escape') {
      // Close any open modals or menus
      const openModals = document.querySelectorAll('[role="dialog"][aria-modal="true"]')
      openModals.forEach(modal => {
        const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLElement
        closeButton?.click()
      })
      
      // Close mobile menus
      const openMenus = document.querySelectorAll('[aria-expanded="true"]')
      openMenus.forEach(menu => {
        if (menu instanceof HTMLElement) {
          menu.click()
        }
      })
    }
  })
}

/**
 * Initializes progressive enhancement features
 * Should be called early in the application lifecycle
 */
export const initializeProgressiveEnhancement = (): void => {
  // Add JS-enabled class
  addJavaScriptEnabledClass()
  
  // Enhance keyboard navigation
  enhanceKeyboardNavigation()
  
  // Add CSS for print styles
  const printStyles = document.createElement('style')
  printStyles.textContent = `
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      nav, header, footer { display: none !important; }
      main { margin: 0 !important; padding: 0 !important; }
    }
  `
  document.head.appendChild(printStyles)
  
  // Add basic error handling for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Prevent the default browser behavior
    event.preventDefault()
  })
  
  // Add basic error handling for JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error)
    // Continue execution - don't let one error break the entire app
  })
}

/**
 * Checks if the user is using a screen reader
 */
export const isUsingScreenReader = (): boolean => {
  // This is a heuristic - not 100% accurate but helps with progressive enhancement
  return window.navigator.userAgent.includes('NVDA') || 
         window.navigator.userAgent.includes('JAWS') || 
         window.speechSynthesis?.speaking === true ||
         window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Provides fallback content for complex interactive elements
 */
export const addFallbackContent = (element: HTMLElement, fallbackHTML: string): void => {
  const noscript = document.createElement('noscript')
  noscript.innerHTML = fallbackHTML
  element.appendChild(noscript)
}