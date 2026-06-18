import { Loader2 } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-100/50 pb-10">
      {/* You can show the header instantly so the layout doesn't jump */}
      <HeaderMenu title="Marketplace Overview" label="Overview" />
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading dashboard data...</p>
      </div>
    </div>
  );
}