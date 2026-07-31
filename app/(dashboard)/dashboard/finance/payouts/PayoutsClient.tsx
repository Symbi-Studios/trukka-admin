'use client'

import React, { useState } from 'react';
import { Search, Plus, X, Download } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';

// --- MOCK DATA ---
const pendingRequests = [
  { id: '1', name: 'Taiwo Ogunleye', email: 'taiwoogunleye@gmail.com', initials: 'TO', amount: '₦280,000', accountName: 'Taiwo Ogunleye', accountNumber: '0123456789', bank: 'United Bank for Africa' },
  { id: '2', name: 'Kingsley Okafor', email: 'kokafor@gmail.com', initials: 'KO', amount: '₦590,000', accountName: 'Kingsley Okafor', accountNumber: '0987654321', bank: 'Guaranty Trust Bank' },
  { id: '3', name: 'Taiwo Ogunleye', email: 'taiwoogunleye@gmail.com', initials: 'TO', amount: '₦670,000', accountName: 'Taiwo Ogunleye', accountNumber: '0123456789', bank: 'United Bank for Africa' },
  { id: '4', name: 'Taiwo Ogunleye', email: 'taiwoogunleye@gmail.com', initials: 'TO', amount: '₦293,000', accountName: 'Taiwo Ogunleye', accountNumber: '0123456789', bank: 'United Bank for Africa' },
  { id: '5', name: 'Deborah Caulcrick', email: 'yolitsdebra@gmail.com', initials: 'DC', amount: '₦320,000', accountName: 'Deborah Caulcrick', accountNumber: '1122334455', bank: 'Zenith Bank' },
];

const allPayouts = [
  { id: '1', txnId: '#TXN-9282', name: 'A. Nwachukwu', email: 'adaxoziinwa@gmail.com', initials: 'DC', type: 'Trucker', price: '₦480,000', date: 'May 26 10:30', status: 'Paid', processedBy: 'Deborah C.' },
  { id: '2', txnId: '#TXN-9282', name: 'A. Nwachukwu', email: 'adaxoziinwa@gmail.com', initials: 'DC', type: 'Trucker', price: '₦480,000', date: 'May 26 10:30', status: 'Pending', processedBy: 'Deborah C.' },
  { id: '3', txnId: '#TXN-9282', name: 'A. Nwachukwu', email: 'adaxoziinwa@gmail.com', initials: 'DC', type: 'Trucker', price: '₦480,000', date: 'May 26 10:30', status: 'Rejected', processedBy: 'Deborah C.' },
  { id: '4', txnId: '#TXN-9282', name: 'A. Nwachukwu', email: 'adaxoziinwa@gmail.com', initials: 'DC', type: 'Trucker', price: '₦480,000', date: 'May 26 10:30', status: 'Failed', processedBy: 'Deborah C.' },
];

type TabType = 'Pending requests' | 'All payouts';

