import { useState, useEffect } from 'react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import { Loader2 } from 'lucide-react';
import { getSupportStatsAction } from '@/app/actions/support';




export const KPICards = () => {
  const [stats, setStats] = useState({
    openThreads: 0,
    needResponseCount: 0,
    resolvedToday: 0,
    avgResponseTimeHours: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const res = await getSupportStatsAction();
      if (res.success && res.data) {
        setStats({
          openThreads: res.data.openThreads || 0,
          needResponseCount: res.data.needResponseCount || 0,
          resolvedToday: res.data.resolvedToday || 0,
          avgResponseTimeHours: res.data.avgResponseTimeHours || 0
        });
      }
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Open Threads</p>
        {isLoading ? (
          <Loader2 size={28} className="animate-spin text-blue-600 mt-1" />
        ) : (
          <>
            <h3 className="text-3xl font-bold text-blue-600 mb-1">{stats.openThreads}</h3>
            <p className="text-xs font-bold text-slate-800">{stats.needResponseCount} Need response</p>
          </>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resolved Today</p>
        {isLoading ? (
          <Loader2 size={28} className="animate-spin text-emerald-500 mt-1" />
        ) : (
          <h3 className="text-3xl font-bold text-emerald-500 mb-1">{stats.resolvedToday}</h3>
        )}
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Response Time</p>
        {isLoading ? (
          <Loader2 size={28} className="animate-spin text-slate-800 mt-1" />
        ) : (
          <h3 className="text-3xl font-bold text-slate-800 mb-1">{stats.avgResponseTimeHours}h</h3>
        )}
      </div>
    </div>
  );
};