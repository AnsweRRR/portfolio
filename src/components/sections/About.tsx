import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../../hoc/SectionWrapper';
import { useState, useEffect, useRef } from 'react';
import Modal from '../Modal';
import CV from './CV';
import { FiExternalLink } from 'react-icons/fi';

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
  const [isHovered, setIsHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const description = t('about.description');
  const typedDescription = useTypewriter(description, 18);

  const images = [
    "/images/pogranyitamas.png",
    "/images/pogranyitamas_swag.png"
  ];

  useEffect(() => {
    if (isHovered) {
      const startProgress = () => {
        setProgress(0);
        const startTime = Date.now();
        const duration = 2000;

        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / duration) * 100, 100);
          setProgress(newProgress);

          if (newProgress >= 100) {
            setCurrentImage(prev => (prev + 1) % images.length);
            if (isHovered) {
              clearInterval(interval);
              startProgress();
            }
          }
        }, 16);

        progressIntervalRef.current = interval;
      };

      startProgress();

      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setProgress(0);
    }
  }, [isHovered, images.length]);

  const radius = 98;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
          className="relative w-56 h-56"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="w-56 h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary relative z-20">
            <img 
              src={images[currentImage]} 
              alt="Tamas Pogranyi - Full Stack Developer" 
              className="w-full h-full animate-pulse"
              style={{ imageRendering: 'auto' }}
              loading="eager"
            />
          </div>

          <svg
            className={`absolute inset-0 w-full h-full transform -rotate-90 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 30 }}
          >
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="rgba(145, 94, 255, 0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="112"
              cy="112"
              r="98"
              stroke="#915EFF"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.1s ease-out'
              }}
            />
          </svg>
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
          <button
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-150 font-semibold flex items-center justify-center gap-2"
            onClick={() => setCVOpen(true)}
          >
            <FiExternalLink className="mr-2 h-4 w-4" />
            {t('about.cv_button')}
          </button>
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