'use client'

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DeleteAccountPage = () => {
  const mainRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
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
  }, []);

  return (
    <div className="min-h-screen bg-black" ref={mainRef}>
      {/* Hero Section */}
      <div className="bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
          <img src="/assets/images/main_logo.png" alt="Logo" className="w-[250px]" />
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded">
              Get app
            </button>
          </div>
          <div className="mt-16 max-w-3xl reveal-section">
            <h1 className="text-5xl font-bold text-white">
              Account Deletion Request
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              Follow these steps to request the deletion of your Need To Fuel account and associated data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
          <div className="p-8 space-y-12">
            {/* Deletion Process Section */}
            <div className="reveal-section">
              <h2 className="text-2xl font-bold text-orange-500 mb-8">How to Delete Your Account</h2>
              <div className="space-y-6">
                <div className="bg-zinc-800 rounded-lg p-6 border-l-4 border-orange-600">
                  <h3 className="text-xl font-semibold text-white mb-4">Option 1: Delete Through the App</h3>
                  <ol className="list-decimal pl-6 space-y-4 text-zinc-300">
                    <li>Open the Need To Fuel app</li>
                    <li>Go to Settings</li>
                    <li>Select Account Management</li>
                    <li>Choose &quot;Delete Account&quot;</li>
                    <li>Follow the confirmation steps</li>
                  </ol>
                </div>

                <div className="bg-zinc-800 rounded-lg p-6 border-l-4 border-orange-600">
                  <h3 className="text-xl font-semibold text-white mb-4">Option 2: Email Request</h3>
                  <div className="space-y-4 text-zinc-300">
                    <p>Send an email to <a href="mailto:support@needtofuel.com" className="text-orange-500 hover:text-orange-400">support@needtofuel.com</a> with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Subject line: &quot;Account Deletion Request&quot;</li>
                      <li>Your registered email address</li>
                      <li>Phone number associated with the account</li>
                      <li>Reason for deletion (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Handling Section */}
            <div className="reveal-section">
              <h2 className="text-2xl font-bold text-orange-500 mb-8">Data Handling Information</h2>
              
              <div className="space-y-6">
                <div className="bg-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Data That Will Be Deleted</h3>
                  <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                    <li>Personal profile information</li>
                    <li>Account credentials</li>
                    <li>Vehicle information</li>
                    <li>Transaction history</li>
                    <li>Payment information</li>
                    <li>App settings and preferences</li>
                    <li>Location history</li>
                  </ul>
                </div>

                <div className="bg-zinc-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Data That Will Be Retained</h3>
                  <div className="space-y-4 text-zinc-300">
                    <p>The following data will be retained for legal and business purposes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Transaction records (retained for 7 years as per legal requirements)</li>
                      <li>Service usage logs (retained for 90 days)</li>
                      <li>Aggregated analytics data (anonymized)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Time Section */}
            <div className="reveal-section">
              <div className="bg-zinc-800 rounded-lg p-6 border-l-4 border-orange-600">
                <h3 className="text-xl font-semibold text-orange-500 mb-4">Processing Time</h3>
                <div className="space-y-4 text-zinc-300">
                  <p>Account deletion requests are typically processed within:</p>
                  <ul className="list-disc pl-6">
                    <li>App deletion: Immediate processing</li>
                    <li>Email requests: 2-3 business days</li>
                  </ul>
                  <p>You will receive a confirmation email once your account has been deleted.</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="reveal-section">
              <div className="bg-zinc-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-orange-500 mb-4">Important Notes</h3>
                <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                  <li>Account deletion is permanent and cannot be undone</li>
                  <li>Any unused credits or rewards will be forfeited</li>
                  <li>Active subscriptions should be cancelled before account deletion</li>
                  <li>Deletion requests cannot be processed if you have pending transactions</li>
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="reveal-section">
              <div className="bg-zinc-800 rounded-lg p-6 border border-orange-600">
                <h3 className="text-xl font-semibold text-orange-500 mb-4">Need Help?</h3>
                <p className="text-zinc-300">
                  If you have any questions about the account deletion process, please contact our support team at{' '}
                  <a href="mailto:support@needtofuel.com" className="text-orange-500 hover:text-orange-400">
                    support@needtofuel.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DeleteAccountPage;