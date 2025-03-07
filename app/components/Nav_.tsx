'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faBars, faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NavProps {
  user: User | null;
}

const Nav_ = ({ user }: NavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <>
      {/* Main navigation */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full h-[70px] fixed top-0 left-0 flex justify-between items-center z-50 px-4 md:px-8 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <img 
              className="w-[50px] h-[50px] object-contain" 
              src="/assets/images/white_logo.png" 
              alt="Need To Fuel Logo" 
            />
            <span className="text-white font-medium text-lg hidden md:block">Need To Fuel</span>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-white/70 hover:text-amber-500 text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('services_section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/70 hover:text-amber-500 text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            Services
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('case_studies_section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/70 hover:text-amber-500 text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            Case Studies
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('pricing_section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/70 hover:text-amber-500 text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            Pricing
          </a>
        </div>

        {/* Auth and action buttons */}
        <div className="flex items-center space-x-3">
          {/* User status or auth button */}
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
              <span className="text-white bg-amber-500/20 hover:bg-amber-500/30 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300">
                Sign in
              </span>
            </Link>
          )}

          {/* Get app button */}
          <button
            onClick={() => {
              window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30")
            }}
            className="hidden sm:flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full text-sm font-medium text-black transition-all duration-300"
          >
            Get app
          </button>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[70px] left-0 w-full bg-black/95 backdrop-blur-md z-40 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-6">
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-white/80 hover:text-amber-500 text-lg font-medium transition-all duration-300 block"
              >
                Home
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('services_section')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-white/80 hover:text-amber-500 text-lg font-medium transition-all duration-300 block"
              >
                Services
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('case_studies_section')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-white/80 hover:text-amber-500 text-lg font-medium transition-all duration-300 block"
              >
                Case Studies
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('pricing_section')?.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="text-white/80 hover:text-amber-500 text-lg font-medium transition-all duration-300 block"
              >
                Pricing
              </a>
              
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    window.open("https://firebasestorage.googleapis.com/v0/b/tru001-c96b3.firebasestorage.app/o/app-release.apk?alt=media&token=c4885d23-b5c4-4ff7-b438-eca7cff59a30");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center bg-amber-500 hover:bg-amber-600 px-4 py-3 rounded-xl text-base font-medium text-black transition-all duration-300"
                >
                  Get app
                </button>
              </div>
              
              {/* Social links */}
              <div className="flex justify-center space-x-6 pt-2">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer"
                />
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="h-5 w-5 text-white/60 hover:text-amber-500 transition-all duration-300 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav_;
