import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navLinks } from "../../api/navlink";
import { styles } from "../../styles";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white text-[18px] font-bold cursor-pointer flex '>
            {t('hero.name')} &nbsp;
            <span className='sm:block hidden'> | {t('hero.title')}</span>
          </p>
        </Link>

        <ul className='list-none hidden sm:flex flex-row gap-10'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{t(`nav.${nav.id}`)}</a>
            </li>
          ))}
          <li className="flex items-center gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`${i18n.language === 'en' ? 'text-white' : 'text-secondary'} hover:text-white text-[18px] font-medium cursor-pointer`}
            >
              🇬🇧
            </button>
            <button
              onClick={() => changeLanguage('hu')}
              className={`${i18n.language === 'hu' ? 'text-white' : 'text-secondary'} hover:text-white text-[18px] font-medium cursor-pointer`}
            >
              🇭🇺
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`${i18n.language === 'de' ? 'text-white' : 'text-secondary'} hover:text-white text-[18px] font-medium cursor-pointer`}
            >
              🇩🇪
            </button>
          </li>
        </ul>

        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <button
            onClick={() => setToggle(!toggle)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 relative z-30"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${toggle ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${toggle ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${toggle ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          <div
            className={`${
              !toggle ? "-translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
            } absolute top-16 right-0 w-[200px] bg-primary/95 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ease-in-out z-20`}
          >
            <ul className='list-none flex flex-col items-start p-4 gap-3'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] w-full ${
                    active === nav.title ? "text-white" : "text-secondary"
                  } hover:text-white transition-colors duration-200`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`} className="block py-1">{t(`nav.${nav.id}`)}</a>
                </li>
              ))}
              <li className="flex items-center gap-4 w-full pt-2 border-t border-white/10">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`${i18n.language === 'en' ? 'text-white' : 'text-secondary'} hover:text-white text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                >
                  🇬🇧
                </button>
                <button
                  onClick={() => changeLanguage('hu')}
                  className={`${i18n.language === 'hu' ? 'text-white' : 'text-secondary'} hover:text-white text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                >
                  🇭🇺
                </button>
                <button
                  onClick={() => changeLanguage('de')}
                  className={`${i18n.language === 'de' ? 'text-white' : 'text-secondary'} hover:text-white text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                >
                  🇩🇪
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
