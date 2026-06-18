import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const roles = [
  {
    id: 'Operations Admin',
    title: 'Operations Admin',
    description: 'Can monitor jobs, review documents, manage users, and handle disputes and support conversations'
  },
  {
    id: 'Finance Admin',
    title: 'Finance Admin',
    description: 'Can view and manage escrow, hold or release payments, retry failed payouts, and view transaction history.'
  },
  {
    id: 'Super Admin',
    title: 'Super Admin',
    description: 'Full access including global settings, commission adjustment, role management, and payment reversal. Assign carefully.',
    badge: 'Full access'
  }
];

export default function EditRoleModal({ isOpen, onClose, user }: any) {
  const [selectedRole, setSelectedRole] = useState(null);

  // Reset selection when modal opens/closes or user changes
  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    } else {
      setSelectedRole(null);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 relative">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Change role: {user.name}</h2>
            <p className="text-[15px] text-slate-500 mt-1">{user.email}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Current Role Box */}
          <div className="bg-slate-100 rounded-xl p-4 mb-6">
            <p className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1">
              Current Role
            </p>
            <p className="font-semibold text-slate-800">
              {user.role}
            </p>
          </div>

          <form className="space-y-3">
            <label className="text-[15px] font-bold text-slate-800 block mb-3">
              New role<span className="text-red-500">*</span>
            </label>
            
            <div className="space-y-3">
              {roles.map((role: any) => {
                const isSelected = selectedRole === role.id;
                
                return (
                  <div 
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative flex items-start p-4 cursor-pointer border rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/50' 
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
                      <span className="block text-sm font-semibold text-slate-800">
                        {role.title}
                      </span>
                      <span className="block text-[13px] text-slate-500 mt-1 leading-relaxed">
                        {role.description}
                      </span>
                      {role.badge && (
                        <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wide uppercase">
                          {role.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </form>
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
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Save role change
          </button>
        </div>
        
      </div>
    </div>
  );
}