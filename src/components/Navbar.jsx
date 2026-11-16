'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from '@/lib/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { useBooking } from '../context/BookingContext';

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const CurrencyIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m3-10.5c-.667-.5-1.667-1-3-1-2 0-3 1-3 2.25S10 11 12 11s3 .75 3 2.25-1 2.25-3 2.25c-1.333 0-2.333-.5-3-1" />
  </svg>
);
const GlobeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3c2.21 2.48 3.33 5.53 3.33 9s-1.12 6.52-3.33 9c-2.21-2.48-3.33-5.53-3.33-9S9.79 5.48 12 3z" />
  </svg>
);

const LanguageSwitch = ({ language, toggleLanguage, tr, variant }) => {
  const onLight = variant === 'light'; // text on a light surface
  const frame = onLight
    ? 'bg-gray-100 dark:bg-dark-green-900 border-transparent'
    : 'bg-white/10 border-white/10';
  const on = onLight
    ? 'bg-[#1a4d3e] dark:bg-[#4ade80] text-white dark:text-gray-900'
    : 'bg-white text-gray-900';
  const off = onLight ? 'text-gray-500 dark:text-gray-400' : 'text-white/70';
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={tr('Ganti ke English', 'Switch to Indonesian')}
      className={`flex items-center rounded-xl p-1 border text-xs font-medium transition-colors ${frame}`}
    >
      <GlobeIcon className={`w-4 h-4 ml-1.5 mr-1 ${off}`} />
      <span className={`px-2.5 py-1 rounded-lg transition-colors ${language === 'id' ? on : off}`}>ID</span>
      <span className={`px-2.5 py-1 rounded-lg transition-colors ${language === 'en' ? on : off}`}>EN</span>
    </button>
  );
};

const Logo = ({ isDarkText, compact }) => (
  <Link to="/" className="flex items-center gap-3">
    <img src="/image/logo.webp" alt="Hadi Trans Bali" className={`${compact ? 'h-8 w-8' : 'h-10 w-10'} rounded-full object-cover border-2 border-[#c4935f]/20`} />
    <span className={`font-semibold tracking-tight ${compact ? 'text-lg' : 'text-xl'} ${isDarkText ? 'text-gray-900 dark:text-white' : 'text-white'}`} style={{ fontFamily: 'Fraunces, serif' }}>
      Hadi Trans <span className="text-[#c4935f]">Bali</span>
    </span>
  </Link>
);

