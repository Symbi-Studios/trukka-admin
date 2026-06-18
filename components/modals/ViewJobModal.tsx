import React, { useEffect, useState } from 'react';
import { X, Map as MapIcon, Loader2 } from 'lucide-react';
import { getJobDetailAction } from '@/app/actions/jobs';

export default function ViewJobModal({ jobId, onClose, onIntervene }: { jobId: string | null, onClose: () => void, onIntervene: () => void }) {
  const [jobData, setJobData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      setIsLoading(true);
      getJobDetailAction(jobId).then((res) => {
        console.log('details',res)
        if (res.success) setJobData(res.data);
        setIsLoading(false);
      });
    } else {
      setJobData(null);
    }
  }, [jobId]);

  if (!jobId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Job {jobData?.jobNumber || 'Loading...'}</h2>
            {jobData && (
              <p className="text-[13px] text-slate-500 mt-1 font-medium">
                {jobData.forwarderName} • {jobData.route?.pickup.split(',')[0]} → {jobData.route?.delivery.split(',')[0]}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading || !jobData ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl min-h-[300px] lg:min-h-[400px] relative overflow-hidden flex items-center justify-center">
                <div className="relative flex flex-col items-center text-blue-400">
                  <MapIcon size={48} className="mb-3 opacity-50" />
                  <span className="text-sm font-semibold tracking-wide uppercase opacity-70">Live Map View</span>
                </div>
              </div>

              <div className="flex flex-col space-y-8">
                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">Job Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailBox label="Forwarder" value={jobData.forwarderName} />
                    <DetailBox label="Driver" value={jobData.truckerDriverName || '-'} />
                    <DetailBox label="Container" value={jobData.container} />
                    <DetailBox label="Weight" value={jobData.containerWeight} />
                    <DetailBox label="Deadline" value={new Date(jobData.deadline).toLocaleDateString()} />
                    <DetailBox label="Days Left" value={`${jobData.daysLeft} days`} />
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-4">Timeline</h3>
                  <div className="relative border-l-2 border-slate-100 ml-2.5 space-y-6">
                    {jobData.timeline.map((event: any, index: number) => (
                      <div key={index} className="relative pl-5">
                        <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-white ${
                          event.completed ? 'bg-emerald-500' : 'bg-slate-300'
                        }`} />
                        <div>
                          <p className={`text-[13px] font-bold ${!event.completed ? 'text-slate-500' : 'text-slate-800'}`}>
                            {event.event}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">
                            {new Date(event.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-semibold text-slate-600 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg">
            Close
          </button>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 text-[13px] font-semibold text-white bg-[#0241E8] border hover:bg-blue-700 rounded-lg">
              Message driver
            </button>
            <button onClick={onIntervene} className="px-4 py-2 text-[13px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg">
              Intervene
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Subcomponent for cleaner code
const DetailBox = ({ label, value }: { label: string, value: string }) => (
  <div className="bg-slate-100/70 p-3.5 rounded-xl border border-slate-100">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-[13px] font-semibold text-slate-800">{value}</p>
  </div>
);