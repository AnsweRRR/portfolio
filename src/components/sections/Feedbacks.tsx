import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState, useEffect } from "react";
import { styles } from "../../styles";
import { fadeIn, textVariant } from "../../utils/motion";
import { testimonials } from "../../api/testimonials";

interface FeedbackCardProps {
  index: number;
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  isActive?: boolean;
}

const FeedbackCard = ({ index, testimonial, name, designation, company, image, isActive }: FeedbackCardProps) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className={`bg-black-200 dark:bg-black-200 bg-black-200-light p-6 sm:p-10 rounded-3xl w-[280px] sm:w-[320px] transition-all duration-300 ${
      isActive ? 'scale-110 z-10' : 'scale-90 opacity-70'
    }`}
  >
    <p className="text-white-100 dark:text-white-100 text-white-100-light font-black text-[48px]">"</p>
    <div className="mt-1">
      <p className="text-white-100 dark:text-white-100 text-white-100-light tracking-wider text-[18px]">{testimonial}</p>
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

const Feedbacks = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 3000);

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
          <p className={`${styles.sectionSubText} text-secondary dark:text-secondary text-secondary-light`}>What others say</p>
          <h2 className={`${styles.sectionHeadText} text-white-100 dark:text-white-100 text-white-100-light`}>Testimonials.</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 px-4 sm:${styles.paddingX} flex items-center justify-center max-w-5xl mx-auto relative`}>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-secondary dark:text-secondary text-secondary-light text-sm"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </motion.div>
            <span>Swipe to navigate</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mr-4"
        >
          <button
            onClick={prevTestimonial}
            className="bg-tertiary dark:bg-tertiary bg-tertiary-light p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary hover:bg-secondary-light transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white-100 dark:text-white-100 text-white-100-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </motion.div>

        <motion.div 
          className="flex gap-2 sm:gap-4 items-center cursor-grab active:cursor-grabbing relative"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {getVisibleTestimonials().map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <FeedbackCard
                {...testimonial}
                index={index}
                isActive={index === 1}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center ml-4"
        >
          <button
            onClick={nextTestimonial}
            className="bg-tertiary dark:bg-tertiary bg-tertiary-light p-2 rounded-full hover:bg-secondary dark:hover:bg-secondary hover:bg-secondary-light transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white-100 dark:text-white-100 text-white-100-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Feedbacks; 