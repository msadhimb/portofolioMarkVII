export const siteConfig = {
  siteName: "Muhamad Salman Adhim Baqy",
  shortName: "Salman",
  monogram: "ms",
  location: "Salatiga, Jawa Tengah",
  email: "halo@salmanbaqy.dev",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
};

export type Experience = {
  period: string;
  role: string;
  org: string;
  context: string;
  points: string[];
  stack: string[];
};

export type SkillGroup = {
  title: string;
  note: string;
  items: string[];
};
