import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronLeft, FiChevronRight, FiMove } from "react-icons/fi";
import { styles } from "../../styles";
import { fadeIn, textVariant } from "../../utils/motion";
import { testimonials } from "../../api/testimonials";
import SectionWrapper from "../../hoc/SectionWrapper";

interface FeedbackCardProps {
  index: number;
  testimonialKey: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  isActive?: boolean;
}

const FeedbackCard = ({ index, testimonialKey, name, designation, company, image, isActive }: FeedbackCardProps) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      variants={fadeIn("", "spring", index * 0.5, 0.75)}
      className={`bg-black-200 dark:bg-black-200 bg-black-200-light p-6 sm:p-10 rounded-3xl w-[280px] sm:w-[320px] transition-all duration-300 ${
        isActive ? 'scale-110 z-10' : 'scale-90 opacity-70'
      }`}
    >
      <p className="text-white-100 dark:text-white-100 text-white-100-light font-black text-[48px]">"</p>
      <div className="mt-1">
        <p className="text-white-100 dark:text-white-100 text-white-100-light tracking-wider text-[18px]">{t(testimonialKey)}</p>
        <div className="mt-7 flex justify-between items-center gap-1">
          <div className="flex-1 flex flex-col">
            <p className="text-white-100 dark:text-white-100 text-white-100-light font-medium text-[16px]">
              <span className="blue-text-gradient">@</span> {name}
            </p>
            <p className="mt-1 text-secondary dark:text-secondary text-secondary-light text-[12px]">
              {designation} of {company}
            </p>
          </div>
          <img
            src={image}
            alt={`feedback-by-${name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
};

const Feedbacks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const controls = useAnimation();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const total = testimonials.length;
    const prev = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    return [
      testimonials[prev],
      testimonials[activeIndex],
      testimonials[next]
    ];
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        prevTestimonial();
      } else {
        nextTestimonial();
      }
    }
    controls.start({ x: 0 });
  };

  return (
    <div className={`mt-12 bg-black-100 dark:bg-black-100 bg-black-100-light rounded-[20px] w-full max-w-7xl mx-auto overflow-hidden`}>
      <div
        className={`bg-tertiary dark:bg-tertiary bg-tertiary-light rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-secondary dark:text-secondary text-secondary-light`}>{t('testimonials.subtitle')}</p>
          <h2 className={`${styles.sectionHeadText} text-white-100 dark:text-white-100 text-white-100-light`}>{t('testimonials.title')}</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 px-4 sm:${styles.paddingX} flex items-center justify-center max-w-5xl mx-auto relative`}>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-secondary dark:text-secondary text-secondary-light text-sm bg-black-100 dark:bg-black-100 bg-black-100-light px-4 py-2 rounded-full"
          >
            <motion.div
              animate={{
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <FiMove className="h-5 w-5" />
            </motion.div>
            <span>{t('testimonials.swipeHint')}</span>
          </motion.div>
        )}

        <div className="flex items-center mr-4 z-10">
          <button
            onClick={prevTestimonial}
            className="bg-tertiary dark:bg-tertiary bg-tertiary-light p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary hover:bg-secondary-light transition-colors"
          >
            <FiChevronLeft className="h-6 w-6 text-white-100 dark:text-white-100 text-white-100-light" />
          </button>
        </div>

        <div className="relative flex-1 flex justify-center">
          <motion.div 
            className="flex gap-2 sm:gap-4 items-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <FeedbackCard
                  {...testimonial}
                  index={index}
                  isActive={index === 1}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="flex items-center ml-4 z-10">
          <button
            onClick={nextTestimonial}
            className="bg-tertiary dark:bg-tertiary bg-tertiary-light p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary hover:bg-secondary-light transition-colors"
          >
            <FiChevronRight className="h-6 w-6 text-white-100 dark:text-white-100 text-white-100-light" />
          </button>
        </div>
      </div>
    </div>
  );
};

const WrappedFeedbacks = SectionWrapper(Feedbacks, "testimonials");
export default WrappedFeedbacks;