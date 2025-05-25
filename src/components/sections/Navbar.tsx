import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navLinks } from "../../api/navlink";
import { styles } from "../../styles";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggle]);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary dark:bg-primary bg-primary-light shadow-lg" : "bg-transparent"
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
          <p className='text-white-100 dark:text-white-100 text-white-100-light text-[18px] font-bold cursor-pointer flex items-center'>
            <img src="/favicon/favicon-32x32.png" alt="Logo" className="w-6 h-6 mr-2" />
            {t('hero.name')} &nbsp;
            <span className='sm:block hidden'> | {t('hero.title')}</span>
          </p>
        </Link>

        <ul className='list-none hidden lg:flex flex-row gap-10 items-center'>
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white-100 dark:text-white-100 text-white-100-light" : "text-secondary dark:text-secondary text-secondary-light"
              } hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{t(`nav.${nav.id}`)}</a>
            </li>
          ))}
          <li className="flex items-center gap-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`${i18n.language === 'en' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[18px] font-medium cursor-pointer`}
            >
              🇬🇧
            </button>
            <button
              onClick={() => changeLanguage('hu')}
              className={`${i18n.language === 'hu' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[18px] font-medium cursor-pointer`}
            >
              🇭🇺
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`${i18n.language === 'de' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[18px] font-medium cursor-pointer`}
            >
              🇩🇪
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-tertiary dark:hover:bg-tertiary hover:bg-tertiary-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-white-100 dark:text-white-100 text-white-100-light" />
              ) : (
                <FiMoon className="w-5 h-5 text-white-100 dark:text-white-100 text-white-100-light" />
              )}
            </button>
          </li>
        </ul>

        <div className='lg:hidden flex flex-1 justify-end items-center'>
          <button
            ref={toggleButtonRef}
            onClick={() => setToggle(!toggle)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 relative z-30"
          >
            <span className={`w-6 h-0.5 bg-white-100 dark:bg-white-100 bg-white-100-light transition-all duration-300 ${toggle ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white-100 dark:bg-white-100 bg-white-100-light transition-all duration-300 ${toggle ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white-100 dark:bg-white-100 bg-white-100-light transition-all duration-300 ${toggle ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          <div
            ref={menuRef}
            className={`${
              !toggle ? "-translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
            } absolute top-16 right-0 w-[200px] bg-primary/95 dark:bg-primary/95 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ease-in-out z-20`}
          >
            <ul className="list-none flex flex-col gap-4 p-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] w-full ${
                    active === nav.title ? "text-white-100 dark:text-white-100 text-white-100-light" : "text-secondary dark:text-secondary text-secondary-light"
                  } hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light transition-colors duration-200`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`} className="block py-1">{t(`nav.${nav.id}`)}</a>
                </li>
              ))}
              <li className="flex items-center justify-between w-full pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`${i18n.language === 'en' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇬🇧
                  </button>
                  <button
                    onClick={() => changeLanguage('hu')}
                    className={`${i18n.language === 'hu' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇭🇺
                  </button>
                  <button
                    onClick={() => changeLanguage('de')}
                    className={`${i18n.language === 'de' ? 'text-white-100 dark:text-white-100 text-white-100-light' : 'text-secondary dark:text-secondary text-secondary-light'} hover:text-white-100 dark:hover:text-white-100 hover:text-white-100-light text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇩🇪
                  </button>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-tertiary dark:hover:bg-tertiary hover:bg-tertiary-light transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FiSun className="w-5 h-5 text-white-100 dark:text-white-100 text-white-100-light" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-white-100 dark:text-white-100 text-white-100-light" />
                  )}
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
