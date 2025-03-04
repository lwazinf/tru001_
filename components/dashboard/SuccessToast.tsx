'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessToastProps {
  message: string;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <div className="fixed top-4 right-4 bg-green-900/80 backdrop-blur-sm border border-green-500/20 rounded-lg px-4 py-3 shadow-lg shadow-green-900/20 transition-all duration-300 flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-5">
      <CheckCircle2 className="h-4 w-4 text-green-400" />
      <p className="text-sm text-green-200">{message}</p>
    </div>
  );
}; 