import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navLinks } from "../../api/navlink";
import { styles } from "../../styles";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";
import { useBlogAvailability } from "../../hooks/useBlogAvailability";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const blogAvailability = useBlogAvailability();
  const visibleNavLinks = navLinks.filter((nav) => nav.id !== "blog" || blogAvailability === "available");

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

  useEffect(() => {
    const handleScrollToTop = () => {
      setActive("");
    };

    window.addEventListener('scrollToTop', handleScrollToTop);

    return () => {
      window.removeEventListener('scrollToTop', handleScrollToTop);
    };
  }, []);

  const navLinkStyles = css`
    text-decoration: none;
    position: relative;

    &::before,
    &::after {
      content: "";
      position: absolute;
      display: block;
      border: 0 solid transparent;
      width: 0%;
      height: 0%;
      transition: all 0.3s ease;
    }

    &::after {
      top: -6px;
      left: -6px;
      border-top: 2px solid transparent;
      border-left: 2px solid transparent;
    }

    &::before {
      right: -6px;
      bottom: -6px;
      border-bottom: 2px solid transparent;
      border-right: 2px solid transparent;
    }

    &:hover::before,
    &:hover::after {
      width: 18px;
      height: 18px;
      border-color: #A6A6A6;
    }
  `;

  const StyledNavLink = styled.a`${navLinkStyles}`;
  const StyledNavRouterLink = styled(Link)`${navLinkStyles}`;

  // Anchor-scroll nav items only work while mounted on the homepage; from any
  // other route they navigate home first, then let HomePage's hash effect scroll.
  const navTarget = (nav: { id: string; route?: string }) =>
    nav.route ?? (!isHome ? `/#${nav.id}` : undefined);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary shadow-lg" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-2 hover:text-[#915EFF] transition-colors duration-200'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white-100 text-[18px] font-bold cursor-pointer flex items-center hover:text-[#915EFF] dark:hover:text-[#b89cff] transition-colors duration-200'>
            <img src="/favicon/favicon-32x32.png" alt="Logo" className="w-6 h-6 mr-2" />
            {t('hero.name')} &nbsp;
            <span className='sm:block hidden'> | {t('hero.title')}</span>
          </p>
        </Link>

        <ul className='list-none hidden lg:flex flex-row gap-10 items-center'>
          {visibleNavLinks.map((nav) => {
            const to = navTarget(nav);
            return (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-white-100" : "text-secondary"
                } hover:text-white-100 text-[18px] font-medium cursor-pointer`}
                onClick={() => setActive(nav.title)}
              >
                {to ? (
                  <StyledNavRouterLink to={to}>{t(`nav.${nav.id}`)}</StyledNavRouterLink>
                ) : (
                  <StyledNavLink href={`#${nav.id}`}>{t(`nav.${nav.id}`)}</StyledNavLink>
                )}
              </li>
            );
          })}
          <li className="flex items-center gap-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`${i18n.language === 'en' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[18px] font-medium cursor-pointer`}
            >
              🇬🇧
            </button>
            <button
              onClick={() => changeLanguage('hu')}
              className={`${i18n.language === 'hu' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[18px] font-medium cursor-pointer`}
            >
              🇭🇺
            </button>
            <button
              onClick={() => changeLanguage('de')}
              className={`${i18n.language === 'de' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[18px] font-medium cursor-pointer`}
            >
              🇩🇪
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-tertiary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <FiSun className="w-5 h-5 text-white-100" />
              ) : (
                <FiMoon className="w-5 h-5 text-white-100" />
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
            <span className={`w-6 h-0.5 bg-white-100 transition-all duration-300 ${toggle ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white-100 transition-all duration-300 ${toggle ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white-100 transition-all duration-300 ${toggle ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          <div
            ref={menuRef}
            className={`${
              !toggle ? "-translate-y-4 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
            } absolute top-16 right-0 w-[200px] bg-white/95 dark:bg-[rgba(5,8,22,0.97)] backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ease-in-out z-20`}
          >
            <ul className="list-none flex flex-col gap-4 p-4">
              {visibleNavLinks.map((nav) => {
                const to = navTarget(nav);
                return (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] w-full ${
                      active === nav.title ? "text-white-100" : "text-secondary"
                    } hover:text-white-100 transition-colors duration-200`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    {to ? (
                      <StyledNavRouterLink to={to} className="block py-1">{t(`nav.${nav.id}`)}</StyledNavRouterLink>
                    ) : (
                      <StyledNavLink href={`#${nav.id}`} className="block py-1">{t(`nav.${nav.id}`)}</StyledNavLink>
                    )}
                  </li>
                );
              })}
              <li className="flex items-center justify-between w-full pt-2 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`${i18n.language === 'en' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇬🇧
                  </button>
                  <button
                    onClick={() => changeLanguage('hu')}
                    className={`${i18n.language === 'hu' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇭🇺
                  </button>
                  <button
                    onClick={() => changeLanguage('de')}
                    className={`${i18n.language === 'de' ? 'text-white-100' : 'text-secondary'} hover:text-white-100 text-[16px] font-medium cursor-pointer transition-colors duration-200`}
                  >
                    🇩🇪
                  </button>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-tertiary transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FiSun className="w-5 h-5 text-white-100" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-white-100" />
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
