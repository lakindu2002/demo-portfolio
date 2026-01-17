import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  message?: string
  inline?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  message = 'Loading...',
  inline = false
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'md':
        return 'w-8 h-8'
      case 'lg':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  const spinnerElement = (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${getSizeClasses()}`}
      role="status"
      aria-label={message}
    >
      <span className="sr-only">{message}</span>
    </div>
  )

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        {spinnerElement}
        {message && <span className="text-gray-600">{message}</span>}
      </span>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      {spinnerElement}
      {message && (
        <p className="mt-4 text-gray-600 text-center" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner