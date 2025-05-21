import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../../hoc/SectionWrapper";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";

const projects = [
  {
    title: "ShoutOut",
    description: "Egy egyszerű feladatkezelő alkalmazás, ahol a felhasználók létrehozhatják, módosíthatják és törölhetik a feladataikat.",
    image: "/images/projects/TODO.png",
    github: "https://github.com/AnsweRRR/shout-out-api",
    live: "https://github.com/AnsweRRR/shout-out-api",
    tags: ["React", "Material UI", "TypeScript", ".NET", "SignalR"]
  },
  {
    title: "Időjárás App",
    description: "Egy alkalmazás, amivel valós idejű időjárás adatokat lehet lekérdezni városok szerint.",
    image: "/images/projects/TODO.png",
    github: "https://github.com/felhasznalo/weather-app",
    live: "https://weather-app.vercel.app",
    tags: ["Next.js", "OpenWeather API", "Tailwind"]
  }
];

interface ProjectCardProps {
  index: number;
  project: {
    title: string;
    description: string;
    image: string;
    github: string;
    live: string;
    tags: string[];
  };
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <img
          src={project.image}
          alt={project.title}
          className="rounded-t-2xl"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-end gap-4 text-lg text-gray-600">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
            title={t('work.viewCode')}
          >
            <FaGithub />
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
            title={t('work.viewProject')}
          >
            <FiExternalLink />
          </a>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

const Work = () => {
  const { t } = useTranslation();

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <motion.div variants={textVariant()}>
        <h2 className="text-3xl font-bold text-center mb-8">{t('work.title')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('work.subtitle')}</p>
      </motion.div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} project={project} />
        ))}
      </div>
    </div>
  );
};

const WrappedWork = SectionWrapper(Work, "work");
export default WrappedWork;