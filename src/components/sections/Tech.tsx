import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionWrapper from "../../hoc/SectionWrapper";
import { fadeIn } from "../../utils/motion";
import { skills } from "../../api/skills";
interface TechCardProps {
  index: number;
  skill: {
    name: string;
    level: number;
    tags: string[];
    image: string;
  };
}

const TechCard = ({index, skill}: TechCardProps) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.2)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        key={skill.name}
        className="rounded-2xl shadow-md p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 bg-white dark:bg-gray-800"
      >
        <img
          src={skill.image}
          alt={skill.name}
          className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between mb-1">
            <h3 className="text-lg sm:text-xl font-semibold truncate">{skill.name}</h3>
            <span className="text-sm text-gray-500 ml-2">{skill.level}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 sm:h-3 rounded-full mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.level}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-blue-500 h-2 sm:h-3 rounded-full"
            ></motion.div>
          </div>
          <div className="text-sm text-gray-600 flex flex-wrap gap-1 sm:gap-2">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 px-2 py-0.5 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Tech = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">{t('tech.title')}</h2>
      <p className="text-center text-gray-600 mb-8">{t('tech.subtitle')}</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4">
        {skills.map((skill, index) => (
          <TechCard key={`skill-${index}`} skill={skill} index={index} />
        ))}
      </div>
    </>
  );
};

const WrappedTech = SectionWrapper(Tech, "tech");
export default WrappedTech;