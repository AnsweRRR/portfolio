interface ExperienceItem {
  company: string;
  logo: string;
  position: string;
  period: string;
  description: string;
}

export const experiences: ExperienceItem[] = [
  {
    company: "NanoworX",
    logo: "/images/companies/nanoworx.png",
    position: "experience.nanoworx.position",
    period: "2021 - ",
    description: "experience.nanoworx.description",
  },
  {
    company: "Freelancer",
    logo: "/images/companies/self-employed.png",
    position: "experience.freelancer.position",
    period: "2024 - ",
    description: "experience.freelancer.description",
  },
];