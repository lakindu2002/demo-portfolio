import React, { useState, useRef, useEffect } from 'react'
import { announceToScreenReader } from '../utils/accessibility'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  placeholder?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE2MCIgcj0iNjAiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAzMDBDMTAwIDI1NS44MTcgMTM1LjgxNyAyMjAgMTgwIDIyMEgyMjBDMjY0LjE4MyAyMjAgMzAwIDI1NS44MTcgMzAwIDMwMFY0MDBIMTAwVjMwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+',
  placeholder,
  loading = 'lazy',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(loading === 'eager')
  const [retryCount, setRetryCount] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const [currentSrc, setCurrentSrc] = useState(src)
  const maxRetries = 2

  // Intersection Observer for lazy loading with error handling
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        },
        {
          rootMargin: '50px' // Start loading 50px before the image comes into view
        }
      )

      observer.observe(imgRef.current)

      return () => {
        try {
          observer.disconnect()
        } catch (error) {
          console.error('Error disconnecting intersection observer:', error)
        }
      }
    } catch (error) {
      console.error('Error setting up intersection observer:', error)
      // Fallback: show image immediately if observer fails
      setIsInView(true)
      return () => {}
    }
  }, [loading])

  const handleLoad = () => {
    try {
      setIsLoaded(true)
      setHasError(false)
      onLoad?.()
    } catch (error) {
      console.error('Error in image load handler:', error)
    }
  }

  const handleError = () => {
    try {
      console.warn(`Image failed to load: ${currentSrc}`)
      
      // Try fallback image if we haven't used it yet and it's different from current src
      if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc)
        setHasError(true)
        announceToScreenReader('Image failed to load, showing fallback')
      } else if (retryCount < maxRetries && currentSrc === src) {
        // Retry loading the original image
        setRetryCount(prev => prev + 1)
        setTimeout(() => {
          setCurrentSrc(`${src}?retry=${retryCount + 1}`)
        }, 1000 * (retryCount + 1)) // Exponential backoff
      } else {
        // All retries failed, show error state
        setHasError(true)
        announceToScreenReader('Image could not be loaded')
      }
      
      onError?.()
    } catch (error) {
      console.error('Error in image error handler:', error)
      setHasError(true)
    }
  }

  const shouldShowPlaceholder = !isLoaded && placeholder
  const shouldShowImage = isInView || loading === 'eager'

  return (
    <div className={`relative overflow-hidden ${className}`} ref={imgRef}>
      {/* Placeholder while loading */}
      {shouldShowPlaceholder && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!placeholder && (
            <div className="w-8 h-8 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      {shouldShowImage && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          decoding="async"
        />
      )}

      {/* Error state */}
      {hasError && retryCount >= maxRetries && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              <path d="M12 2L2 12h3v8h14v-8h3L12 2z" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {shouldShowImage && !isLoaded && !shouldShowPlaceholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 text-gray-400">
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage