import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { styles } from "../../styles";
import { ComputerCanvas } from "../canvas";

const Hero = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white-100 dark:text-white-100 text-white-100-light`}>
            {i18n.language === 'hu' ? (
              <>
                {t('hero.greetingWithName').split('Tomi').map((part, index, array) => (
                  <>
                    {part}
                    {index < array.length - 1 && <span className='text-[#915EFF]'>Tomi</span>}
                  </>
                ))}
              </>
            ) : (
              <>
                {t('hero.greeting')} <span className='text-[#915EFF]'>{t('hero.name')}</span>
              </>
            )}
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-secondary dark:text-secondary text-secondary-light`}>
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      <ComputerCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-secondary dark:border-secondary border-secondary-light flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-secondary dark:bg-secondary bg-secondary-light mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
