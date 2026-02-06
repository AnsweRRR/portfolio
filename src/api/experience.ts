export interface ExperienceItem {
  company: string;
  logo: string;
  position: string;
  period: string;
  description: string;
  url: string;
}

export const experiences: ExperienceItem[] = [
  {
    company: "NanoworX",
    logo: "/images/companies/nanoworx.png",
    position: "experience.nanoworx.position",
    period: "2021 - 2026",
    description: "experience.nanoworx.description",
    url: "https://nanoworx.hu"
  },
  {
    company: "Freelancer",
    logo: "/images/companies/self-employed.png",
    position: "experience.freelancer.position",
    period: "2024 - ",
    description: "experience.freelancer.description",
    url: "https://pogranyitamas.com/"
  },
  {
    company: "DGITAL",
    logo: "/images/companies/dgital.png",
    position: "experience.dgital.position",
    period: "2026 - ",
    description: "experience.dgital.description",
    url: "https://dgital.com"
  },
];