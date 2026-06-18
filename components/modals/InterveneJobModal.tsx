import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { interveneJobAction } from '@/app/actions/jobs';

export default function InterveneModal({ isOpen, onClose, jobId }: { isOpen: boolean, onClose: () => void, jobId: string | null }) {
  // Map your UI to the specific API requirements
  const interventionTypes = [
    { id: 'MESSAGE_FORWARDER', title: 'Message forwarder', description: 'Send a message to forwarder.' },
    { id: 'CANCEL_JOB', title: 'Cancel job', description: 'Cancel entirely. Payment held for review.' }
  ];

  const [selectedType, setSelectedType] = useState('MESSAGE_FORWARDER');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedType('MESSAGE_FORWARDER');
      setNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!jobId) return;
    setIsSubmitting(true);
    
    const res = await interveneJobAction(jobId, selectedType, notes);
    
    setIsSubmitting(false);
    if (res.success) {
      // Show toast ideally here, then close
      onClose();
    } else {
      alert(res.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-start p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Intervene</h2>
            <p className="text-[15px] text-slate-500 mt-1">Select intervention type</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-3 mb-6">
            {interventionTypes.map((type) => (
              <div 
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-start p-4 cursor-pointer border rounded-xl transition-all duration-200 ${
                  selectedType === type.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200'
                }`}
              >
                <div className="ml-3 flex-1">
                  <span className="block text-[15px] font-bold text-slate-800">{type.title}</span>
                  <span className="block text-[13px] text-slate-500 mt-0.5">{type.description}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[15px] font-bold text-slate-800 block">Notes</label>
            <textarea 
              rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for action taken..." 
              className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 border bg-white rounded-lg">
            Dismiss
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !notes}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            Intervene
          </button>
        </div>
        
      </div>
    </div>
  );
}