// --- MAIN CLIENT COMPONENT ---
export default function PayoutsClient() {
  const [activeTab, setActiveTab] = useState<TabType>('Pending requests');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <HeaderMenu title="Payouts" label="Finance" />

      <div className="p-6 mx-auto max-w-[1400px] space-y-6">
        <PayoutKPIs />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          {(['Pending requests', 'All payouts'] as TabType[]).map((tab) => (
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

        {/* Tab Content */}
        {activeTab === 'Pending requests' && <PendingRequestsTab />}
        {activeTab === 'All payouts' && <AllPayoutsTab />}
      </div>
    </div>
  );
}

// --- KPI COMPONENT ---
const PayoutKPIs = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">PAID OUT TODAY</p>
      <h4 className="text-4xl font-bold text-emerald-500">12</h4>
    </div>
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">PENDING REQUESTS</p>
      <h4 className="text-4xl font-bold text-amber-500">5</h4>
    </div>
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">FAILED PAYOUTS</p>
      <h4 className="text-4xl font-bold text-red-500">1</h4>
    </div>
  </div>
);

// --- PENDING REQUESTS TAB ---
const PendingRequestsTab = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>(pendingRequests[0].id);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const selectedRequest = pendingRequests.find(r => r.id === selectedRequestId);

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search name, reference..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} /> Manual payout
        </button>
      </div>

      {/* Split View */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left List */}
        <div className="w-full lg:w-5/12 space-y-3">
          {pendingRequests.map((req) => (
            <div 
              key={req.id} 
              onClick={() => setSelectedRequestId(req.id)}
              className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer transition-colors flex items-center justify-between ${
                selectedRequestId === req.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {req.initials}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{req.name}</h4>
                  <p className="text-xs text-slate-500">{req.email}</p>
                </div>
              </div>
              <span className="font-bold text-slate-900 text-lg">{req.amount}</span>
            </div>
          ))}
        </div>

        {/* Right Detail Panel */}
        <div className="w-full lg:w-7/12 bg-white border border-slate-200 rounded-xl shadow-sm p-6 sticky top-6">
          {selectedRequest && (
            <>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <h3 className="font-bold text-slate-900">Process payout</h3>
                <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 text-xs font-bold rounded-full">
                  Pending
                </span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                    {selectedRequest.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedRequest.name}</h4>
                    <p className="text-sm text-slate-500">{selectedRequest.email}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 text-2xl">{selectedRequest.amount}</span>
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">ACCOUNT DETAILS</p>
                <div className="bg-slate-100 rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Account name</span>
                    <span className="font-bold text-slate-900">{selectedRequest.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Account number</span>
                    <span className="font-bold text-slate-900">{selectedRequest.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Bank</span>
                    <span className="font-bold text-slate-900">{selectedRequest.bank}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[11px] font-bold text-slate-900 mb-2">Admin note <span className="text-slate-400 font-normal">(optional)</span></p>
                <textarea 
                  rows={4}
                  placeholder="Any other note about this payout..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none placeholder:text-slate-400"
                ></textarea>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Approve and payout {selectedRequest.amount}
                </button>
                <button 
                  onClick={() => setIsRejectModalOpen(true)}
                  className="w-full py-3.5 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors shadow-sm"
                >
                  Reject request
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <RejectPayoutModal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        requestName={selectedRequest?.name || ''} 
      />
    </div>
  );
};

// --- REJECT PAYOUT MODAL ---
const RejectPayoutModal = ({ isOpen, onClose, requestName }: { isOpen: boolean, onClose: () => void, requestName: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 relative border-b border-slate-100">
          <button onClick={onClose} className="absolute right-6 top-6 p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600">
            <X size={16} />
          </button>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Reject Payout Request</h2>
          <p className="text-sm text-slate-500 font-medium">Reject payout request by {requestName}</p>
        </div>

        <div className="p-6">
          <label className="block text-sm font-bold text-slate-900 mb-2">Reason for rejection</label>
          <textarea 
            rows={5}
            placeholder="Reason for rejection"
            className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-red-500 resize-none placeholder:text-slate-400"
          ></textarea>
        </div>

        <div className="p-6 pt-0 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button className="px-5 py-2.5 bg-white border border-red-300 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors shadow-sm">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ALL PAYOUTS TAB ---
const AllPayoutsTab = () => {
  const [period, setPeriod] = useState('This week');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Pending', 'Paid', 'Rejected', 'Failed', 'Forwarder', 'Trucker'];

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusDotStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'rejected': return 'bg-red-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getRowBgColor = (status: string) => {
    if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'failed') {
      return 'bg-red-50/40 hover:bg-red-50/70';
    }
    return 'hover:bg-slate-50/50';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Period Filters & Export */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-700">Period:</span>
          <div className="flex bg-white rounded-full p-1 border border-slate-200">
            {['This week', 'This month', 'This year', 'All-time'].map((p) => (
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white">
          <div className="relative w-full xl:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search ref, user..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>

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

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} /> Manual payout
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">TXN ID</th>
                <th className="px-6 py-4">AVATAR</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">PRICE</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">PROCESSED BY</th>
                <th className="px-6 py-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allPayouts.map((row) => (
                <tr key={row.id} className={`transition-colors ${getRowBgColor(row.status)}`}>
                  <td className="px-6 py-4 text-slate-400 font-medium italic">{row.txnId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {row.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs">{row.name}</span>
                        <span className="text-[11px] text-slate-400">{row.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-600 border-blue-100">
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{row.price}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs">{row.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeStyles(row.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyles(row.status)}`}></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium text-xs">{row.processedBy}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 border border-blue-200 text-blue-600 font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors">
                        View
                      </button>
                      {row.status.toLowerCase() === 'failed' && (
                        <button className="px-3 py-1.5 border border-emerald-200 text-emerald-600 font-bold text-xs rounded-lg hover:bg-emerald-50 transition-colors bg-white">
                          Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};