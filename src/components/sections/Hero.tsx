import { useTranslation } from "react-i18next";
import { styles } from "../../styles";
import { ComputerCanvas } from "../canvas";
import Scroller from "../Scroller";
import Typewriter from "../Typewriter";

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
                {t('hero.greetingWithName').split('Tamás').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && <span className='text-[#915EFF]'>Tamás</span>}
                  </span>
                ))}
              </>
            ) : (
              <>
                {t('hero.greeting')} <span className='text-[#915EFF]'>{t('hero.name')}</span>
              </>
            )}
          </h1>
          <div className={`${styles.heroSubText} mt-2 text-secondary dark:text-secondary text-secondary-light`}>
            <Typewriter 
              text={t('hero.subtitle')} 
              speed={50} 
              delay={1000}
            />
          </div>
        </div>
      </div>

      <ComputerCanvas />

      <Scroller targetHref='#about' absolute />
    </section>
  );
};

export default Hero;
