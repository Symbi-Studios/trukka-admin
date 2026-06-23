'use client'

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';

// --- Types ---
type RoleType = 'Super Admin' | 'Operations' | 'Finance';
type ResultType = 'Success' | 'Failed';

interface Entity {
  name: string;
  isLink: boolean;
}

interface AuditLog {
  id: string;
  time: string;
  admin: string;
  role: RoleType;
  action: string;
  entity: Entity;
  result: ResultType;
}

// --- Mock Data ---
const auditLogs: AuditLog[] = [
  {
    id: '1',
    time: 'Mar 14 14:22',
    admin: 'Deborah C.',
    role: 'Super Admin',
    action: 'Released payment',
    entity: { name: '#TX-9201', isLink: true },
    result: 'Success',
  },
  {
    id: '2',
    time: 'Mar 14 14:22',
    admin: 'Kemi A.',
    role: 'Operations',
    action: 'Flagged user',
    entity: { name: 'Taiwo Ogunleye', isLink: false },
    result: 'Success',
  },
  {
    id: '3',
    time: 'Mar 14 14:22',
    admin: 'Tunde O.',
    role: 'Finance',
    action: 'Released payment',
    entity: { name: '#TX-9195', isLink: true },
    result: 'Success',
  },
  {
    id: '4',
    time: 'Mar 14 14:22',
    admin: 'Deborah C.',
    role: 'Super Admin',
    action: 'Adjusted commission 10% → 12%',
    entity: { name: 'Tin Can Zone', isLink: false },
    result: 'Success',
  },
];

const filterOptions = ['All', 'Super Admin', 'Operations', 'Finance'];

export default function AuditLogsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Helper function to assign role badge colors
  const getRoleBadgeClasses = (role: RoleType) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-indigo-100 text-indigo-700';
      case 'Operations':
        return 'bg-emerald-100 text-emerald-700';
      case 'Finance':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div>
      {/* Header */}
      <HeaderMenu title="Audit Logs" label="Audit" />

      <div className="p-5">
        
        {/* Toolbar: Search, Filters, Export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Filters & Search */}
          <div className='my-5 flex items-center gap-4 flex-1'>
            <div className='flex bg-white p-2 gap-2 border border-[#BDBDBD] rounded-lg flex-[30%] focus-within:border-[#0241E8] transition-colors'>
                <Search color='#BDBDBD' size={20} />
                <input type="text" placeholder='Search...' className='flex-1 focus:outline-none text-sm' />
            </div>
            <div className='flex items-center gap-3 flex-[70%] overflow-x-auto no-scrollbar'>
                <div className='flex items-center gap-3 whitespace-nowrap'>
                {filterOptions.map(f => (
                    <div key={f} onClick={() => setActiveFilter(f)}
                    className={`border cursor-pointer h-8 px-4 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                        activeFilter === f ? 'text-white bg-[#0241E8] border-[#0241E8]' : 'text-[#4F4F4F] bg-white border-[#BDBDBD] hover:bg-gray-50'
                    }`}>{f}</div>
                ))}
                </div>
            </div>
          </div>

          {/* Export Button */}
          <button className="px-4 py-2 border border-[#616161] rounded-lg text-sm font-semibold text-[#616161] hover:bg-slate-50 transition-colors">
            Export
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50/80">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Time */}
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {log.time}
                    </td>
                    
                    {/* Admin */}
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {log.admin}
                    </td>
                    
                    {/* Role Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getRoleBadgeClasses(log.role)}`}>
                        {log.role}
                      </span>
                    </td>
                    
                    {/* Action */}
                    <td className="px-6 py-4 text-slate-600">
                      {log.action}
                    </td>
                    
                    {/* Entity */}
                    <td className="px-6 py-4">
                      {log.entity.isLink ? (
                        <a href="#" className="text-blue-600 font-semibold hover:underline">
                          {log.entity.name}
                        </a>
                      ) : (
                        <span className="text-slate-600">{log.entity.name}</span>
                      )}
                    </td>
                    
                    {/* Result Badge */}
                    <td className="px-6 py-4">
                      {log.result === 'Success' && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                          Success
                        </span>
                      )}
                    </td>

                    {/* Note */}
                    <td className="px-6 py-4 text-slate-600">
                      -
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State (Optional: If no results match search/filter) */}
          {auditLogs.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No audit logs found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}