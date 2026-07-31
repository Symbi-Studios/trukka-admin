'use client'

import { BellRing, FileText, Paperclip, Plus, Search, Send, Upload, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  getThreadsAction, 
  getThreadMessagesAction, 
  replyToThreadAction, 
  updateThreadAction,
  getTemplatesAction,
  sendThreadPushAction,
  uploadThreadAttachmentsAction
} from "@/app/actions/support";
import { useSearchParams } from "next/navigation";

// --- TEMPLATES DRAWER ---
const TemplatesDrawer = ({ isOpen, onClose, onSelectTemplate }: { isOpen: boolean, onClose: () => void, onSelectTemplate: (text: string) => void }) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPreview, setSelectedPreview] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const fetchTemplates = async () => {
        setIsLoading(true);
        const res = await getTemplatesAction();
        if (res.success && res.data) {
          setTemplates(res.data.templates || res.data || []);
        }
        setIsLoading(false);
      };
      fetchTemplates();
    }
  }, [isOpen]);

  const filteredTemplates = templates.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.body?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUseTemplate = () => {
    if (selectedPreview) {
      onSelectTemplate(selectedPreview);
      setSelectedPreview('');
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}
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
            <input 
              type="text" 
              placeholder="Search template..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Templates</p>
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center py-5"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : filteredTemplates.length === 0 ? (
                <p className="text-sm text-slate-500">No templates found.</p>
              ) : (
                filteredTemplates.map((t, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedPreview(t.body)}
                    className={`border rounded-xl p-4 cursor-pointer transition-colors ${selectedPreview === t.body ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">{t.category || 'GENERAL'}</span>
                    <h4 className="font-bold text-slate-900 mt-2 mb-1">{t.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{t.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preview</p>
          <div className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-600 mb-4 h-24 overflow-y-auto">
            {selectedPreview || <span className="text-slate-400 italic">Select a template to preview...</span>}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            <button 
              onClick={handleUseTemplate} 
              disabled={!selectedPreview}
              className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Use template
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- PUSH MODAL ---
const PushModal = ({ isOpen, onClose, threadId, userName }: { isOpen: boolean, onClose: () => void, threadId: string, userName: string }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendPush = async () => {
    if (!title || !message || !threadId) return;
    setIsSending(true);
    const res = await sendThreadPushAction(threadId, { title, message });
    if (res.success) {
      alert("Push notification sent!");
      setTitle('');
      setMessage('');
      onClose();
    } else {
      alert("Failed to send push notification.");
    }
    setIsSending(false);
  };

  const applyQuickTemplate = (templateTitle: string, templateMessage: string) => {
    setTitle(templateTitle);
    setMessage(templateMessage);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Send push notification</h2>
            <p className="text-sm text-slate-500">Sending to {userName || 'User'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Template</p>
            <div className="flex flex-wrap gap-2">
              <span onClick={() => applyQuickTemplate("Delivery Delayed", "Your job has been delayed due to port congestion. We are monitoring the situation.")} className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50">General delivery delay</span>
              <span onClick={() => applyQuickTemplate("Documents Approved", "Your documents have been successfully approved.")} className="px-3 py-1.5 border border-blue-200 text-blue-600 bg-white rounded-full text-xs font-bold cursor-pointer hover:bg-blue-50">Documents approved</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Notification title <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g Update on your delivery" className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Message body <span className="text-red-500">*</span></label>
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g Your job has been delayed." className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"></textarea>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Preview</p>
            <div className="bg-[#1A1D1F] text-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
                <div className="w-4 h-4 bg-slate-700 rounded-sm"></div> TRUKKAS
              </div>
              <h4 className="font-bold mb-1">{title || 'Notification title'}</h4>
              <p className="text-sm text-slate-300 mb-2">{message || 'Message body preview'}</p>
              <p className="text-[10px] text-slate-500">now</p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          <button 
            onClick={handleSendPush}
            disabled={!title || !message || isSending}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSending && <Loader2 size={16} className="animate-spin" />}
            Send push notification
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ATTACH MODAL ---
const AttachModal = ({ isOpen, onClose, userName, threadId, onUploadSuccess }: { isOpen: boolean, onClose: () => void, userName: string, threadId: string, onUploadSuccess: (urls: string[]) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile || !threadId) return;
    setIsUploading(true);

    // 1. Prepare FormData
    const formData = new FormData();
    formData.append('files', selectedFile);

    // 2. Upload file
    const uploadRes = await uploadThreadAttachmentsAction(threadId, formData);
    
    if (uploadRes.success && uploadRes.data?.urls) {
      // 3. Pass URLs back to main chat input instead of sending immediately
      onUploadSuccess(uploadRes.data.urls);
      setSelectedFile(null);
      onClose();
    } else {
      alert("Failed to upload the file.");
    }
    
    setIsUploading(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Attach to message</h2>
            <p className="text-sm text-slate-500">Sending to {userName || 'User'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {!selectedFile ? (
            <label className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors">
              <Upload size={24} className="text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-900 mb-1">Click to browse files</p>
              <p className="text-xs text-slate-400">PDF, JPG, PNG • Max 10 MB per file</p>
              <input type="file" className="hidden" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
            </label>
          ) : (
            <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-slate-600" />
                <span className="text-sm font-bold text-slate-800 max-w-[200px] truncate">{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-medium">Ready</span>
                <button onClick={() => setSelectedFile(null)} className="text-slate-500 hover:text-slate-800"><X size={16} /></button>
              </div>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50">Cancel</button>
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading && <Loader2 size={16} className="animate-spin" />}
            Upload Attachment
          </button>
        </div>
      </div>
    </div>
  );
};


// --- INBOX TAB ---
export const InboxTab = () => {
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [isPushOpen, setIsPushOpen] = useState(false);

  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");
  const subjectFromUrl = searchParams.get("subject");

  // Data States
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  // Input & Pending Attachments
  const [replyText, setReplyText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  // Filters
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');


  //For redirect from other pages when admin is messaging a user 
  useEffect(() => {
  if (!userIdFromUrl || threads.length === 0 || selectedThread) return;

  const existingThread = threads.find(
    t => t.user?.id === userIdFromUrl
  );

  if (existingThread) {
    handleSelectThread(existingThread);
    return;
  }

  // No existing thread
  // Create one here if your backend supports it.
}, [userIdFromUrl, threads]);

  // Fetch Threads
  const fetchThreads = async () => {
    setIsLoadingThreads(true);
    const res = await getThreadsAction({ tab: activeFilter, search: searchQuery });
    if (res.success && res.data) {
      setThreads(res.data.threads || res.data || []); 
    }
    setIsLoadingThreads(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => { fetchThreads(); }, 300);
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  // Fetch Messages when a thread is selected
  const handleSelectThread = async (thread: any) => {
    setSelectedThread(thread);
    setPendingAttachments([]); // Clear pending attachments on thread switch
    
    // Optimistically remove the unread dot in the UI immediately
    if (thread.unread) {
      setThreads((prevThreads) => 
        prevThreads.map(t => t.id === thread.id ? { ...t, unread: false } : t)
      );
    }

    setIsLoadingMessages(true);
    const res = await getThreadMessagesAction(thread.id);
    if (res.success && res.data) {
      setMessages(res.data.messages || []);
    }
    setIsLoadingMessages(false);
  };

  // Reply to Thread
  const handleSendReply = async () => {
    // Prevent sending if text is empty AND there are no pending attachments
    if ((!replyText.trim() && pendingAttachments.length === 0) || !selectedThread) return;
    setIsSending(true);
    
    const messageContent = replyText.trim() || 'Attached file';
    const res = await replyToThreadAction(selectedThread.id, messageContent, pendingAttachments);
    
    if (res.success) {
      setReplyText('');
      setPendingAttachments([]); // Clear attachments after sending
      await handleSelectThread(selectedThread); // refresh messages
    } else {
      alert("Failed to send message.");
    }
    setIsSending(false);
  };

  // Close Thread
  const handleCloseThread = async () => {
    if (!selectedThread) return;
    const res = await updateThreadAction(selectedThread.id, { status: 'CLOSED' });
    if (res.success) {
      setSelectedThread({ ...selectedThread, status: 'CLOSED' });
      fetchThreads(); // Refresh list
    }
  };

  // Remove a pending attachment before sending
  const removePendingAttachment = (indexToRemove: number) => {
    setPendingAttachments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const getInitials = (name?: string) => name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <>
      <div className="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Left Panel: Conversations List */}
        <div className="w-1/3 border-r border-slate-200 flex flex-col bg-white">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900">All conversations</h2>
            </div>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-2.5 mb-4 focus-within:border-blue-500 transition-colors">
              <Search size={16} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full" 
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {['All', 'Unread', 'Closed', 'Delays'].map(f => (
                <span 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full cursor-pointer shrink-0 transition-colors ${activeFilter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoadingThreads ? (
               <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 w-6 h-6" /></div>
            ) : threads.length === 0 ? (
               <div className="p-10 text-center text-slate-500 text-sm">No conversations found.</div>
            ) : (
              threads.map((chat) => (
                <div key={chat.id} onClick={() => handleSelectThread(chat)} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors relative ${selectedThread?.id === chat.id ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                  {selectedThread?.id === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                      {getInitials(chat.user?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{chat.user?.name || 'Unknown User'}</h4>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2 flex items-center gap-1">
                          {chat.unread && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                          {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <span className="inline-block mb-1.5 px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                        {chat.status || 'Open'}
                      </span>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {chat.lastMessage?.content || '...'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Active Chat */}
        <div className="w-2/3 flex flex-col bg-slate-50/30">
          {!selectedThread ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation to view messages</div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(selectedThread.user?.name)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      {selectedThread.user?.name || 'User'}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">{selectedThread.user?.role || 'Customer'}</p>
                  </div>
                </div>
                {selectedThread.status !== 'CLOSED' && (
                  <button onClick={handleCloseThread} className="px-4 py-2 border border-red-200 text-red-600 font-bold text-sm rounded-lg hover:bg-red-50 transition-colors">
                    Close
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingMessages ? (
                  <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 w-6 h-6" /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 text-sm">No messages yet.</div>
                ) : (
                  messages.map((msg, i) => {
                    const isMyMsg = msg.senderType !== 'USER';
                    return (
                      <div key={i} className={`flex flex-col ${isMyMsg ? 'items-end ml-auto' : 'items-start'} max-w-[80%]`}>
                        <div className={`p-4 rounded-2xl text-sm font-medium ${isMyMsg ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20' : 'bg-slate-200/70 text-slate-800 rounded-tl-sm'}`}>
                          {msg.content}
                          
                          {/* Render Attachments if they exist */}
                          {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.attachmentUrls.map((url: string, idx: number) => (
                                <a 
                                  key={idx} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className={`flex items-center gap-2 p-2 rounded-lg text-xs hover:underline ${isMyMsg ? 'bg-blue-700/50' : 'bg-slate-300/50'}`}
                                >
                                  <FileText size={14} /> View Attachment {idx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className={`text-[11px] font-bold text-slate-400 mt-2 ${isMyMsg ? 'mr-1' : 'ml-1'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col">
                
                {/* Pending Attachments Preview Area */}
                {pendingAttachments.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {pendingAttachments.map((url, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold shadow-sm">
                        <FileText size={14} /> Attachment ready
                        <button 
                          onClick={() => removePendingAttachment(idx)} 
                          className="hover:text-red-500 ml-1 transition-colors"
                          title="Remove attachment"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

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
                  <input 
                    type="text" 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm" 
                  />
                  <button 
                    onClick={handleSendReply}
                    // Button is disabled if both the text is empty AND there are no attachments
                    disabled={isSending || (!replyText.trim() && pendingAttachments.length === 0)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Render Modals */}
      <TemplatesDrawer 
        isOpen={isTemplatesOpen} 
        onClose={() => setIsTemplatesOpen(false)} 
        onSelectTemplate={(text) => setReplyText(text)} 
      />
      {selectedThread && (
        <AttachModal 
          isOpen={isAttachOpen} 
          onClose={() => setIsAttachOpen(false)} 
          threadId={selectedThread.id}
          userName={selectedThread.user?.name} 
          onUploadSuccess={(urls) => setPendingAttachments([...pendingAttachments, ...urls])}
        />
      )}
      {selectedThread && (
        <PushModal 
          isOpen={isPushOpen} 
          onClose={() => setIsPushOpen(false)} 
          threadId={selectedThread.id} 
          userName={selectedThread.user?.name} 
        />
      )}
    </>
  );
};