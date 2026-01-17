import { useState } from 'react'
import type { PersonalInfo, ContactFormData, FormValidationErrors } from '../types'
import { validateContactForm, sanitizeInput } from '../utils/validation'
import InteractiveButton from './InteractiveButton'

interface ContactProps {
  personalInfo: PersonalInfo
}

const Contact = ({ personalInfo }: ContactProps) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<FormValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Sanitize input to prevent XSS attacks
    const sanitizedValue = sanitizeInput(value)
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validationResult = validateContactForm(formData)
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors)
      // Focus on first error field for better accessibility
      const firstErrorField = Object.keys(validationResult.errors)[0]
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        element?.focus()
      }
      return
    }
    
    // Clear any existing errors
    setErrors({})
    
    // Start form submission
    setIsSubmitting(true)
    
    try {
      await fetch("ADD_YOUR_URL",{
        method:"POST",
        body: JSON.stringify(formData)
      })
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch(err){
      console.log("Error submitting the form.");
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="contact-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Enhanced responsive typography */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 id="contact-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Get In Touch
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              I'm always interested in new opportunities and collaborations. 
              Feel free to reach out if you'd like to discuss a project or just say hello!
            </p>
          </div>

          {/* Main content grid - Enhanced responsive layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Contact Form - Enhanced responsive design */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8" role="region" aria-labelledby="contact-form-heading">
              <h3 id="contact-form-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                Send a Message
              </h3>
              
              {isSubmitted && (
                <div 
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium text-sm sm:text-base">
                      Thank you for your message! I'll get back to you soon.
                    </p>
                  </div>
                </div>
              )}

              {Object.keys(errors).length > 0 && (
                <div 
                  className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-800 font-medium text-sm sm:text-base">
                      Please fix the errors below before submitting.
                    </p>
                  </div>
                </div>
              )}

              <form 
                onSubmit={handleSubmit} 
                className="space-y-4 sm:space-y-6"
                noValidate
                aria-describedby="form-instructions"
              >
                <div id="form-instructions" className="sr-only">
                  Fill out this form to send me a message. All fields marked with an asterisk are required.
                </div>

                {/* Name Field - Responsive styling */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Name <span aria-label="required" className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                      errors.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Your full name"
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-required="true"
                    autoComplete="name"
                  />
                  <div id="name-help" className="sr-only">Enter your full name</div>
                  {errors.name && (
                    <p id="name-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field - Responsive styling */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Email <span aria-label="required" className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                      errors.email 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="your.email@example.com"
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-required="true"
                    autoComplete="email"
                  />
                  <div id="email-help" className="sr-only">Enter your email address</div>
                  {errors.email && (
                    <p id="email-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message Field - Responsive styling */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2"
                  >
                    Message <span aria-label="required" className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical text-sm sm:text-base ${
                      errors.message 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Tell me about your project or just say hello..."
                    aria-describedby={errors.message ? 'message-error' : 'message-help'}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-required="true"
                  />
                  <div id="message-help" className="sr-only">Enter your message (minimum 10 characters)</div>
                  {errors.message && (
                    <p id="message-error" className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button - Responsive styling */}
                <InteractiveButton
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  loading={isSubmitting}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  ariaLabel={isSubmitting ? 'Sending message, please wait' : 'Send message'}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </InteractiveButton>
              </form>
            </div>

            {/* Contact Information - Enhanced responsive layout */}
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              {/* Alternative Contact Methods */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8" role="region" aria-labelledby="alt-contact-heading">
                <h3 id="alt-contact-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Other Ways to Reach Me
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Email - Responsive layout */}
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0" aria-hidden="true">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm sm:text-base">Email</p>
                      <a 
                        href={`mailto:${personalInfo.email}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base break-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label={`Send email to ${personalInfo.email}`}
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links - Enhanced responsive design */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8" role="region" aria-labelledby="social-heading">
                <h3 id="social-heading" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Connect on Social Media
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" role="list">
                  {personalInfo.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Connect with me on ${link.platform} (opens in new tab)`}
                      role="listitem"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        {link.icon === 'github' && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        )}
                        {link.icon === 'linkedin' && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                        {link.icon === 'twitter' && (
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 text-sm sm:text-base">
                        {link.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact