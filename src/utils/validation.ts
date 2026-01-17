import type { ContactFormData, FormValidationErrors, FormValidationResult } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const sanitizeInput = (input: string): string => {
  // Remove script tags and other potentially dangerous HTML
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .trim();
};

export const validateContactForm = (formData: ContactFormData): FormValidationResult => {
  const errors: FormValidationErrors = {};
  let isValid = true;

  // Validate name
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Validate email
  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }

  // Validate message
  if (!validateRequired(formData.message)) {
    errors.message = 'Message is required';
    isValid = false;
  } else if (!validateMinLength(formData.message, 10)) {
    errors.message = 'Message must be at least 10 characters long';
    isValid = false;
  }

  return { isValid, errors };
};