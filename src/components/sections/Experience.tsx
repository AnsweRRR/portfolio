import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { experiences } from "../../api/experience";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn, textVariant } from "../../utils/motion";

interface ExperienceItemProps {
  index: number;
  experience: {
    company: string;
    logo: string;
    position: string;
    period: string;
    description: string;
  }
}

const ExperienceItem = ({ index, experience }: ExperienceItemProps) => {
  const isLeft = index % 2 === 0;
  const fadeInSide = isLeft ? "right" : "left";

  return (
    <motion.div variants={fadeIn(fadeInSide, "spring", index * 0.5, 0.75)}>
      <div
        key={experience.company + index}
        className={`flex flex-col md:flex-row items-center justify-between w-full`}
      >
        {isLeft ? (
          <div className="hidden md:block md:w-5/12 md:text-right md:pr-8">
            <h3 className="text-xl font-semibold">{experience.position}</h3>
            <p className="text-gray-600">{experience.company}</p>
            <p className="italic text-sm text-gray-500">{experience.period}</p>
            <p className="mt-2 text-gray-700">{experience.description}</p>
          </div>
        ) : (
          <div className="hidden md:block md:w-5/12"></div>
        )}

        <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-indigo-500 shadow-md mx-auto md:mx-0">
          <img
            src={experience.logo}
            alt={`${experience.company} logo`}
            className="object-contain w-10 h-10"
            loading="lazy"
          />
        </div>

        {!isLeft ? (
          <div className="hidden md:block md:w-5/12 md:text-left md:pl-8">
            <h3 className="text-xl font-semibold">{experience.position}</h3>
            <p className="text-gray-600">{experience.company}</p>
            <p className="italic text-sm text-gray-500">{experience.period}</p>
            <p className="mt-2 text-gray-700">{experience.description}</p>
          </div>
        ) : (
          <div className="hidden md:block md:w-5/12"></div>
        )}

        {/* Mobile content - always below logo */}
        <div className="md:hidden w-full text-center mt-4">
          <h3 className="text-xl font-semibold">{experience.position}</h3>
          <p className="text-gray-600">{experience.company}</p>
          <p className="italic text-sm text-gray-500">{experience.period}</p>
          <p className="mt-2 text-gray-700">{experience.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <motion.div variants={textVariant()}>
        <h2 className="text-3xl font-bold text-center mb-12">{t('experience.title')}</h2>
        <p className="text-center text-gray-600 mb-8">{t('experience.subtitle')}</p>
      </motion.div>
      <div className="relative">
        <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 h-full border-l-2 border-gray-300"></div>
        <div className="flex flex-col space-y-12">
          {experiences.map((exp, index) => <ExperienceItem key={index} experience={exp} index={index} />)}
        </div>
      </div>
    </div>
  );
}

const WrappedExperience = SectionWrapper(Experience, "experience");
export default WrappedExperience;