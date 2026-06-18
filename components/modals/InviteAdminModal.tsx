import React, { useState } from 'react';
import { X } from 'lucide-react';

const roles = [
  {
    id: 'operations',
    title: 'Operations Admin',
    description: 'Can monitor jobs, review documents, manage users, and handle disputes and support conversations'
  },
  {
    id: 'finance',
    title: 'Finance Admin',
    description: 'Can view and manage escrow, hold or release payments, retry failed payouts, and view transaction history.'
  },
  {
    id: 'super',
    title: 'Super Admin',
    description: 'Full access including global settings, commission adjustment, role management, and payment reversal. Assign carefully.',
    badge: 'Full access'
  }
];

export default function InviteAdminModal({ isOpen, onClose }: any) {
  const [selectedRole, setSelectedRole] = useState<string |  null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-2 relative">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Invite new admin</h2>
            <p className="text-sm text-slate-500 mt-1">An invitation link will be sent to their email</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  First name<span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g Amara" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder:text-slate-400 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Last name<span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g Okafor" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Work email<span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                placeholder="name@trukkas.ng" 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm placeholder:text-slate-400 transition-all"
              />
              <p className="text-xs text-slate-500">The invitation link will be sent here. It expires after 48 hours.</p>
            </div>

            {/* Role Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-medium text-slate-700">
                Role<span className="text-red-500">*</span>
              </label>
              
              <div className="space-y-3">
                {roles.map((role) => {
                  const isSelected = selectedRole === role.id;
                  
                  return (
                    <div 
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative flex items-start p-4 cursor-pointer border rounded-xl transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50/30' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Custom Radio Button */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                      </div>
                      
                      {/* Role Info */}
                      <div className="ml-3 flex-1">
                        <span className="block text-sm font-medium text-slate-800">
                          {role.title}
                        </span>
                        <span className="block text-xs text-slate-500 mt-1 leading-relaxed">
                          {role.description}
                        </span>
                        {role.badge && (
                          <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-medium tracking-wide uppercase">
                            {role.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end items-center space-x-3 bg-white">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Send invitation
          </button>
        </div>
        
      </div>
    </div>
  );
}