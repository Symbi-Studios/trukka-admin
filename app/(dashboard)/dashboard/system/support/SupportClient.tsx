'use client'

import  { Suspense, useState } from 'react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';

import { InboxTab } from './InboxTab';
import { BroadcastTab } from './BroadcastTab';
import { TemplatesTab } from './TemplatesTab';
import { KPICards } from './KPICards';
import { Loader2 } from 'lucide-react';


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
        {activeTab === 'Inbox' && (
          <Suspense fallback={
            <div className="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-280px)] min-h-[600px] items-center justify-center">
              <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            </div>
          }>
            <InboxTab />
          </Suspense>
        )}
        {activeTab === 'Broadcast' && <BroadcastTab />}
        {activeTab === 'Templates' && <TemplatesTab />}
        
      </div>
    </div>
  );
};

export default SupportClient;