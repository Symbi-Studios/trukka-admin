import { approveDocAction, getDocQueueDetailAction, rejectDocAction } from "@/app/actions/doc-review";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

export const DocumentReviewModal = ({ jobId, onClose, onRefresh }: { jobId: string | null, onClose: () => void, onRefresh: () => void }) => {
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