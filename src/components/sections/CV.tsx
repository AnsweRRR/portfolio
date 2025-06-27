import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PaperTabletCanvas } from "../canvas";
import Scroller from "../Scroller";

interface CVProps {
  isModal?: boolean;
}

const CV: React.FC<CVProps> = ({ isModal }) => {
  const { t } = useTranslation();

  return (
    <section
      className={
        isModal
          ? "w-full bg-gray-100 dark:bg-gray-900 py-2 px-2 rounded-xl overflow-x-hidden overflow-y-hidden"
          : "w-full bg-gray-100 dark:bg-gray-900 py-16 px-4 rounded-[2rem] overflow-x-hidden overflow-y-hidden"
      }
      aria-labelledby="cv-title"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 id="cv-title" className={isModal ? "text-xl font-bold text-gray-800 dark:text-white mb-4" : "text-4xl font-bold text-gray-800 dark:text-white mb-4"}>
            {t('cv.title', 'CV / Önéletrajz')}
          </h2>
          <p className={isModal ? "text-gray-700 dark:text-gray-300 text-base max-w-2xl mx-auto" : "text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto"}>
            {t('cv.description', 'Interaktív 3D önéletrajz - forgasd meg a tablettet a jobb megtekintéshez!')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={
            isModal
              ? "w-full h-[300px] sm:h-[350px] mx-auto my-4"
              : "w-full h-[300px] sm:h-[550px] mx-auto sm:my-12"
          }
        >
          <PaperTabletCanvas />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-4 sm:mt-8 relative"
        >
          {!isModal && <Scroller targetHref="#experience" />}
        </motion.div>
      </div>
    </section>
  );
};

export default CV; 