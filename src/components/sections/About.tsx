import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../../hoc/SectionWrapper';
import { useState, useEffect } from 'react';
import Modal from '../Modal';
import CV from './CV';
import { FiExternalLink } from 'react-icons/fi';

// Gépelős effektus hook
function useTypewriter(text: string, speed: number = 30) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return displayed;
}

const About = () => {
  const { t } = useTranslation();
  const [isCVOpen, setCVOpen] = useState(false);
  const description = t('about.description');
  const typedDescription = useTypewriter(description, 18);

  return (
    <section 
      className="w-full bg-gray-100 dark:bg-gray-900 py-16 px-4 rounded-[2rem]"
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
            src="/images/pogranyitamas.png" 
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
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl min-h-[3em]">
            {typedDescription}
          </p>
          {/* <button
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-150 font-semibold flex items-center justify-center gap-2"
            onClick={() => setCVOpen(true)}
          >
            <FiExternalLink className="mr-2 h-4 w-4" />
            {t('about.cv_button')}
          </button> */}
          <Modal isOpen={isCVOpen} onClose={() => setCVOpen(false)}>
            <CV isModal />
          </Modal>
        </motion.div>

      </div>
    </section>
  );
}

const WrappedAbout = SectionWrapper(About, "about");
export default WrappedAbout;