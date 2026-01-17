import type { PersonalInfo, Skill, Project, SocialLink } from '../types';
import personalInfoData from '../data/personal-info.json';
import skillsData from '../data/skills.json';
import projectsData from '../data/projects.json';
import socialLinksData from '../data/social-links.json';

export const getPersonalInfo = (): PersonalInfo => {
  return personalInfoData as PersonalInfo;
};

export const getSkills = (): Skill[] => {
  return skillsData as Skill[];
};

export const getProjects = (): Project[] => {
  return projectsData as Project[];
};

export const getSocialLinks = (): SocialLink[] => {
  return socialLinksData as SocialLink[];
};