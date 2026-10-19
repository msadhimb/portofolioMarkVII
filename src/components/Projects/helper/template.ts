export const templateProjects = [
  {
    slug: "placeholder-featured",
    title: "Project title placeholder",
    tagline: "Project tagline placeholder text",
    context: "Context placeholder",
    period: "2024",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
    image: "",
    featured: true,
    metrics: [
      { label: "Metric", value: "000" },
      { label: "Metric", value: "000" },
      { label: "Metric", value: "000" },
      { label: "Metric", value: "000" },
    ],
    technologies: ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
    links: [],
  },
]

export const templateRestProject = [0, 1].map((i) => ({
  slug: `placeholder-rest-${i}`,
  title: "Project title placeholder",
  tagline: "Project tagline placeholder text",
  context: "Context placeholder",
  period: "2024",
  description:
    "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.",
  image: "",
  featured: false,
  technologies: ["React", "Next.js", "TypeScript", "Tailwind"],
  links: [],
}))
