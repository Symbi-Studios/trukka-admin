'use client'

import React, { useState } from 'react';
import { Filter, Download, Bell, Plus, Check, Minus } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import InviteAdminModal from '@/components/modals/InviteAdminModal';
import RevokeAdminModal from '@/components/modals/RevokeAdminModal';
import EditRoleModal from '@/components/modals/EditRoleModal';

const users = [
  {
    initials: 'SA',
    name: 'Sarah Adeyemi',
    email: 'sarah@trukkas.ng',
    role: 'Super Admin',
    roleColor: 'bg-indigo-100 text-indigo-700',
    avatarColor: 'bg-blue-600',
    lastActive: 'Now',
    logs: '1251',
    status: 'Active',
    primaryAction: 'Edit role',
  },
  {
    initials: 'KA',
    name: 'Kemi Abiodun',
    email: 'kemi@trukkas.ng',
    role: 'Operations Admin',
    roleColor: 'bg-emerald-100 text-emerald-700',
    avatarColor: 'bg-blue-600',
    lastActive: '3h ago',
    logs: '343',
    status: 'Active',
    primaryAction: 'Edit role',
    secondaryAction: 'Revoke',
  },
  {
    initials: 'EO',
    name: 'Emeka Obi',
    email: 'emeka@trukkas.ng',
    role: 'Finance Admin',
    roleColor: 'bg-amber-100 text-amber-700',
    avatarColor: 'bg-blue-600',
    lastActive: 'Yesterday',
    logs: '27',
    status: 'Active',
    primaryAction: 'Edit role',
    secondaryAction: 'Revoke',
  },
];

const permissions = [
  { capability: 'Marketplace overview', super: true, ops: true, finance: false },
  { capability: 'Live map tracking', super: true, ops: true, finance: false },
  { capability: 'Analytics dashboards', super: true, ops: true, finance: false },
  { capability: 'Dispute resolution', super: true, ops: 'Limited', finance: false },
  { capability: 'Support & safety', super: true, ops: true, finance: false },
  { capability: 'Payment hold / release', super: true, ops: false, finance: true },
  { capability: 'Commission adjustment', super: true, ops: false, finance: false },
  { capability: 'Pricing & rate config', super: true, ops: false, finance: false },
  { capability: 'Global settings', super: true, ops: false, finance: false },
  { capability: 'Role assignment', super: true, ops: false, finance: false },
  { capability: 'Bulk user actions', super: true, ops: true, finance: false },
];

export default function RolesAndAccessControls() {
  const [userToRevoke, setUserToRevoke] = useState<any>(null);
  const [userToEditRole, setUserToEditRole] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  return (
    <div>
      {/* Header */}
      <HeaderMenu title='Roles & Access Controls' label='Roles' />
      
      <div className='p-5'>
         {/* Create Admin Button */}
        <div className="flex justify-end mb-4">
            <button
                onClick={() => setIsInviteModalOpen(true)} 
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            <span>Create admin user</span>
            </button>
        </div>

        {/* Admin Users Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold">Admin users</h2>
            <span className="text-sm text-slate-500">3 active</span>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Last Active</th>
                    <th className="px-6 py-3 font-medium">Actions Logged</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user: any, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                        <div className={`h-8 w-8 ${user.avatarColor} text-white rounded-md flex items-center justify-center font-medium text-xs`}>
                        {user.initials}
                        </div>
                        <span className="font-medium text-slate-700">{user.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.roleColor}`}>
                        {user.role}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.lastActive}</td>
                    <td className="px-6 py-4">
                        <a href="#" className="text-blue-600 font-medium hover:underline">{user.logs}</a>
                    </td>
                    <td className="px-6 py-4">
                        <span className="flex items-center text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full w-max">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                        {user.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                        <button 
                            onClick={() => setUserToEditRole(user)}
                            className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded text-xs font-medium hover:bg-slate-50"
                        >
                            {user.primaryAction}
                        </button>
                        {user.secondaryAction && (
                        <button 
                            onClick={() => setUserToRevoke(user)}
                            className="px-3 py-1.5 border border-red-200 text-red-600 rounded text-xs font-medium hover:bg-red-50 ml-2"
                        >
                            {user.secondaryAction}
                        </button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Permission Matrix Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold">Permission Matrix</h2>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                <tr>
                    <th className="px-6 py-3 font-medium">Capability</th>
                    <th className="px-6 py-3 font-medium">Super Admin</th>
                    <th className="px-6 py-3 font-medium">Operations Admin</th>
                    <th className="px-6 py-3 font-medium">Finance Admin</th>
                </tr>
                </thead>
                <tbody>
                {permissions.map((perm, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-medium text-slate-700">{perm.capability}</td>
                    <td className="px-6 py-3.5">
                        {perm.super ? <Check size={18} className="text-emerald-500" /> : <Minus size={18} className="text-slate-300" />}
                    </td>
                    <td className="px-6 py-3.5">
                        {typeof perm.ops === 'string' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            {perm.ops}
                        </span>
                        ) : perm.ops ? (
                        <Check size={18} className="text-emerald-500" />
                        ) : (
                        <Minus size={18} className="text-slate-300" />
                        )}
                    </td>
                    <td className="px-6 py-3.5">
                        {perm.finance ? <Check size={18} className="text-emerald-500" /> : <Minus size={18} className="text-slate-300" />}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
      </div>

     {/* Modals */}
     <InviteAdminModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
     />
     <RevokeAdminModal 
        isOpen={!!userToRevoke}
        onClose={() => setUserToRevoke(null)}
        adminName={userToRevoke?.name}
     />
     <EditRoleModal
        isOpen={!!userToEditRole}
        onClose={() => setUserToEditRole(null)}
        user={userToEditRole}
     />
    </div>
  );
}