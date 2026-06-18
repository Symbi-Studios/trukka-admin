'use client'

import React, { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

// You can move these interfaces to your types file
export interface DocumentJobData {
  forwarderName: string
  jobId: string
  route: string
  containerInfo: string
  status: string
  tdoDate: string
  containerNumber: string
}

interface DocumentReviewModalProps {
  isOpen: boolean
  onClose: () => void
  data?: DocumentJobData
}

export const DocumentReviewModal: React.FC<DocumentReviewModalProps> = ({ 
  isOpen, 
  onClose,
  data = {
    forwarderName: 'Adaeze Lukman',
    jobId: '#JB-NEW-001',
    route: 'Apapa → Aba',
    containerInfo: '40ft container • Submitted 14 min ago',
    status: 'On track',
    tdoDate: 'Mon Jan 26, 2026',
    containerNumber: '40ft - CONT123456789'
  }
}) => {
  const [activeTab, setActiveTab] = useState<'TDO' | 'Exit Note'>('TDO')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header - Note the blue top border */}
        <div className="border-t-4 border-[#0241E8] px-6 py-4 flex justify-between items-start border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Document Review — {data.forwarderName}</h2>
            <p className="text-sm text-gray-500 mt-1">Job {data.jobId} • Review uploaded documents</p>
          </div>
          <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Job Details Card */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 flex justify-between items-start border border-gray-100">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Job Details</p>
              <h3 className="font-bold text-gray-900 text-base">{data.route}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{data.containerInfo}</p>
            </div>
            <span className="bg-[#E6F7ED] text-[#01AC4E] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#01AC4E]"></span>
              {data.status}
            </span>
          </div>

          {/* Document Tabs */}
          <div>
            <div className="flex border-b border-[#E0E0E0]">
              {['TDO', 'Exit Note'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as 'TDO' | 'Exit Note')}
                  className={`text-sm font-bold px-6 pb-2 transition-colors ${
                    activeTab === tab
                      ? 'text-[#0241E8] border-b-2 border-[#0241E8]'
                      : 'text-[#A1AEBF] border-b-2 border-transparent hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Warning Banner */}
            <div className="mt-4 bg-[#FFF8EB] border border-[#FFBA2F]/30 rounded-lg p-3 flex items-start gap-2.5">
              <AlertCircle size={18} className="text-[#FFBA2F] shrink-0 mt-0.5" />
              <p className="text-sm text-[#B27B15] font-medium">
                TDO date is more than 24 hours from now. This document appears valid.
              </p>
            </div>

            {/* Document Placeholder (PDF/Image Viewer goes here) */}
            <div className="mt-4 bg-[#F0F2F5] rounded-xl w-full h-64 border border-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-sm font-medium">Document Preview Area</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Forwarder</p>
              <p className="font-medium text-gray-900">{data.forwarderName}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Job ID</p>
              <p className="font-bold text-[#0241E8]">{data.jobId}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Container</p>
              <p className="font-medium text-gray-900">{data.containerNumber}</p>
            </div>
            <div className="bg-[#F8F9FA] rounded-lg p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">TDO Date</p>
              <p className="font-medium text-gray-900">{data.tdoDate}</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-white">
          <button onClick={onClose} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
            Close
          </button>
          <div className="flex gap-3">
            <button className="border border-[#EB3A32] text-[#EB3A32] px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
              Reject
            </button>
            <button className="border border-[#01AC4E] text-[#01AC4E] px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors">
              Approve
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}