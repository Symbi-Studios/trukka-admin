import { Search, Send, X } from "lucide-react";

export const BroadcastTab = () => {
  return (
    <div className="flex gap-6 items-start">
      
      {/* Left: Send Form */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Send message</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Channel</label>
            <div className="flex gap-2">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-bold">In-app</button>
              <button className="px-5 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold hover:bg-slate-200">Email</button>
              <button className="px-5 py-2 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold hover:bg-slate-50">Push</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Send to</label>
            <div className="border border-slate-200 rounded-xl p-3 mb-3 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition-colors">
              <div className="flex items-center mb-2">
                <Search size={16} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Search and select users..." className="bg-transparent border-none outline-none text-sm w-full" />
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">Victor Adabra <X size={12} className="cursor-pointer hover:text-red-500" /></span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">Deborah Caulcrick <X size={12} className="cursor-pointer hover:text-red-500" /></span>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">Anne Nwachukwu <X size={12} className="cursor-pointer hover:text-red-500" /></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">All users</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">Forwarders only</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">Truckers only</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">Drivers only</button>
              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50">Active jobs only</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Notification title / Subject (for email)</label>
            <input type="text" placeholder="e.g Important update about your delivery" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
            <textarea rows={6} placeholder="Write your message here" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"></textarea>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors">
              <Send size={16} /> Send broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Right: History */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent broadcasts</h2>
        
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-900">Platform maintenance window</h4>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">200</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sent</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">All users • Email + in-app • Mar 15</p>
          </div>

          <div className="border-b border-slate-100 pb-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold text-slate-900">Tin Can port congestion advisory</h4>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">200</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sent</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">All users • In-app • Mar 14</p>
          </div>
        </div>
      </div>

    </div>
  );
};