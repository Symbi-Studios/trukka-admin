
import { BellRing, FileText, Paperclip, Plus, Search, Send, Upload, X } from "lucide-react";
import { useState } from "react";

const mockConversations = [
  { id: '1', name: 'A. Nwachukwu', role: 'Forwarder', tag: 'Delivery delay', tagColor: 'text-amber-600 bg-amber-50 border-amber-200', time: '2m ago', active: true, unread: false, avatar: 'AN', isClosed: false },
  { id: '2', name: 'Adaeze Lukman', role: 'General enquiry', text: 'Hi, I uploaded my documents about 30 minu...', time: '2m ago', active: false, unread: false, avatar: 'AL', isClosed: false },
  { id: '3', name: 'Taiwo Ogunleye', role: 'Delivery delay', text: 'My delivery is taking too long to arrive. The ET...', time: '2m ago', active: false, unread: false, avatar: 'TO', isClosed: false },
  { id: '4', name: 'Bello Ibrahim', role: 'General enquiry', text: "I don't have an exit note", time: '2m ago', active: false, unread: true, avatar: 'BI', isClosed: false },
  { id: '5', name: 'Bello Ibrahim', role: 'Closed', text: 'Thank you for reaching out. We are looking...', time: '2m ago', active: false, unread: false, avatar: 'BI', isClosed: true, tagColor: 'text-red-600 bg-red-50 border-red-200' },
  { id: '6', name: 'John Daniels', role: 'General enquiry', text: 'I am having trouble linking to my company', time: '2m ago', active: false, unread: true, avatar: 'JD', isClosed: false },
];



const TemplatesDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
      
      {/* Slide-in Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Message templates</h2>
            <p className="text-sm text-slate-500">Select a template to pre-fill your reply</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><X size={18} /></button>
        </div>

        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <Search size={16} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search template..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Group: Delivery & Jobs */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Delivery & Jobs</p>
            <div className="space-y-3">
              <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors">
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Delay</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">General delivery delay</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Your job has been delayed due to port congestion. Our team is monitoring the situation. Please allow 24-48 hours for an update.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-4 cursor-pointer hover:border-slate-300 transition-colors">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">Docs</span>
                <h4 className="font-bold text-slate-900 mt-2 mb-1">Documents approved</h4>
                <p className="text-xs text-slate-600 leading-relaxed">Your documents have been approved. We are now finding you a driver. You will be notified once a match is confirmed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-600 mb-4 h-24">
            Your job has been delayed due to port congestion. Our team is monitoring the situation. Please allow 24-48 hours for an update.
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            <button className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700">Use template</button>
          </div>
        </div>
      </div>
    </>
  );
};

const AttachModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Attach to message</h2>
            <p className="text-sm text-slate-500">Sending to Adaeze Lukman</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
            <Upload size={24} className="text-slate-600 mb-3" />
            <p className="text-sm font-bold text-slate-900 mb-1">Drag files here or click to browse</p>
            <p className="text-xs text-slate-400">PDF, JPG, PNG • Max 10 MB per file</p>
          </div>
          <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-slate-600" />
              <span className="text-sm font-bold text-slate-800">file.pdf</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Upload complete</span>
              <button className="text-slate-500 hover:text-slate-800"><X size={16} /></button>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700">Send attachment</button>
        </div>
      </div>
    </div>
  );
};

const PushModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Send push notification</h2>
            <p className="text-sm text-slate-500">Send a push notification to Adaeze Lukman</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Template</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50">General delivery delay</span>
              <span className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50">Documents approved</span>
              <span className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50">Payment released</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Notification title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g Update on your delivery" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message body <span className="text-red-500">*</span></label>
            <textarea rows={4} placeholder="e.g Your job has been delayed. Our team is reconciling the situation." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"></textarea>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preview</p>
            <div className="bg-[#1A1D1F] text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
                <div className="w-4 h-4 bg-slate-700 rounded-sm"></div> TRUKKAS
              </div>
              <h4 className="font-bold mb-1">Notification title</h4>
              <p className="text-sm text-slate-300 mb-2">Message body preview</p>
              <p className="text-[10px] text-slate-500">now</p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700">Send push notification</button>
        </div>
      </div>
    </div>
  );
};

