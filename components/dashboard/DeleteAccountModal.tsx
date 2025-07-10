'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteAccountModalProps {
  deleteConfirmation: string;
  setDeleteConfirmation: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-gray-950/90 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800 w-full max-w-md mx-4 shadow-2xl shadow-black/40 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-10">
        <div
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
        >
          <X className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-full bg-red-600/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-200">Delete Account</h3>
          </div>
          <p className="text-xs text-gray-400">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800">
            <p className="text-xs text-red-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              To confirm, please type &quot;delete&quot; in the field below.
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-200 placeholder-gray-400 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors duration-150"
              placeholder='Type "delete" to confirm'
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <div
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-md text-xs font-medium text-gray-300 transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </div>
            <div
              onClick={onConfirm}
              className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer border border-red-500/20"
            >
              Delete Account
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 