import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PaperTabletCanvas } from "../canvas";
import SectionWrapper from "../../hoc/SectionWrapper";

const CV = () => {
  const { t } = useTranslation();

  return (
    <section 
      className="w-full bg-gray-100 dark:bg-gray-900 py-16 px-4 rounded-[2rem]"
      aria-labelledby="cv-title"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 id="cv-title" className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('cv.title', 'CV / Önéletrajz')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            {t('cv.description', 'Interaktív 3D önéletrajz - forgasd meg a tablettet a jobb megtekintéshez!')}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full h-[550px] mx-auto"
        >
          <PaperTabletCanvas />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('cv.instruction', 'Használd az egeret a tablett forgatásához')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const WrappedCV = SectionWrapper(CV, "cv");
export default WrappedCV; 