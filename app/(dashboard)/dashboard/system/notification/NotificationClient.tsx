'use client'

import React, { useState, useEffect } from 'react'
import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import { Dot, Loader2, Bell, CheckCircle2 } from 'lucide-react'
import { 
  getNotificationsAction, 
  markNotificationsReadAction, 
  markAllNotificationsReadAction 
} from '@/app/actions/notifications'

// --- Helpers ---
const filterPills = ['All', 'Unread', 'Alert', 'Payment', 'Jobs']

const formatRelativeTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export default function NotificationClient({ initialData }: any) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // State
  const [notifications, setNotifications] = useState<any[]>(initialData?.notifications || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(initialData?.pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(initialData?.pagination?.totalPages || 1);
  const [totalItems, setTotalItems] = useState(initialData?.pagination?.total || 0);

  // Fetch logic
  const fetchNotifications = async () => {
    setIsLoading(true);
    const res = await getNotificationsAction({ 
      tab: activeFilter, 
      page: currentPage 
    });
    
    if (res.success) {
      setNotifications(res.data.notifications || []);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalItems(res.data.pagination.total || 0);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    fetchNotifications();
  }, [activeFilter, currentPage]);

  const handleFilterChange = (filter: string) => {
    if (activeFilter === filter) return;
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  // --- Mark As Read Handlers ---
  const handleNotificationClick = async (notification: any) => {
    if (notification.isRead) return; // Do nothing if already read

    // Optimistic UI update
    setNotifications(current => 
      current.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Call API
    await markNotificationsReadAction([notification.id]);
  };

  const handleMarkAllRead = async () => {
    // Optimistic UI update
    setNotifications(current => 
      current.map(n => ({ ...n, isRead: true }))
    );

    // Call API
    await markAllNotificationsReadAction();
  };

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <HeaderMenu title='Notification Center' label='Notifications' />

      <div className='p-5 max-w-5xl mx-auto'>
        
        {/* Filters & Actions Header */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5'>
          <div className='flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1'>
            {filterPills.map(f => (
              <div key={f}
                onClick={() => handleFilterChange(f)}
                className={`border cursor-pointer h-8 px-5 rounded-full text-sm font-bold flex items-center justify-center transition-colors whitespace-nowrap ${
                  activeFilter === f
                    ? 'text-white bg-[#0241E8] border-[#0241E8]'
                    : 'text-[#4F4F4F] bg-white border-[#BDBDBD] hover:bg-gray-50'
                }`}>
                {f}
              </div>
            ))}
          </div>

          {hasUnread && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0241E8] transition-colors bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm whitespace-nowrap"
            >
              <CheckCircle2 size={16} /> Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className='bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col'>
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="animate-spin text-[#0241E8] h-8 w-8" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 space-y-3">
                <Bell size={32} className="text-slate-300" />
                <p className="font-medium text-sm">No notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n: any) => (
                  <div 
                    key={n.id} 
                    onClick={() => handleNotificationClick(n)}
                    className={`py-4 px-6 transition-colors cursor-pointer relative ${
                      n.isRead === false ? 'bg-blue-50/20 hover:bg-blue-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Unread Indicator */}
                    {n.isRead === false && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0241E8]"></div>
                    )}
                    
                    <p className={`text-[#131514] text-[15px] mb-1 ${n.isRead === false ? 'font-bold' : 'font-medium'}`}>
                      {n.title}
                    </p>
                    <div className='font-medium text-sm text-[#757575] flex items-center'>
                      <span>{n.actorName || 'System'}</span>
                      <Dot className="text-slate-300" />
                      <span>{formatRelativeTime(n.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {!isLoading && notifications.length > 0 && (
            <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
              <span>
                Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalItems)} of {totalItems}
              </span>
              <div className="flex space-x-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p: any) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage >= totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((p: any) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}