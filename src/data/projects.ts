export type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  role: string;
  period: string;
  context: string;
  technologies: string[];
  highlights: string[];
  image: string;
  demoUrl?: string;
  repositoryUrl?: string;
  featured?: boolean;
  metrics?: { label: string; value: string }[];
  decisions?: { title: string; detail: string }[];
};
