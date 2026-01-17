import { describe, it, expect } from 'vitest';
import { validateEmail, validateRequired, validateMinLength, sanitizeInput } from './validation';

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty strings', () => {
      expect(validateRequired('test')).toBe(true);
      expect(validateRequired('  test  ')).toBe(true);
    });

    it('should reject empty or whitespace-only strings', () => {
      expect(validateRequired('')).toBe(false);
      expect(validateRequired('   ')).toBe(false);
    });
  });

  describe('validateMinLength', () => {
    it('should validate strings meeting minimum length', () => {
      expect(validateMinLength('hello world', 10)).toBe(true);
      expect(validateMinLength('test', 4)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(validateMinLength('short', 10)).toBe(false);
      expect(validateMinLength('   ', 5)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("xss")</script> World';
      const expected = 'Hello  World';
      expect(sanitizeInput(input)).toBe(expected);
    });

    it('should preserve safe content', () => {
      const input = 'This is safe content with <b>bold</b> text';
      const expected = 'This is safe content with bold text';
      expect(sanitizeInput(input)).toBe(expected);
    });
  });
});