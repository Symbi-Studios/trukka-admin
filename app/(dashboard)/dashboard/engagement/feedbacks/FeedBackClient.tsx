'use client'

import React, { useState } from 'react'
import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import { Search, ArrowUp } from 'lucide-react'

// --- SVGs for accurate Star rendering ---
const StarFilled = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

const StarEmpty = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#E2E8F0" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
)

// --- Helper Component: Star Rating ---
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? <StarFilled /> : <StarEmpty />}
        </span>
      ))}
    </div>
  )
}

// --- Mock Data ---
const starFilters = ['All', '1-star', '2-star', '3-star', '4-star', '5-star']
const userTypeFilters = ['Forwarder', 'Trucker']
const tabs = ['Feedback', 'Archive']

const mockReviews = [
  { 
    id: '1', 
    jobId: '#JB-2541', 
    reviewerName: 'A. Nwachukwu', 
    reviewerRole: 'Forwarder', 
    rating: 1, 
    comment: 'Absolutely terrible. Everything about this was just wrong.', 
    date: 'Mar 14, 2026', 
    avatar: 'AN', 
    canMessage: true 
  },
  { 
    id: '2', 
    jobId: '#JB-2541', 
    reviewerName: 'T. Nwachukwu', 
    reviewerRole: 'Forwarder', 
    rating: 4, 
    comment: 'The job tracking is really smooth, but push notifications when a trucker accepts would save a lot of refreshing. Overall very impressed with the platform.', 
    date: 'Mar 14, 2026', 
    avatar: 'TN', 
    canMessage: false 
  },
  { 
    id: '3', 
    jobId: '#JB-2541', 
    reviewerName: 'T. Nwachukwu', 
    reviewerRole: 'Forwarder', 
    rating: 4, 
    comment: 'The job tracking is really smooth, but push notifications when a trucker accepts would save a lot of refreshing. Overall very impressed with the platform.', 
    date: 'Mar 14, 2026', 
    avatar: 'TN', 
    canMessage: false 
  },
]

export default function FeedBackClient() {
  const [activeStarFilter, setActiveStarFilter] = useState('All')
  const [activeUserType, setActiveUserType] = useState('Forwarder')
  const [activeTab, setActiveTab] = useState('Feedback')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <HeaderMenu title="Trip Feedback" label="Feedback" />

      <div className="p-6 mx-auto space-y-6">
        
        {/* --- KPI Cards Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Average Rating */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
              Average Rating
            </h3>
            <div className="text-[40px] leading-none font-bold text-slate-900 mb-2">
              4.2
            </div>
            <StarRating rating={4} /> {/* Approximated to 4 filled, 1 empty for visual match */}
          </div>

          {/* Total Responses */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
              Total Responses
            </h3>
            <div className="text-[40px] leading-none font-bold text-slate-900 mb-2">
              84
            </div>
            <div className="flex items-center text-xs font-bold text-slate-400">
              <span className="flex items-center text-emerald-500 mr-1.5">
                <ArrowUp size={14} strokeWidth={3} className="mr-0.5" /> 12
              </span>
              This week
            </div>
          </div>

          {/* Unread */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
              Unread
            </h3>
            <div className="text-[40px] leading-none font-bold text-blue-600 mb-2">
              3
            </div>
            <div className="h-5"></div> {/* Spacer to align heights */}
          </div>
        </div>

        {/* --- Search & Star Filters Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
          {/* Search Box */}
          <div className="flex items-center bg-white px-3 py-2 border border-slate-200 rounded-lg w-full sm:w-[320px] focus-within:border-blue-500 shadow-sm transition-colors">
            <Search className="text-slate-400 mr-2" size={18} />
            <input 
              type="text" 
              placeholder="Search feedback..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-400" 
            />
          </div>

          {/* Star Filters */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
            {starFilters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveStarFilter(f)}
                className={`h-9.5 px-5 rounded-full text-sm font-bold transition-colors whitespace-nowrap border ${
                  activeStarFilter === f
                    ? 'bg-[#0241E8] text-white border-[#0241E8]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* --- User Type Filters Row --- */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-800 font-medium mr-1">User type:</span>
          {userTypeFilters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveUserType(f)}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                activeUserType === f
                  ? 'bg-[#0241E8] text-white border-[#0241E8]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* --- Tabs Row --- */}
        <div className="flex border-b border-slate-200">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-[#0241E8] border-[#0241E8]'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- Feedback Cards List --- */}
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
              
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-[#0241E8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900">{review.reviewerName}</h4>
                    <p className="text-[11px] font-medium text-slate-400">{review.reviewerRole}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              {/* Card Body (Review Text) */}
              <div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              {/* Card Footer (Metadata & Actions) */}
              <div className="flex justify-between items-end mt-2">
                <div className="text-xs text-slate-500 font-medium">
                  {review.date} • {review.jobId}
                </div>
                
                <div className="flex items-center gap-3">
                  {review.canMessage && (
                    <button className="px-4 py-1.5 bg-[#0241E8] text-white text-[13px] font-bold rounded-lg hover:bg-blue-700 transition-colors">
                      Message user
                    </button>
                  )}
                  <button className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-[13px] font-bold rounded-lg hover:bg-slate-50 transition-colors">
                    Archive
                  </button>
                  <button className="px-4 py-1.5 bg-white border border-red-200 text-red-600 text-[13px] font-bold rounded-lg hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}