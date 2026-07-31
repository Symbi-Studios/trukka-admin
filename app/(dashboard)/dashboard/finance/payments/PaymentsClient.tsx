'use client'

import React, { useState } from 'react';
import { Search, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// --- DUMMY DATA ---

const ledgerData = [
  { id: '1', ref: '#REF-9282', jobId: '#JB-2836', partyName: 'Adaeze Obi', partyEmail: 'adaezeobi@gmail.com', initials: 'AO', type: 'Escrow in', amount: '₦480,000', date: 'May 14 2026 10:40 am', direction: 'Inflow' },
  { id: '2', ref: '#REF-9282', jobId: '#JB-2841', partyName: 'Kingsley Okafor', partyEmail: 'kingsleyokafor@gmail.com', initials: 'KO', type: 'Payout', amount: '₦432,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
  { id: '3', ref: '#REF-9282', jobId: '-', partyName: 'Platform', partyEmail: '', initials: 'P', type: 'Commission', amount: '₦48,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
  { id: '4', ref: '#REF-9282', jobId: '#JB-2838', partyName: 'Musa Ibrahim', partyEmail: 'musaibrahim@gmail.com', initials: 'MI', type: 'Mobilization', amount: '₦96,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
  { id: '5', ref: '#REF-9282', jobId: '#JB-2835', partyName: 'FastFreight Co.', partyEmail: 'fastfreightco@gmail.com', initials: 'FC', type: 'Demurrage', amount: '₦180,000', date: 'May 14 2026 10:40 am', direction: 'Inflow' },
  { id: '6', ref: '#REF-9282', jobId: '#JB-2830', partyName: 'Apex Logistics', partyEmail: 'apexlogistics@gmail.com', initials: 'AL', type: 'Refund', amount: '₦240,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
  { id: '7', ref: '#REF-9282', jobId: '#JB-2829', partyName: 'Taiwo Ogunleye', partyEmail: 'taiwoogunleye@gmail.com', initials: 'TO', type: 'Escrow in', amount: '₦320,000', date: 'May 14 2026 10:40 am', direction: 'Inflow' },
  { id: '8', ref: '#REF-9282', jobId: '#JB-2829', partyName: 'Balogun Adamu', partyEmail: 'balogunadamu@gmail.com', initials: 'BA', type: 'Payout', amount: '₦288,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
  { id: '9', ref: '#REF-9282', jobId: '#JB-2826', partyName: 'ClearPath Ltd.', partyEmail: 'admin@clearpathltd.com', initials: 'CL', type: 'Demurrage credit', amount: '₦50,000', date: 'May 14 2026 10:40 am', direction: 'Outflow' },
];

const revenueData = [
  { day: 'Mon', value: 400000 },
  { day: 'Tue', value: 600000 },
  { day: 'Wed', value: 1200000 },
  { day: 'Thu', value: 1200000 },
  { day: 'Fri', value: 1800000 }, 
  { day: 'Sat', value: 400000 },
  { day: 'Sun', value: 200000 },
];

type TabType = 'Finance Overview' | 'Escrow Ledger';
type PeriodType = 'This week' | 'This month' | 'This year' | 'All-time';

export default function PaymentsClient() {
  const [activeTab, setActiveTab] = useState<TabType>('Finance Overview');
  const [period, setPeriod] = useState<PeriodType>('This week');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <HeaderMenu title="Payments" label="Payments" />

      <div className="p-6 mx-auto max-w-[1400px]">
        
        {/* Top Controls: Period & Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">Period:</span>
            <div className="flex bg-white rounded-full p-1 border border-slate-200">
              {(['This week', 'This month', 'This year', 'All-time'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                    period === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          {(['Finance Overview', 'Escrow Ledger'] as TabType[]).map((tab) => (
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
        {activeTab === 'Finance Overview' && <FinanceOverviewTab />}
        {activeTab === 'Escrow Ledger' && <EscrowLedgerTab />}

      </div>
    </div>
  );
}

// ==========================================
// TAB 1: FINANCE OVERVIEW
// ==========================================
const FinanceOverviewTab = () => {
  return (
    <div className="space-y-6">
      
      {/* ESCROW SECTION */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">ESCROW</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="TOTAL ESCROW BALANCE" value="₦28.4M" subtext="Total held across all active & pending jobs" />
          <KPICard title="IN ESCROW" value="₦18.2M" subtext="Locked for jobs actively in progress" subtext2="264 active jobs" />
          <KPICard title="PENDING RELEASE" value="₦6.4M" subtext="Approved but not yet disbursed" subtext2="12 awaiting transfer" subtext2Color="text-emerald-500" />
          <KPICard title="TOTAL ESCROW PAID OUT" value="₦84.1M" subtext="Cumulative escrow released this period" trend="+ 22% vs last period" trendType="up" />
        </div>
      </div>

      {/* PAYOUTS SECTION */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">PAYOUTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="TOTAL PAID TO TRUCKERS" value="₦75.7M" subtext="30% mobilization + 70% final release this period" subtext2="1,354 trips paid out" subtext2Color="text-emerald-500" />
          <KPICard title="TOTAL PAID TO FORWARDERS" value="₦4.8M" subtext="Refunds, partial refunds & demurrage credits returned" subtext2="48 transactions" />
          <KPICard title="PAYOUT SUCCESS RATE" value="98.2%" subtext="% of all payout attempts that cleared without failure" trend="+ 0.4pts vs last period" trendType="up" />
          <KPICard title="FAILED PAYOUTS" value="₦120K" subtext="Total value of failed attempts" subtext2="4 failed transfers" subtext2Color="text-red-500" />
        </div>
      </div>

      {/* DEMURRAGE & COMMISSION SECTION */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">DEMURRAGE & COMMISSION</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard title="TOTAL DEMURRAGE COLLECTED" value="₦2.1M" subtext="Total demurrage across all jobs regardless of which party bore it" />
          <KPICard title="DEMURRAGE CREDITED TO FORWARDERS" value="₦840K" subtext="Credited to forwarders due to driver-side delivery delays" />
          <KPICard title="DEMURRAGE CHARGED TO FORWARDERS" value="₦1.26M" subtext="Billed to forwarders for offloading delays exceeding the 48-hour free window" />
          <KPICard title="TOTAL COMMISSION EARNED" value="₦8.4M" subtext="Platform commission on completed & released jobs this period" trend="10% rate • ↑ 18% vs last period" trendType="up" />
        </div>
      </div>

      {/* BOTTOM CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Escrow Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-8">Escrow breakdown</h3>
          
          {/* Progress Bar */}
          <div className="w-full h-4 rounded-full flex overflow-hidden mb-8">
            <div className="bg-blue-600 h-full" style={{ width: '64%' }}></div>
            <div className="bg-amber-400 h-full" style={{ width: '22%' }}></div>
            <div className="bg-red-500 h-full" style={{ width: '9%' }}></div>
            <div className="bg-slate-300 h-full" style={{ width: '5%' }}></div>
          </div>

          {/* Legend */}
          <div className="space-y-4 mt-auto">
            <LegendRow color="bg-blue-600" label="In escrow (active jobs)" amount="₦18.2M" percent="64%" />
            <LegendRow color="bg-amber-400" label="Pending release" amount="₦6.4M" percent="22%" />
            <LegendRow color="bg-red-500" label="Held in disputes" amount="₦1.4M" percent="9%" />
            <LegendRow color="bg-slate-300" label="Failed / unclaimed" amount="₦120K" percent="5%" />
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Revenue trend</h3>
            <span className="text-xs text-slate-500 font-medium">Commission earned — last 7 days</span>
          </div>
          
          {/* REAL RECHARTS IMPLEMENTATION */}
          <div className="flex-1 w-full h-48 mb-6 border-b border-slate-100 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={40}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} 
                  dy={10}
                />
                <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#0f172a'
                    }}
                    formatter={(value: any) => [`₦${(Number(value) / 1000000).toFixed(1)}M`, 'Commission']}
                />
                <Bar 
                  dataKey="value" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Daily avg commission</span>
              <span className="font-bold text-slate-900">₦1.2M</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Best day (Fri)</span>
              <span className="font-bold text-emerald-500">₦1.8M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TAB 2: ESCROW LEDGER
// ==========================================
const EscrowLedgerTab = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Escrow in', 'Mobilization', 'Payout', 'Demurrage', 'Refund'];

  const getTypeBadgeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'escrow in': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'payout': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'commission': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'mobilization': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'demurrage': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'demurrage credit': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'refund': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getDirectionBadge = (dir: string) => {
    const isInflow = dir.toLowerCase() === 'inflow';
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isInflow ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isInflow ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        {dir}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
      
      {/* Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white">
        {/* Search */}
        <div className="relative w-full xl:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search job, trucker, forwarder..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 flex-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Export CSV */}
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">REF</th>
              <th className="px-6 py-4">JOB ID</th>
              <th className="px-6 py-4">PARTY</th>
              <th className="px-6 py-4">TYPE</th>
              <th className="px-6 py-4">AMOUNT</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">DIRECTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgerData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-slate-400 font-medium">{row.ref}</td>
                <td className="px-6 py-4 font-bold text-blue-600">
                  {row.jobId !== '-' ? (
                    <a href="#" className="hover:underline">{row.jobId}</a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {row.partyName === 'Platform' ? (
                      <div className="text-slate-700 font-bold">{row.partyName}</div>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                          {row.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-xs">{row.partyName}</span>
                          <span className="text-[11px] text-slate-400">{row.partyEmail}</span>
                        </div>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTypeBadgeStyles(row.type)}`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">{row.amount}</td>
                <td className="px-6 py-4 text-slate-500 text-xs font-medium">{row.date}</td>
                <td className="px-6 py-4">
                  {getDirectionBadge(row.direction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

const KPICard = ({ 
  title, 
  value, 
  subtext, 
  subtext2, 
  subtext2Color = "text-slate-400",
  trend,
  trendType
}: { 
  title: string; 
  value: string; 
  subtext: string;
  subtext2?: string;
  subtext2Color?: string;
  trend?: string;
  trendType?: 'up' | 'down';
}) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <h4 className="text-3xl font-bold text-slate-900 mb-2">{value}</h4>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">{subtext}</p>
    </div>
    
    {subtext2 && (
      <p className={`text-[11px] font-bold mt-auto ${subtext2Color}`}>{subtext2}</p>
    )}
    
    {trend && (
      <div className={`flex items-center gap-1 text-[11px] font-bold mt-auto ${trendType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend}
      </div>
    )}
  </div>
);

const LegendRow = ({ color, label, amount, percent }: { color: string, label: string, amount: string, percent: string }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-sm ${color}`}></div>
      <span className="text-slate-600 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-bold text-slate-900">{amount}</span>
      <span className="text-slate-400 w-8 text-right text-xs font-bold">{percent}</span>
    </div>
  </div>
);