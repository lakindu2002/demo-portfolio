export interface PersonalInfo {
  name: string;
  title: string;
  introduction: string;
  about: string;
  photo: string;
  email: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  technologies: string[];
  duration: string;
  previewImage: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Form validation types
export interface FormValidationErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationErrors;
}

// Component prop types
export interface SkillsComponentProps {
  skills: Skill[];
}

export interface ProjectsComponentProps {
  projects: Project[];
}

export interface ContactComponentProps {
  personalInfo: PersonalInfo;
}

export interface HeroComponentProps {
  personalInfo: PersonalInfo;
}

export interface AboutComponentProps {
  personalInfo: PersonalInfo;
}

export interface HeaderComponentProps {
  sections: string[];
  activeSection?: string;
}