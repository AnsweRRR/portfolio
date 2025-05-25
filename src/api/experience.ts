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
  // {
  //   company: "Meta",
  //   logo: "/images/companies/meta.png",
  //   position: "Frontend Developer",
  //   period: "2018 - 2020",
  //   description: "React alapú webalkalmazások fejlesztése és karbantartása.",
  // },
  // {
  //   company: "Microsoft",
  //   logo: "/images/companies/microsoft.png",
  //   position: "Backend Developer",
  //   period: "2017 - 2018",
  //   description: "Backend fejlesztési alapok elsajátítása, kisebb feature-ök implementálása.",
  // },
  {
    company: "Freelancer",
    logo: "/images/companies/self-employed.png",
    position: "experience.freelancer.position",
    period: "2024 - ",
    description: "experience.freelancer.description",
  },
];