export const InboxTab = () => {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isPushOpen, setIsPushOpen] = useState(false);

  return (
    <>
      <div className="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Left Panel: Conversations List */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900">All conversations</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Plus size={16} /> New
              </button>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-4 focus-within:border-blue-500 transition-colors">
              <Search size={16} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search conversations..." className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full cursor-pointer shrink-0">All</span>
              <span className="px-4 py-1.5 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 shrink-0">Unread</span>
              <span className="px-4 py-1.5 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 shrink-0">Closed</span>
              <span className="px-4 py-1.5 bg-white text-slate-700 text-xs font-bold border border-slate-200 rounded-full cursor-pointer hover:bg-slate-50 shrink-0">Delays</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockConversations.map((chat) => (
              <div key={chat.id} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors relative ${chat.active ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                {chat.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${chat.active ? 'bg-blue-600' : 'bg-blue-600'}`}>
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{chat.name}</h4>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2 flex items-center gap-1">
                        {chat.unread && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                        {chat.time}
                      </span>
                    </div>
                    {chat.role && !chat.isClosed && (
                      <span className={`inline-block mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${chat.tagColor || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {chat.role}
                      </span>
                    )}
                    {chat.isClosed && (
                      <span className="inline-block mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold border bg-red-50 text-red-600 border-red-200">
                        Closed
                      </span>
                    )}
                    <p className="text-xs text-slate-500 truncate font-medium">{chat.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Chat */}
        <div className="w-2/3 flex flex-col bg-slate-50/30">
          
          {/* Chat Header */}
          <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                AN
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  A. Nwachukwu
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Delivery delay</span>
                </h2>
                <p className="text-sm text-slate-500 font-medium">Forwarder</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">
              Close
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Incoming Message */}
            <div className="flex flex-col items-start max-w-[80%]">
              <div className="bg-slate-200/70 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm font-medium">
                Hi, the driver arrived about an hour ago but we are still waiting to offload. Will demurrage start immediately?
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2 ml-1">Mar 14 • 09:15</span>
            </div>

            {/* Outgoing Message */}
            <div className="flex flex-col items-end max-w-[80%] ml-auto">
              <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm font-medium shadow-md shadow-blue-600/20">
                Thanks for reaching out. I can see the driver arrived at 2:18 PM, so your 48-hour free time window has already started. Demurrage will only apply after the free time ends.
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2 mr-1">Kemi A. • Mar 14 • 09:20</span>
            </div>

            {/* Incoming Message */}
            <div className="flex flex-col items-start max-w-[80%]">
              <div className="bg-slate-200/70 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm font-medium">
                Okay, that helps. How will I know when demurrage starts?
              </div>
              <span className="text-[11px] font-bold text-slate-400 mt-2 ml-1">Mar 14 • 09:23</span>
            </div>

          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            {/* Quick Reply Pills */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 custom-scrollbar">
              <span className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50 whitespace-nowrap">We are looking into this</span>
              <span className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50 whitespace-nowrap">Your payment has been released</span>
              <span className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50 whitespace-nowrap">Please allow 24 hours</span>
              <span className="px-4 py-1.5 border border-blue-200 text-blue-600 rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50 whitespace-nowrap">Documents have been approved</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-3">
              <button onClick={() => setIsAttachOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <Paperclip size={16} /> Attach
              </button>
              <button onClick={() => setIsTemplatesOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <FileText size={16} /> Templates
              </button>
              <button onClick={() => setIsPushOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <BellRing size={16} /> Push notification
              </button>
            </div>

            {/* Input Box */}
            <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-2 pl-4 focus-within:border-blue-500 transition-colors bg-white">
              <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent border-none outline-none text-sm" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors">
                <Send size={16} /> Send
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Render Modals */}
      <TemplatesDrawer isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} />
      <AttachModal isOpen={isAttachOpen} onClose={() => setIsAttachOpen(false)} />
      <PushModal isOpen={isPushOpen} onClose={() => setIsPushOpen(false)} />
    </>
  );
};