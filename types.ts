export interface Experience {
  role: string;
  company: string;
  duration: string;
  location: string;
  achievements: string[];
}

export interface Project {
  title: string;
  subtitle: string;
  tags: string[];
  description: string[];
  metrics: string[];
  image: string;
  links?: { label: string; url: string }[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  duration: string;
  score: string;
}

export interface Achievement {
  title: string;
  description: string;
}