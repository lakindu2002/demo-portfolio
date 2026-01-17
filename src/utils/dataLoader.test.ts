import { describe, it, expect } from 'vitest';
import { getPersonalInfo, getSkills, getProjects, getSocialLinks } from './dataLoader';

describe('Data loader utilities', () => {
  describe('getPersonalInfo', () => {
    it('should return personal info with required fields', () => {
      const personalInfo = getPersonalInfo();
      
      expect(personalInfo).toBeDefined();
      expect(personalInfo.name).toBe('John Doe');
      expect(personalInfo.title).toBeDefined();
      expect(personalInfo.introduction).toBeDefined();
      expect(personalInfo.about).toBeDefined();
      expect(personalInfo.email).toBeDefined();
      expect(Array.isArray(personalInfo.socialLinks)).toBe(true);
    });
  });

  describe('getSkills', () => {
    it('should return array of skills with required fields', () => {
      const skills = getSkills();
      
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeGreaterThan(0);
      
      skills.forEach(skill => {
        expect(skill.name).toBeDefined();
        expect(skill.category).toBeDefined();
        expect(['Beginner', 'Intermediate', 'Advanced', 'Expert']).toContain(skill.proficiency);
      });
    });
  });

  describe('getProjects', () => {
    it('should return array of projects with required fields', () => {
      const projects = getProjects();
      
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      
      projects.forEach(project => {
        expect(project.id).toBeDefined();
        expect(project.title).toBeDefined();
        expect(project.description).toBeDefined();
        expect(Array.isArray(project.technologies)).toBe(true);
        expect(project.duration).toBeDefined();
        expect(project.previewImage).toBeDefined();
        expect(typeof project.featured).toBe('boolean');
      });
    });
  });

  describe('getSocialLinks', () => {
    it('should return array of social links with required fields', () => {
      const socialLinks = getSocialLinks();
      
      expect(Array.isArray(socialLinks)).toBe(true);
      expect(socialLinks.length).toBeGreaterThan(0);
      
      socialLinks.forEach(link => {
        expect(link.platform).toBeDefined();
        expect(link.url).toBeDefined();
        expect(link.icon).toBeDefined();
      });
    });
  });
});