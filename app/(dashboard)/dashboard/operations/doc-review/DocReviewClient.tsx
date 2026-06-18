'use client'

import React, { useState, useEffect } from 'react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import { Search, X, AlertCircle, Loader2 } from 'lucide-react';
import { 
  getDocQueueAction, 
  getTruckRegAction, 
  getDocQueueDetailAction,
  getTruckRegDetailAction,
  approveDocAction,
  rejectDocAction
} from '@/app/actions/doc-review';

// ==========================================
// TYPES & HELPERS
// ==========================================
export type TabType = 'Document Queue' | 'Truck registration';

const formatRelativeTime = (dateString: string) => {
  const diffInMinutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

// ==========================================
// MODALS
// ==========================================
const DocumentReviewModal = ({ jobId, onClose, onRefresh }: { jobId: string | null, onClose: () => void, onRefresh: () => void }) => {
  const [activeTab, setActiveTab] = useState<'tdo' | 'exitNote' | 'gatePass'>('tdo');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (jobId) {
      setIsLoading(true);
      getDocQueueDetailAction(jobId).then(res => {
        if (res.success) {
          setData(res.data);
          // Auto-select first available document tab
          if (res.data.documents?.tdo) setActiveTab('tdo');
          else if (res.data.documents?.exitNote) setActiveTab('exitNote');
          else if (res.data.documents?.gatePass) setActiveTab('gatePass');
        }
        setIsLoading(false);
      });
    } else {
      setData(null);
    }
  }, [jobId]);

  const handleAction = async (type: 'approve' | 'reject') => {
    if (!jobId) return;
    let reason = '';
    
    if (type === 'reject') {
      const input = window.prompt("Enter reason for rejection:");
      if (!input) return;
      reason = input;
    }

    setIsSubmitting(true);
    const res = type === 'approve' ? await approveDocAction(jobId) : await rejectDocAction(jobId, reason);
    setIsSubmitting(false);
    
    if (res.success) {
      onRefresh();
      onClose();
    } else {
      alert(res.message);
    }
  };

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {isLoading || !data ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : (
          <>
            <div className="border-t-4 border-[#0241E8] px-6 py-4 flex justify-between items-start border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Document Review — {data.forwarderName}</h2>
                <p className="text-sm text-gray-500 mt-1">Job {data.jobNumber} • Review uploaded documents</p>
              </div>
              <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="bg-[#F8F9FA] rounded-xl p-4 flex justify-between items-start border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Job Details</p>
                  <h3 className="font-bold text-gray-900 text-base">{data.route?.pickup} → {data.route?.delivery}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{data.container}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  data.statusLabel === 'On track' ? 'bg-[#E6F7ED] text-[#01AC4E]' : 
                  data.statusLabel === 'At risk' ? 'bg-[#FFF8EB] text-[#FFBA2F]' : 'bg-[#FDECEB] text-[#EB3A32]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${data.statusLabel === 'On track' ? 'bg-[#01AC4E]' : data.statusLabel === 'At risk' ? 'bg-[#FFBA2F]' : 'bg-[#EB3A32]'}`}></span>
                  {data.statusLabel}
                </span>
              </div>

              <div>
                <div className="flex border-b border-[#E0E0E0] gap-6">
                  {['tdo', 'exitNote', 'gatePass'].map((tab) => {
                    const hasDoc = !!data.documents[tab];
                    const labels: any = { tdo: 'TDO', exitNote: 'Exit Note', gatePass: 'Gate Pass' };
                    
                    if (!hasDoc) return null;
                    return (
                      <button key={tab} onClick={() => setActiveTab(tab as any)}
                        className={`text-sm font-bold pb-2 transition-colors ${activeTab === tab ? 'text-[#0241E8] border-b-2 border-[#0241E8]' : 'text-[#A1AEBF] border-b-2 border-transparent hover:text-gray-600'}`}>
                        {labels[tab]}
                      </button>
                    )
                  })}
                </div>
                
                <div className="mt-4 bg-[#F0F2F5] rounded-xl w-full h-96 border border-gray-200 overflow-hidden relative">
                   {data.documents[activeTab] ? (
                     <iframe src={data.documents[activeTab]} className="w-full h-full" title="Document Preview" />
                   ) : (
                     <div className="flex items-center justify-center h-full text-slate-400 font-medium">Document not provided</div>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Forwarder</p><p className="font-medium text-gray-900">{data.forwarderName}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Job ID</p><p className="font-bold text-[#0241E8]">{data.jobNumber}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Container</p><p className="font-medium text-gray-900">{data.containerNumber || '-'}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">TDO Date</p><p className="font-medium text-gray-900">{data.tdoDate ? new Date(data.tdoDate).toDateString() : '-'}</p></div>
              </div>
            </div>

            {data.status === 'awaiting' && (
              <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
                <button onClick={onClose} disabled={isSubmitting} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">Close</button>
                <div className="flex gap-3">
                  <button onClick={() => handleAction('reject')} disabled={isSubmitting} className="border border-[#EB3A32] text-[#EB3A32] px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors disabled:opacity-50">Reject</button>
                  <button onClick={() => handleAction('approve')} disabled={isSubmitting} className="bg-[#01AC4E] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2">
                    {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                    Approve
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const TruckRegistrationModal = ({ truckId, onClose }: { truckId: string | null, onClose: () => void }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (truckId) {
      setIsLoading(true);
      getTruckRegDetailAction(truckId).then(res => {
        if (res.success) setData(res.data);
        setIsLoading(false);
      });
    } else {
      setData(null);
    }
  }, [truckId]);

  if (!truckId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {isLoading || !data ? (
           <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
        ) : (
          <>
            <div className="px-6 py-5 flex justify-between items-start border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Truck Registration Review</h2>
                <p className="text-sm text-gray-500 mt-1">{data.truckerName} • Truck {data.plateNumber}</p>
              </div>
              <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"><X size={18} className="text-gray-600" /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Trucker</p><p className="font-medium text-gray-900">{data.truckerName}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Plate Number</p><p className="font-bold text-[#0241E8] tracking-wider">{data.plateNumber}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Type</p><p className="font-medium text-gray-900">{data.containerType}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Size</p><p className="font-medium text-gray-900">{data.containerSize}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Container Weight</p><p className="font-medium text-gray-900">{data.containerWeight}</p></div>
                <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Year of Manufacture</p><p className="font-medium text-gray-900">{data.year || '-'}</p></div>
              </div>
              <div>
                <div className="border-b border-[#E0E0E0] pb-2 mb-4"><h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Truck Images</h3></div>
                <div className="grid grid-cols-2 gap-4">
                  {data.photos?.map((imgUrl: string, index: number) => (
                    <div key={index} className="rounded-xl overflow-hidden h-48 bg-gray-100 border border-gray-200">
                      <img src={imgUrl} alt={`Truck view ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
              <button onClick={onClose} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Close</button>
              {data.status === 'PENDING_REVIEW' && (
                <div className="flex gap-3">
                  <button className="border border-[#EB3A32] text-[#EB3A32] px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">Reject</button>
                  <button className="border border-[#01AC4E] text-[#01AC4E] px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors">Approve</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


// ==========================================
// MAIN COMPONENT
// ==========================================
export default function DocReviewClient({ initialStats, initialQueue, initialTrucks }: any) {
  const [activeTab, setActiveTab] = useState<TabType>('Document Queue');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [queueData, setQueueData] = useState(initialQueue?.jobs || []);
  const [trucksData, setTrucksData] = useState(initialTrucks?.trucks || []);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);

  const docFilters = ['All', 'Awaiting approval', 'Rejected', 'Approved'];
  const truckFilters = ['All', 'New registration', 'Edit request', 'Awaiting approval', 'Rejected', 'Approved'];

  const stats = [
    { label: 'AWAITING APPROVAL', value: initialStats?.awaiting || 0, color: '#FFBA2F' },
    { label: 'APPROVED TODAY', value: initialStats?.approvedToday || 0, color: '#01AC4E' },
    { label: 'REJECTED TODAY', value: initialStats?.rejectedToday || 0, color: '#EB3A32' },
  ];

  // Helper to map UI filter to API values
  const parseFilter = (filter: string) => {
    switch (filter) {
      case 'Awaiting approval': return { status: 'awaiting', type: '' };
      case 'Rejected': return { status: 'rejected', type: '' };
      case 'Approved': return { status: 'approved', type: '' };
      case 'New registration': return { status: 'all', type: 'new' };
      case 'Edit request': return { status: 'all', type: 'edit' };
      default: return { status: 'all', type: '' };
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { status, type } = parseFilter(activeFilter);
    
    if (activeTab === 'Document Queue') {
      const res = await getDocQueueAction({ status, search: searchQuery });
      const payload = res?.data || res;
      setQueueData(payload?.jobs || []);
    } else {
      const res = await getTruckRegAction({ status, type, search: searchQuery });
      const payload = res?.data || res;
      setTrucksData(payload?.trucks || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const debounceId = setTimeout(() => { fetchData(); }, 300);
    return () => clearTimeout(debounceId);
  }, [activeTab, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <HeaderMenu title='Document Review' label='Document Review' />

      <div className='p-5 mx-auto'>
        
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {stats.map(s => (
            <div key={s.label} className='border-[#E0E0E0] border rounded-xl bg-white p-5 shadow-sm'>
              <p className='text-[#4A5567] font-bold text-xs uppercase tracking-wide mb-2'>{s.label}</p>
              <p className='font-bold text-3xl' style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className='flex mt-8 border-b border-b-[#E0E0E0]'>
          {(['Document Queue', 'Truck registration'] as TabType[]).map((t, index) => (
            <button key={index} onClick={() => { setActiveTab(t); setActiveFilter('All'); setSearchQuery(''); }}
              className={`text-sm font-bold px-4 pb-2 transition-colors ${
                activeTab === t ? 'text-[#0241E8] border-b-2 border-[#0241E8]' : 'text-[#A1AEBF] border-b-2 border-transparent hover:text-gray-600'
              }`}>
              {t}
            </button>
          ))}
        </div>

        <div className='my-5 flex flex-col md:flex-row items-start md:items-center gap-4'>
          <div className='flex bg-white p-2 gap-2 border border-[#BDBDBD] rounded-lg w-full md:w-80 focus-within:border-[#0241E8] transition-colors'>
            <Search color='#BDBDBD' size={20} />
            <input type="text" placeholder='Search...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='flex-1 focus:outline-none text-sm' />
          </div>
          <div className='flex items-center gap-3 overflow-x-auto no-scrollbar w-full'>
            <div className='flex items-center gap-2 whitespace-nowrap pb-1'>
              {(activeTab === 'Document Queue' ? docFilters : truckFilters).map(f => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`border h-8 px-4 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === f ? 'text-white bg-[#0241E8] border-[#0241E8]' : 'text-[#4F4F4F] bg-white border-[#BDBDBD] hover:bg-gray-50'
                  }`}>{f}</button>
              ))}
            </div>
          </div>
        </div>

        <div className='bg-white border-[#BDBDBD] border rounded-xl overflow-hidden shadow-sm min-h-[400px] flex flex-col'>
          <div className='flex justify-between items-center px-6 py-4 border-b border-b-[#E8ECF1] bg-[#FCFDFD]'>
            <p className='text-[#131514] font-bold text-sm'>
              {activeTab === 'Document Queue' ? 'Document Queue' : 'Truck Registration Approvals'}
            </p>
            {activeTab === 'Truck registration' && initialStats?.awaiting > 0 && (
              <span className='bg-[#FFF8EB] text-[#FFBA2F] px-3 py-1 rounded-full text-xs font-bold'>{initialStats.awaiting} pending</span>
            )}
          </div>

          <div className='flex flex-col flex-1'>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
            ) : activeTab === 'Document Queue' ? (
              queueData.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No documents found.</div>
              ) : queueData.map((job: any, index: number) => {
                const isApproved = job.status === 'approved';
                const isRejected = job.status === 'rejected';
                const initials = job.forwarderName ? job.forwarderName.substring(0, 2).toUpperCase() : 'FW';

                return (
                  <div key={job.id} className={`flex justify-between px-6 py-5 ${index !== queueData.length - 1 ? 'border-b border-[#E8ECF1]' : ''} ${isApproved ? 'bg-[#E6F7ED]/30' : isRejected ? 'bg-red-50/30' : 'bg-orange-50/20'}`}>
                    <div className='flex flex-1'>
                      <div className='bg-[#0241E8] text-white w-12 h-12 rounded-lg flex justify-center items-center font-bold text-lg shrink-0'>{initials}</div>
                      <div className='flex-1 justify-start ml-4 grid gap-1.5'>
                        <div className='flex items-center gap-3'>
                          <p className='font-bold text-sm text-gray-900'>{job.forwarderName}</p>
                          <p className='text-[#0241E8] font-bold text-sm'>{job.jobNumber}</p>
                          {!isApproved && (
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${isRejected ? 'bg-[#FDECEB] text-[#EB3A32]' : 'bg-[#FFF8EB] text-[#FFBA2F]'}`}>{job.statusLabel}</span>
                          )}
                        </div>
                        <p className='font-medium text-xs text-[#718097]'>{job.route} · {job.container} · Submitted {formatRelativeTime(job.submittedAt)}</p>
                        <div className='flex gap-2 mt-1'>
                          {job.documents?.map((doc: string, i: number) => (
                            <div key={i} className='text-xs font-bold bg-[#E6F7ED] border-[#01AC4E] border text-[#01AC4E] rounded flex justify-center items-center px-2.5 py-0.5'>{doc}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='self-center'>
                      {isApproved ? (
                        <span className='text-[#01AC4E] font-bold text-sm flex items-center gap-1.5'><span className='w-1.5 h-1.5 rounded-full bg-[#01AC4E]'></span>Approved</span>
                      ) : (
                        <button onClick={() => setSelectedDocId(job.id)} className='text-[#0241E8] text-sm font-bold border border-[#0241E8] rounded-lg px-6 py-2 hover:bg-blue-50 transition-colors'>Review</button>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              trucksData.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No trucks found.</div>
              ) : trucksData.map((truck: any, index: number) => (
                <div key={truck.id} className={`flex justify-between items-center px-6 py-5 ${index !== trucksData.length - 1 ? 'border-b border-[#E8ECF1]' : ''}`}>
                  <div className='flex flex-col gap-1.5'>
                    <div className='flex items-center gap-3'>
                      <p className='text-[#0241E8] font-bold text-base'>{truck.plateNumber}</p>
                      <span className={`px-3 py-1 rounded border text-xs font-bold ${truck.requestType === 'NEW_REGISTRATION' ? 'bg-[#E6F7ED] text-[#01AC4E] border-[#01AC4E]' : 'bg-[#FFF8EB] text-[#FFBA2F] border-[#FFBA2F]'}`}>{truck.requestTypeLabel}</span>
                    </div>
                    <p className='font-medium text-xs text-[#718097]'>{truck.truckerName} - {formatRelativeTime(truck.submittedAt)}</p>
                  </div>
                  <button onClick={() => setSelectedTruckId(truck.id)} className='text-[#0241E8] text-sm font-bold border border-[#0241E8] rounded-lg px-6 py-2 hover:bg-blue-50 transition-colors'>Review</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <DocumentReviewModal jobId={selectedDocId} onClose={() => setSelectedDocId(null)} onRefresh={fetchData} />
      <TruckRegistrationModal truckId={selectedTruckId} onClose={() => setSelectedTruckId(null)} />
    </div>
  );
}