'use client'

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDatabase, faHistory, faExclamationTriangle, faLock } from '@fortawesome/free-solid-svg-icons';

const CONFIRMATION_TEXT = 'Delete my NTF account';

const DeleteDataPage = () => {
  const mainRef = useRef(null);
  const heroRef = useRef(null);
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Please enter your password to continue');
      return;
    }

    if (confirmationText !== CONFIRMATION_TEXT) {
      setError(`Please type "${CONFIRMATION_TEXT}" to confirm deletion`);
      return;
    }

    try {
      setIsDeleting(true);
      setError('');

      // TODO: Replace with actual API call
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      // Redirect to confirmation page after successful deletion
      window.location.href = '/account-deleted';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to delete account. Please check your password and try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    // Parallax effect for the background image
    gsap.to('.parallax-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-bg',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
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
          <div 
            className="parallax-bg absolute top-0 left-0 w-full h-[50vh] -z-10"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/117729/pexels-photo-117729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          />
          <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-zinc-950 -z-10" />
          
          <div className="flex items-center justify-between relative z-10">
            <img src="/assets/images/main_logo.png" alt="Logo" className="w-[250px]" />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded">
              Get app
            </button>
          </div>
          </motion.div>

          <div className="mt-16 max-w-3xl reveal-section">
            <h1 className="text-6xl font-bold text-white mb-6">
              Delete Your Account
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
              We&apos;re sorry to see you go. Before proceeding with account deletion, please review the important information below about what data will be removed and what will be retained.
            </p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 privacy-cards-container">
              {[
                { icon: faTrash, title: 'Permanent', text: 'Account deletion cannot be undone' },
                { icon: faDatabase, title: 'Complete', text: 'All personal data will be removed' },
                { icon: faHistory, title: 'Immediate', text: 'Process starts right away' },
                { icon: faLock, title: 'Secure', text: 'Secure deletion process' },
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
              <h2 className="text-2xl font-bold text-orange-500 mb-8">Important: Before You Delete</h2>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-amber-500 mr-3" />
                  Warning
                </h3>
                <p className="mt-3 text-zinc-300">
                  Account deletion is permanent and cannot be undone. All your personal data, preferences, and history will be permanently removed from our systems.
                </p>
              </div>
            </div>

            {/* Introduction Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Deletion Process</h3>
              <div className="space-y-4 text-zinc-300">
                <p>
                  The account deletion process will begin immediately after confirmation. Please ensure you have:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Downloaded any data you wish to keep</li>
                  <li>Completed any pending transactions</li>
                  <li>Cancelled any active subscriptions</li>
                  <li>Removed any linked payment methods</li>
                </ul>
              </div>
            </div>

            {/* Data Collection Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Data Deletion Details</h3>
              <div className="space-y-6 text-zinc-300">
                <p>
                  When you delete your account, we will remove all personal information associated with your account in accordance with our data retention policies and applicable laws.
                </p>
                
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                  <p className="text-white mb-4">The following data will be permanently deleted:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Profile information and preferences</li>
                    <li>Account credentials and security settings</li>
                    <li>Transaction and payment history</li>
                    <li>Saved locations and routes</li>
                    <li>Connected devices and app settings</li>
                  </ul>
                </div>

                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <p className="text-white mb-4">Some information will be retained as required by law:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Transaction records (7 years for tax purposes)</li>
                    <li>Legal communications and disputes</li>
                    <li>Compliance and regulatory records</li>
                    <li>Anonymized usage statistics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Use of Information Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Confirm Deletion</h3>
              <div className="space-y-6">
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
                  <p className="text-zinc-300 mb-6">To proceed with account deletion, please enter your password and click the button below.</p>
                  
                  <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <input 
                          type="password" 
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors duration-300"
                        />
                      </div>
                      
                      <div>
                        <input 
                          type="text" 
                          placeholder={`Type "${CONFIRMATION_TEXT}" to confirm`}
                          value={confirmationText}
                          onChange={(e) => {
                            setConfirmationText(e.target.value);
                            setError('');
                          }}
                          className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors duration-300"
                        />
                      </div>
                      
                      {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className={`w-full ${isDeleting ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center ${isDeleting ? 'cursor-not-allowed opacity-80' : ''}`}
                    >
                      {isDeleting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Permanently Delete Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Need More Help?</h3>
              <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 border-l-4 border-amber-500 shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] hover:border-amber-400">
                <p className="text-zinc-300">
                  If you&apos;re experiencing any issues or have questions about the account deletion process, our support team is here to help. Contact us at{' '}
                  <a href="mailto:support@needtofuel.com" className="text-amber-500 hover:text-amber-400 transition-colors duration-300">
                    support@needtofuel.com
                  </a>
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="reveal-section">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Alternative Options</h3>
              <div className="bg-zinc-800 rounded-lg p-6 border-orange-600 border">
                <h4 className="text-white font-medium mb-4">Before You Go</h4>
                <p className="text-zinc-300 mb-4">
                  Consider these alternatives if you&apos;re having specific issues:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                  <li>Contact support for account-related issues</li>
                  <li>Update your privacy settings</li>
                  <li>Temporarily deactivate your account</li>
                  <li>Review our FAQ section</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteDataPage;