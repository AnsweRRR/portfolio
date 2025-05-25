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
    position: "Fullstack Developer",
    period: "2021 - ",
    description: "Egyedi szoftverek fejlesztése, backend és frontend feladatok ellátása .NET fókusszal.",
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
    position: "Developer & Customer Support",
    period: "2024 - ",
    description: "Idő közben elkezdtem kisebb projekteken dolgozni. A feladatok között szerepel a weboldalak, Telegram valamint Discord botok fejlesztése.",
  },
];