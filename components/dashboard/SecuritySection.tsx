'use client';

import React from 'react';
import { Lock, Mail, AlertTriangle, Shield, CheckCircle2 } from 'lucide-react';
import zxcvbn from 'zxcvbn';

interface SecuritySectionProps {
  userData: {
    email: string;
  };
  password: string;
  confirmPassword: string;
  passwordStrength: number;
  setPassword: (password: string) => void;
  setPasswordStrength: (strength: number) => void;
  handleConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteAccount: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  userData,
  password,
  confirmPassword,
  passwordStrength,
  setPassword,
  setPasswordStrength,
  handleConfirmPasswordChange,
  onDeleteAccount
}) => {
  // Handle password strength calculation
  const checkPasswordStrength = (pass: string) => {
    const result = zxcvbn(pass);
    setPasswordStrength(result.score);
    setPassword(pass);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-1 rounded-md bg-amber-400/10">
          <Lock className="h-4 w-4 text-amber-400" />
        </div>
        <h2 className="text-sm font-semibold text-white border-b border-gray-800/70 pb-2 flex-1">Account Security</h2>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800 shadow-lg shadow-black/5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
            <div className="p-1 rounded-full bg-gray-800/50">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
            </div>
            Details & Security
          </h3>
          <span className="text-xs px-2 py-1 bg-green-900/30 border border-green-500/20 rounded-full text-green-400 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Secured
          </span>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <Mail className="h-3 w-3 text-gray-400" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="w-full bg-gray-800/30 border border-gray-700/50 rounded-md px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                  value={userData.email}
                  disabled
                  readOnly
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded-full">Verified</div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 italic flex items-center gap-1">
                <Mail className="h-3 w-3 inline" />
                Contact support to change your email address
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-300 flex items-center gap-1">
                <Lock className="h-3 w-3 text-gray-400" />
                Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => checkPasswordStrength(e.target.value)}
              />
              <div className="w-full h-1.5 mt-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    passwordStrength === 0 ? 'w-0 bg-red-500' :
                    passwordStrength === 1 ? 'w-1/4 bg-red-500' :
                    passwordStrength === 2 ? 'w-2/4 bg-yellow-500' :
                    passwordStrength === 3 ? 'w-3/4 bg-green-500' :
                    'w-full bg-green-400'
                  }`}
                />
              </div>
              <p className="text-[10px] text-gray-500">
                Password strength: {
                  passwordStrength === 0 ? 'Very Weak' :
                  passwordStrength === 1 ? 'Weak' :
                  passwordStrength === 2 ? 'Fair' :
                  passwordStrength === 3 ? 'Good' :
                  'Strong'
                }
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 flex items-center gap-1">
              <Lock className="h-3 w-3 text-gray-400" />
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                className={`w-full bg-gray-800/50 border ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 text-sm text-gray-200 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {password && confirmPassword && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-full">
                  {password === confirmPassword ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              )}
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="pt-3 mt-1 border-t border-gray-800/50">
            <h4 className="text-xs font-medium text-gray-300 mb-2">Account Protection</h4>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-800/30 rounded-md border border-gray-700/30">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-gray-300">Two-factor authentication</span>
              </div>
              <div className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs font-medium rounded cursor-pointer hover:bg-amber-600/30 transition-colors">Enable</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-5 border border-gray-800 shadow-lg shadow-black/5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2">
            <div className="p-1 rounded-full bg-red-600/10">
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            </div>
            Delete Data & Account
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full border border-red-500/20">Danger Zone</span>
        </div>
        <div className="p-3 bg-red-900/10 rounded-md border border-red-500/10 mb-4">
          <p className="text-xs text-gray-300 mb-1">
            This action cannot be undone. Please be certain.
          </p>
          <p className="text-xs text-red-300/70">
            All your data will be permanently removed, including billing information and usage history.
          </p>
        </div>
        <div 
          onClick={onDeleteAccount}
          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer border border-red-500/20"
        >
          Delete Account
        </div>
      </div>
    </div>
  );
}; 