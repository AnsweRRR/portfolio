import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../../hoc/SectionWrapper";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../utils/motion";
import { projects } from "../../api/projects";

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
      <article className="violet-gradient p-[1px] rounded-2xl">
        <div className="bg-[#1d1836] dark:bg-[#1d1836] bg-gray-100 rounded-2xl overflow-hidden flex flex-col h-full">
          <div className="relative w-full h-48 group overflow-hidden">
            <img
              src={project.image}
              alt={`${project.title} project screenshot`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-100 dark:text-white-100 text-white-100-light hover:text-[#915EFF] transition-colors duration-300"
                  title={t('work.viewCode')}
                  aria-label={`View ${project.title} source code on GitHub`}
                >
                  <FaGithub size={24} />
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white-100 dark:text-white-100 text-white-100-light hover:text-[#915EFF] transition-colors duration-300"
                  title={t('work.viewProject')}
                  aria-label={`View ${project.title} live project`}
                >
                  <FiExternalLink size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between p-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-white-100 dark:text-white-100 text-white-100-light">
                {project.title}
              </h3>
              <div className="h-24 overflow-y-auto custom-scrollbar mb-4">
                <p className="text-sm text-secondary dark:text-secondary text-secondary-light">
                  {t(project.description)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Project technologies">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#915EFF]/20 text-[#915EFF] px-2 py-1 rounded-full"
                  role="listitem"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

const Work = () => {
  const { t } = useTranslation();

  return (
    <section 
      className="py-12 px-4 max-w-6xl mx-auto"
      aria-labelledby="work-title"
    >
      <motion.div variants={textVariant()}>
        <h2 id="work-title" className="text-3xl font-bold text-center mb-8 text-white-100 dark:text-white-100 text-white-100-light">{t('work.title')}</h2>
        <p className="text-center text-secondary dark:text-secondary text-secondary-light mb-8">{t('work.subtitle')}</p>
      </motion.div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Project portfolio">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} project={project} />
        ))}
      </div>
    </section>
  );
};

const WrappedWork = SectionWrapper(Work, "work");
export default WrappedWork;