import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../../hoc/SectionWrapper';

const About = () => {
  const { t } = useTranslation();

  return (
    <section 
      className="w-full bg-gray-100 dark:bg-gray-900 py-16 px-4"
      aria-labelledby="about-title"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6 }}
          className="w-48 h-48 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary"
        >
          <img 
            src="/images/ghibly_myself.png" 
            alt="Tamas Pogranyi - Full Stack Developer" 
            className="w-full h-full animate-pulse"
            style={{ imageRendering: 'auto' }}
            loading="eager"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h2 id="about-title" className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{t('about.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
            {t('about.description')}
          </p>
        </motion.div>

      </div>
    </section>
  );
}

const WrappedAbout = SectionWrapper(About, "about");
export default WrappedAbout;