const NavbarContent = ({ isMenuOpen, setIsMenuOpen, navLinks, isActive, t, tr, language, toggleLanguage, isPill, currency, changeCurrency, allCurrencies, theme, toggleTheme }) => {
  const { resetBooking } = useBooking();
  const isDarkText = isPill || isMenuOpen;

  return (
    <div className={`mx-auto ${isPill ? 'px-6 sm:px-8' : 'max-w-7xl px-6 lg:px-8'}`}>
      {/* Mobile layout */}
      <div className="lg:hidden flex justify-between items-center h-16">
        <Logo isDarkText={isDarkText} compact />
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Menu">
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 transition-[transform,opacity,background-color] duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2 bg-gray-900 dark:bg-white' : isDarkText ? 'bg-gray-900 dark:bg-white' : 'bg-white'}`} />
            <span className={`w-full h-0.5 transition-[transform,opacity,background-color] duration-200 ${isMenuOpen ? 'opacity-0' : isDarkText ? 'bg-gray-900 dark:bg-white' : 'bg-white'}`} />
            <span className={`w-full h-0.5 transition-[transform,opacity,background-color] duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2 bg-gray-900 dark:bg-white' : isDarkText ? 'bg-gray-900 dark:bg-white' : 'bg-white'}`} />
          </div>
        </button>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex flex-col">
        <div className={`flex justify-between items-center ${isPill ? 'h-12' : 'h-14'} border-b ${isDarkText ? 'border-gray-100 dark:border-dark-green-800' : 'border-white/10'}`}>
          <Logo isDarkText={isDarkText} compact={isPill} />

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-colors ${isDarkText ? 'bg-gray-100 dark:bg-dark-green-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-green-800' : 'bg-white/10 text-white hover:bg-white/20'}`}
              aria-label={tr('Ganti tema', 'Toggle theme')}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className={`flex items-center gap-1.5 rounded-xl pl-2.5 pr-3 py-1.5 border transition-colors ${isDarkText ? 'bg-gray-100 dark:bg-dark-green-900 text-gray-700 dark:text-white border-transparent' : 'bg-white/10 text-white border-white/10'}`}>
              <CurrencyIcon className={`w-4 h-4 shrink-0 ${isDarkText ? 'text-gray-400 dark:text-gray-500' : 'text-white/60'}`} />
              <select
                value={currency.code}
                onChange={(e) => changeCurrency(e.target.value)}
                aria-label={tr('Mata uang', 'Currency')}
                className="bg-transparent text-xs font-medium border-none cursor-pointer appearance-none outline-none text-center min-w-[40px]"
              >
                {allCurrencies.map(c => <option key={c.code} value={c.code} className="text-gray-900 bg-white dark:bg-dark-green-900 dark:text-white">{c.code}</option>)}
              </select>
            </div>

            <LanguageSwitch language={language} toggleLanguage={toggleLanguage} tr={tr} variant={isDarkText ? 'light' : 'dark'} />
          </div>
        </div>

        <div className={`flex justify-between items-center ${isPill ? 'h-12' : 'h-14'}`}>
          <nav className="flex items-center gap-1 -ml-3" aria-label={tr('Utama', 'Main')}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-2 text-sm transition-colors ${
                    isDarkText
                      ? active ? 'text-[#1a4d3e] dark:text-[#4ade80] font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium'
                      : active ? 'text-white font-semibold' : 'text-white/75 hover:text-white font-medium'
                  }`}
                >
                  {link.name}
                  {active && <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-[#c4935f]" />}
                </Link>
              );
            })}
          </nav>

          <Link to="/booking"
            onClick={() => resetBooking()}
            className="btn-3d btn-3d-bronze inline-flex items-center px-5 py-2 rounded-xl text-sm font-medium text-white"
          >
            {t('nav.bookNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, tr, language, toggleLanguage } = useLanguage();
  const { currency, changeCurrency, allCurrencies } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const { resetBooking } = useBooking();
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (prevLocationRef.current !== location.pathname) {
      prevLocationRef.current = location.pathname;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services', also: ['/tour'] },
    { name: t('nav.blog'), path: '/blog' },
    { name: t('nav.ourStory'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  // The static export uses trailing slashes, so compare on the first path segment instead of the full string.
  const current = '/' + (location.pathname.split('/').filter(Boolean)[0] || '');
  const isActive = (path) => {
    const link = navLinks.find((l) => l.path === path);
    return current === path || (link?.also || []).includes(current);
  };

  const navbarProps = { isMenuOpen, setIsMenuOpen, navLinks, isActive, t, tr, language, toggleLanguage, currency, changeCurrency, allCurrencies, theme, toggleTheme };

  return (
    <>
      <motion.nav
        animate={{ y: isScrolled ? -150 : 0, opacity: isScrolled ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 bg-transparent ${isScrolled ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <NavbarContent {...navbarProps} isPill={false} />
      </motion.nav>

      <motion.nav
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: isScrolled ? 0 : 150, opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`fixed top-4 left-0 right-0 z-40 flex justify-center ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="w-[92%] max-w-6xl rounded-2xl bg-white/95 dark:bg-dark-green-950/95 shadow-lg border border-gray-200 dark:border-dark-green-800">
          <NavbarContent {...navbarProps} isPill />
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white dark:bg-dark-green-950 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-green-800 overflow-hidden">
                <div className="p-2 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive(link.path) ? 'bg-[#1a4d3e]/5 dark:bg-[#4ade80]/10 text-[#1a4d3e] dark:text-[#4ade80]' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-green-900'
                      }`}
                    >
                      {link.name}
                      {isActive(link.path) && <span className="w-1.5 h-1.5 rounded-full bg-[#c4935f]" />}
                    </Link>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-dark-green-900/50 border-t border-gray-100 dark:border-dark-green-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleTheme}
                      aria-label={tr('Ganti tema', 'Toggle theme')}
                      className="p-2 bg-white dark:bg-dark-green-900 border border-gray-200 dark:border-dark-green-700 rounded-lg text-gray-600 dark:text-gray-300"
                    >
                      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <LanguageSwitch language={language} toggleLanguage={toggleLanguage} tr={tr} variant="light" />
                    <div className="flex-1 flex items-center gap-1.5 bg-white dark:bg-dark-green-900 border border-gray-200 dark:border-dark-green-700 pl-2.5 pr-2 rounded-lg">
                      <CurrencyIcon className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
                      <select
                        value={currency.code}
                        onChange={(e) => changeCurrency(e.target.value)}
                        aria-label={tr('Mata uang', 'Currency')}
                        className="flex-1 appearance-none bg-transparent py-2 text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none text-center"
                      >
                        {allCurrencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                    </div>
                  </div>

                  <Link to="/booking"
                    onClick={() => {
                      setIsMenuOpen(false);
                      resetBooking();
                    }}
                    className="btn-3d btn-3d-bronze block w-full py-3 text-white rounded-xl text-center text-sm font-medium"
                  >
                    {t('nav.bookNow')}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
