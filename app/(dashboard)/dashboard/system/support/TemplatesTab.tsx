import { ChevronDown, Plus, Search } from "lucide-react";



const mockTemplates = [
  { id: 't1', category: 'Delay', title: 'General delivery delay', body: 'Your job has been delayed due to port congestion. Our team is monitoring the situation. Please allow 24-48 hours for an update.' },
  { id: 't2', category: 'Docs', title: 'Documents approved', body: 'Your documents have been approved. We are now finding you a driver. You will be notified once a match is confirmed.' },
  { id: 't3', category: 'Payment', title: 'Payment released', body: 'Your payment has been released from escrow and is on its way. It should reflect in your account within 2-4 business hours.' },
  { id: 't4', category: 'Payment', title: 'Payment on hold — under review', body: 'Your payment is currently on hold pending a review. Our team is working to resolve this and will update you within 24 hours.' },
  { id: 't5', category: 'General', title: 'Looking into this', body: 'Thank you for reaching out. We are looking into this and will update you within 24 hours. We apologise for any inconvenience.' },
  { id: 't6', category: 'General', title: 'Issue resolved — closing ticket', body: 'We are glad this has been resolved. We are now closing this support thread. Please open a new conversation if you need further assistance.' },
];

export const TemplatesTab = () => {
  return (
    <div className="flex gap-6 items-start h-[calc(100vh-280px)] min-h-[600px]">
      
      {/* Left: Template List */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-900">All templates</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={16} /> New template
          </button>
        </div>
        
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-lg p-2 focus-within:border-blue-500 transition-colors">
            <Search size={16} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search templates..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full cursor-pointer">All</span>
            <span className="px-4 py-2 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50">Delay</span>
            <span className="px-4 py-2 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50">Docs</span>
            <span className="px-4 py-2 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50">Payment</span>
            <span className="px-4 py-2 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50">General</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {mockTemplates.map((t, i) => (
            <div key={t.id} className={`bg-white border rounded-xl p-5 cursor-pointer transition-colors ${i === 0 ? 'border-blue-400 bg-blue-50/20 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border mb-2 inline-block ${
                t.category === 'Delay' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                t.category === 'Docs' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                t.category === 'Payment' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>{t.category}</span>
              <h4 className="font-bold text-slate-900 mb-1">{t.title}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Edit Template */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-slate-900">Edit template</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
            <button className="px-4 py-2 text-sm font-bold text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors">Save template</button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Template name <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="General delivery delay" className="w-full border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Category <span className="text-red-500">*</span></label>
            <div className="relative">
              <select className="w-full border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 appearance-none bg-white">
                <option>General</option>
                <option selected>Delay</option>
                <option>Docs</option>
                <option>Payment</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message body <span className="text-red-500">*</span></label>
            <textarea rows={8} defaultValue="Your job has been delayed due to port congestion. Our team is actively monitoring the situation. Please allow 24-48 hours for an update." className="w-full border border-slate-200 rounded-lg p-4 text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"></textarea>
          </div>
        </div>
      </div>

    </div>
  );
};
