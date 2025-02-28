'use client'

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faUserLock, faFileContract, faCookieBite } from '@fortawesome/free-solid-svg-icons';

const PrivacyPage = () => {
  const mainRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section parallax effect
    gsap.to(heroRef.current, {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Sections reveal animation
    const sections = gsap.utils.toArray('.reveal-section');
    sections.forEach((section:any) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Cards stagger animation
    gsap.from('.privacy-card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.privacy-cards-container',
        start: 'top 70%',
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-black" ref={mainRef}>
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative min-h-[60vh] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(/assets/images/hero-bg.jpg)'
        }}
      >
        <div className="absolute top-0 left-0 w-full p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.img 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              src="/assets/images/main_logo.png" 
              alt="Logo" 
              className="w-[250px]" 
            />
            <motion.button 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
            >
              Get app
            </motion.button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl"
          >
          <div className="flex items-center justify-between">
            <img src="/assets/images/main_logo.png" alt="Logo" className="w-[250px]" />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded">
              Get app
            </button>
          </div>
          </motion.div>

          <div className="mt-16 max-w-3xl reveal-section">
            <h1 className="text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
              Your privacy is our priority. We're committed to protecting your personal information with the highest standards of security and transparency.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 privacy-cards-container">
              {[
                { icon: faShieldAlt, title: 'Secure', text: 'Enterprise-grade security' },
                { icon: faUserLock, title: 'Private', text: 'Your data belongs to you' },
                { icon: faFileContract, title: 'Compliant', text: 'POPIA compliant' },
                { icon: faCookieBite, title: 'Transparent', text: 'Clear cookie policy' },
              ].map((card, index) => (
                <div key={index} className="privacy-card bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-6 rounded-xl">
                  <FontAwesomeIcon icon={card.icon} className="text-amber-500 text-3xl mb-4" />
                  <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
                  <p className="text-zinc-400">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-2xl"></div>
          <div className="p-8 space-y-12">
            {/* Cookie Policy Section */}
            <div className="reveal-section">
              <h2 className="text-2xl font-bold text-orange-500 mb-8">Cookies Policy, Privacy Policy and POPIA disclaimer</h2>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                <h3 className="text-xl font-semibold text-white">Cookie policy</h3>
                <p className="mt-3 text-zinc-300">
                  We use cookies to make your experience with us better. By continuing to use our website without changing the settings, you are agreeing to our use of cookies.
                </p>
              </div>
            </div>

            {/* Introduction Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Introduction</h3>
              <div className="space-y-4 text-zinc-300">
                <p>
                  Need to Fuel Proprietary Limited (NtF or we) respects the right to privacy and confidentiality and is committed to protecting your privacy, by ensuring that your personal information is collected and processed properly, lawfully and transparently.
                </p>
                <p>
                  This Privacy Statement serves as a notification to you as required by Section 18 of POPIA, it explains the steps we take to protect personal information we collect and is addressed to you as a customer, business partner and a user of our website or business processes.
                </p>
              </div>
            </div>

            {/* Data Collection Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Data Collection</h3>
              <div className="space-y-6 text-zinc-300">
                <p>
                  When used in this Privacy Policy, the term &quot;personal information&quot; has the meaning given to it in the POPIA. Generally speaking, personal information is any information relating to an identifiable, living natural person or an existing juristic person.
                </p>
                
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                  <p className="text-white mb-4">We will collect your personal information in a number of ways, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>directly from you (where it is practicable to do so);</li>
                    <li>from third parties including employers, authorised representatives, agents or third parties who are authorised to share personal information;</li>
                    <li>from third parties who have identified you as someone who may wish to purchase our products or provide services to NtF.</li>
                  </ul>
                </div>

                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <p className="text-white mb-4">Personal information we collect may include:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>contact details and personal information;</li>
                    <li>company and employment information;</li>
                    <li>financial and account information;</li>
                    <li>usage data and preferences;</li>
                    <li>communication records and feedback.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use of Information Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Our Use of Personal Information</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-orange-600">
                  <h4 className="text-white font-medium mb-2">Business Engagements</h4>
                  <p className="text-zinc-300">We use personal information for proposed and actual transactions, supporting our procurement and on-boarding processes.</p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-orange-600">
                  <h4 className="text-white font-medium mb-2">Services and Transactions</h4>
                  <p className="text-zinc-300">We use personal information to deliver services and execute transactions you request.</p>
                </div>
                <div className="bg-zinc-800 p-6 rounded-lg border-l-4 border-orange-600">
                  <h4 className="text-white font-medium mb-2">Website Improvement</h4>
                  <p className="text-zinc-300">We use information to improve our website and customize it to your preferences.</p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Security</h3>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                <p className="text-zinc-300">
                  NtF is committed to protecting the security of personal information. We use various security technologies and procedures to help protect your personal information from unauthorized access, use, or disclosure.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Questions?</h3>
              <p className="text-zinc-300">
                Contact us at{' '}
                <a href="mailto:support@needtofuel.com" className="text-amber-500 hover:text-amber-400 transition-colors duration-300">
                  support@needtofuel.com
                </a>
              </p>
            </div>

            {/* Acceptance Section */}
            <div className="reveal-section">
              <div className="bg-zinc-800 rounded-lg p-6 border-orange-600 border">
                <h3 className="text-xl font-semibold text-orange-500 mb-4">Acceptance</h3>
                <p className="text-zinc-300">
                  By accepting this Privacy Policy, you are deemed to have read, understood, accepted, and agreed to be bound by all of its terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;