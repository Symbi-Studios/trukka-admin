'use client'

import  { useState } from 'react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';

import { InboxTab } from './InboxTab';
import { BroadcastTab } from './BroadcastTab';
import { TemplatesTab } from './TemplatesTab';

const KPICards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Open Threads</p>
      <h3 className="text-3xl font-bold text-blue-600 mb-1">6</h3>
      <p className="text-xs font-bold text-slate-800">Need response</p>
    </div>
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resolved Today</p>
      <h3 className="text-3xl font-bold text-emerald-500 mb-1">14</h3>
    </div>
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Response Time</p>
      <h3 className="text-3xl font-bold text-slate-800 mb-1">1.4h</h3>
    </div>
  </div>
);

type TabType = 'Inbox' | 'Broadcast' | 'Templates';

const SupportClient = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Inbox');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <HeaderMenu title="Support" label="Support" />
      
      <div className="p-6 mx-auto">
        <KPICards />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          {(['Inbox', 'Broadcast', 'Templates'] as TabType[]).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-slate-400 border-b-2 border-transparent hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Render Active Tab */}
        {activeTab === 'Inbox' && <InboxTab />}
        {activeTab === 'Broadcast' && <BroadcastTab />}
        {activeTab === 'Templates' && <TemplatesTab />}
        
      </div>
    </div>
  );
};

export default SupportClient;