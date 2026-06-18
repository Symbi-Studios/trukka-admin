import React from 'react';
import { X } from 'lucide-react';

export default function RevokeAdminModal({ isOpen, onClose, adminName = "This user" }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 relative">
          <div className="pr-8">
            <h2 className="text-xl font-bold text-slate-800">Revoke Admin Access</h2>
            <p className="text-[15px] text-slate-500 mt-1">
              {adminName} will lose all access immediately
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <div className="space-y-2">
            <label className="text-[15px] font-semibold text-slate-800 block">
              Reason
            </label>
            <textarea 
              rows={4}
              placeholder="Logged to audit trail..." 
              className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm placeholder:text-slate-500 transition-all resize-none"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end items-center space-x-3 bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors"
          >
            Revoke access
          </button>
        </div>
        
      </div>
    </div>
  );
}