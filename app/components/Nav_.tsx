'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { 
  faBars,
  faXmark,
  faUser,
  faSignInAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavProps {
  user: User | null;
}

const navLinks = [
  { name: 'Home', href: '/', scrollTo: 'top' },
  { name: 'Services', href: '/#services', scrollTo: 'services_section' },
  { name: 'Case Studies', href: '/#case-studies', scrollTo: 'case_studies_section' },
  { name: 'Pricing', href: '/#pricing', scrollTo: 'pricing_section' },
];

const Nav_ = ({ user }: NavProps) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Check if we've scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Handle clicks outside of mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle keyboard accessibility
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Check if a nav link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full h-[70px] fixed top-0 left-0 flex justify-between items-center z-50 px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer group">
            <img 
              className="w-[50px] h-[50px] object-contain transition-transform duration-300 group-hover:scale-105" 
              src="/assets/images/white_logo.png" 
              alt="Need To Fuel Logo" 
            />
            <span className="text-white font-medium text-lg hidden md:block group-hover:text-amber-500 transition-colors duration-300">Need To Fuel</span>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative flex flex-col items-center">
              <a 
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.scrollTo);
                }}
                className={`text-sm font-medium transition-all duration-300 cursor-pointer ${
                  isActiveLink(link.href) 
                    ? 'text-amber-500' 
                    : 'text-white/70 hover:text-amber-500'
                }`}
                aria-current={isActiveLink(link.href) ? 'page' : undefined}
              >
                {link.name}
              </a>
              {isActiveLink(link.href) && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-1 w-1/2 h-[2px] bg-amber-500 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Auth and action buttons */}
        <div className="flex items-center space-x-3">
          {/* Auth button - Sign In or User Profile based on authentication status */}
          {user ? (
            <Link href="/dash">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-all duration-300 cursor-pointer">
                <FontAwesomeIcon icon={faUser} className="text-amber-500 h-4 w-4" />
                <span className="text-white text-sm font-medium truncate max-w-[100px]">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/auth">
              <span className="flex items-center space-x-1 text-white bg-amber-500/20 hover:bg-amber-500/30 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300">
                <FontAwesomeIcon icon={faSignInAlt} className="h-3.5 w-3.5 mr-1" />
                Sign in
              </span>
            </Link>
          )}

          {/* Get app button */}
          <button
            onClick={() => {
              window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30")
            }}
            className="hidden sm:flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full text-sm font-medium text-black transition-all duration-300 transform hover:scale-105"
          >
            Get app
          </button>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <FontAwesomeIcon 
              icon={mobileMenuOpen ? faXmark : faBars} 
              className="text-white h-5 w-5" 
            />
          </button>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[70px] left-0 w-full bg-black/95 backdrop-blur-md z-40 overflow-hidden border-t border-white/10"
          >
            <div className="flex flex-col p-6 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.scrollTo);
                  }}
                  className={`text-lg font-medium transition-all duration-300 block ${
                    isActiveLink(link.href) 
                      ? 'text-amber-500' 
                      : 'text-white/80 hover:text-amber-500'
                  }`}
                  aria-current={isActiveLink(link.href) ? 'page' : undefined}
                >
                  <div className="flex items-center space-x-2">
                    {isActiveLink(link.href) && (
                      <motion.div className="w-1 h-5 bg-amber-500 rounded-full" layoutId="mobileNavIndicator" />
                    )}
                    <span>{link.name}</span>
                  </div>
                </a>
              ))}
              
              {/* Add auth option to mobile menu */}
              {!user ? (
                <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2 text-amber-500 font-medium">
                    <FontAwesomeIcon icon={faSignInAlt} className="h-4 w-4" />
                    <span>Sign in</span>
                  </div>
                </Link>
              ) : (
                <Link href="/dash" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center space-x-2 text-amber-500 font-medium">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>
              )}
              
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 px-4 py-3 rounded-xl text-base font-medium text-black transition-all duration-300 transform hover:scale-105"
                >
                  Get app
                </button>
              </div>
              
              {/* Social links */}
              <div className="flex justify-center space-x-6 pt-2">
                <a href="#" aria-label="Facebook">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer transform hover:scale-110"
                  />
                </a>
                <a href="#" aria-label="Twitter">
                  <FontAwesomeIcon
                    icon={faTwitter}
                    className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer transform hover:scale-110"
                  />
                </a>
                <a href="#" aria-label="Instagram">
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer transform hover:scale-110"
                  />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav_;
