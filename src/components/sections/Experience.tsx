import SectionWrapper from "../../hoc/SectionWrapper";
interface ExperienceItem {
  company: string;
  logo: string;
  position: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "NanoworX",
    logo: "/images/companies/nanoworx.png",
    position: "Fullstack Developer",
    period: "2020 - 2025",
    description: "Különböző ügyfélprojektek front-end és back-end fejlesztése.",
  },
  {
    company: "Meta",
    logo: "/images/companies/meta.png",
    position: "Frontend Developer",
    period: "2018 - 2020",
    description: "React alapú webalkalmazások fejlesztése és karbantartása.",
  },
  {
    company: "Microsoft",
    logo: "/images/companies/microsoft.png",
    position: "Backend Developer",
    period: "2017 - 2018",
    description: "Backend fejlesztési alapok elsajátítása, kisebb feature-ök implementálása.",
  },
  {
    company: "Freelancer",
    logo: "/images/companies/self-employed.png",
    position: "Developer & Customer Support",
    period: "2025 - ",
    description: "Ügyfélkommunikáció, igények felmérése és megoldások kidolgozása.",
  },
];

const Experience = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-12">Tapasztalat</h2>

      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

        <div className="flex flex-col space-y-12">
          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={exp.company + index}
                className={`flex flex-col md:flex-row items-center justify-between w-full`}
              >
                {isLeft ? (
                  <div className="md:w-5/12 md:text-right md:pr-8 text-center md:text-right">
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="italic text-sm text-gray-500">{exp.period}</p>
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ) : (
                  <div className="hidden md:block md:w-5/12"></div>
                )}

                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-indigo-500 shadow-md mx-auto md:mx-0">
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="object-contain w-10 h-10"
                    loading="lazy"
                  />
                </div>

                {!isLeft ? (
                  <div className="md:w-5/12 md:text-left md:pl-8 text-center md:text-left">
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="italic text-sm text-gray-500">{exp.period}</p>
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ) : (
                  <div className="hidden md:block md:w-5/12"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const WrappedExperience = SectionWrapper(Experience, "experience");
export default WrappedExperience;