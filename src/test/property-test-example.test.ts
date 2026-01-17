import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { validateEmail, validateRequired } from '../utils/validation';

describe('Property-based tests setup verification', () => {
  it('should verify fast-check is working with email validation', () => {
    // **Feature: portfolio-website, Property Setup: Email validation property test**
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          // All valid email addresses should pass validation
          return validateEmail(email) === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify fast-check is working with required field validation', () => {
    // **Feature: portfolio-website, Property Setup: Required field validation property test**
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        (nonEmptyString) => {
          // All non-empty strings should pass required validation
          return validateRequired(nonEmptyString) === true;
        }
      ),
      { numRuns: 100 }
    );
  });
});