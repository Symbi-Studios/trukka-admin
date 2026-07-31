'use client'

import { Search, Send, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getBroadcastsAction, sendBroadcastAction } from "@/app/actions/support";

export const BroadcastTab = () => {
  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Dynamic Channel State (Defaults to 'in-app' selected)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['in-app']);
  
  // History State
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBroadcasts = async () => {
    setIsLoading(true);
    const res = await getBroadcastsAction();
    console.log("BROADCASTS API RESPONSE:", res.data); // LOGGING TO INSPECT LATER
    if (res.success && res.data) {
      setBroadcasts(res.data.broadcasts || res.data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  // Helper to toggle channels on/off
  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => 
      prev.includes(channel) 
        ? prev.filter((c) => c !== channel) 
        : [...prev, channel]
    );
  };

  const handleSendBroadcast = async () => {
    if (!title.trim() || !message.trim() || selectedChannels.length === 0) return;
    setIsSending(true);
    
    const payload = {
      title,
      message,
      channels: selectedChannels, // Now completely dynamic based on UI
      audience: "ALL",
      userIds: []
    };

    const res = await sendBroadcastAction(payload);
    if (res.success) {
      setTitle('');
      setMessage('');
      // Keep selected channels as they are for convenience, or reset them if you prefer
      fetchBroadcasts(); // Refresh list after sending
      alert('Broadcast sent successfully!');
    } else {
      alert('Failed to send broadcast.');
    }
    setIsSending(false);
  };

  return (
    <div className="flex gap-6 items-start">
      
      {/* Left: Send Form */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Send message</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-3">Channel</label>
            <div className="flex gap-2">
              {['in-app', 'email', 'push'].map((channel) => {
                const isSelected = selectedChannels.includes(channel);
                return (
                  <button 
                    key={channel}
                    onClick={() => toggleChannel(channel)}
                    className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {channel.replace('-', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Notification title / Subject (for email)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g Important update about your delivery" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message</label>
            <textarea 
              rows={6} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here" 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleSendBroadcast}
              // Button is disabled if title/message is empty, or if NO channels are selected
              disabled={isSending || !title || !message || selectedChannels.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors disabled:opacity-50"
            >
              {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} 
              Send broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Right: History */}
      <div className="w-1/2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Recent broadcasts</h2>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 w-6 h-6" /></div>
          ) : broadcasts.length === 0 ? (
            <div className="text-center text-slate-500 text-sm py-10">No recent broadcasts found.</div>
          ) : (
            broadcasts.map((b, i) => (
              <div key={i} className="border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900">{b.title || 'Untitled Broadcast'}</h4>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{b.recipientCount || 0}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Sent</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {b.audience || 'All users'} • {(b.channels || []).join(' + ')} • {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};