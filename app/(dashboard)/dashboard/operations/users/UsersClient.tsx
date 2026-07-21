'use client'

import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import { Search, ArrowLeft, Loader2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  getUsersAction, approveUserAction, rejectUserAction, 
  suspendUserAction, reactivateUserAction   
} from '@/app/actions/users'
import { UserDetails } from '@/components/dashboard/screen/UserDetails'
import LoadiingSpiner from '@/components/LoadiingSpiner'

export type UserRole = 'Forwarders' | 'Truckers' | 'Drivers'

export const StatusPill = ({ status }: { status?: string | null }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>Unknown
      </span>
    );
  }

  const s = status.toUpperCase();
  const formatted = status.replace(/_/g, ' ');
  const displayLabel = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();

  if (s === 'ACTIVE' || s === 'VERIFIED' || s === 'LINKED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F7ED] text-[#01AC4E]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#01AC4E]"></span>{displayLabel}
      </span>
    );
  }
  if (s === 'PENDING_REVIEW' || s === 'IN_REVIEW' || s === 'NOT_LINKED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF8EB] text-[#FFBA2F]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA2F]"></span>{displayLabel}
      </span>
    );
  }
  if (s === 'SUSPENDED' || s === 'REJECTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FDECEB] text-[#EB3A32]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EB3A32]"></span>{displayLabel}
      </span>
    );
  }
  if (s === 'PENDING' || s === 'NOT_STARTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>{displayLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>{displayLabel}
    </span>
  );
}

const StatCard = ({ title, total, today, week, month }: { title: string, total: number, today: number, week: number, month: number }) => (
  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{title}</p>
    <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{total}</h2>
    <div className="space-y-1.5">
      <div className="flex items-center text-[11px] font-medium text-slate-500"><span className="text-[#01AC4E] font-bold mr-2 w-6">+{today}</span> today</div>
      <div className="flex items-center text-[11px] font-medium text-slate-500"><span className="text-[#01AC4E] font-bold mr-2 w-6">+{week}</span> this week</div>
      <div className="flex items-center text-[11px] font-medium text-slate-500"><span className="text-[#01AC4E] font-bold mr-2 w-6">+{month}</span> this month</div>
    </div>
  </div>
)

export default function UsersClient({ initialUsersData }: any) {
  const [activeTab, setActiveTab] = useState<UserRole>('Forwarders');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(initialUsersData?.pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(initialUsersData?.pagination?.totalPages || 1);
  const [totalUsers, setTotalUsers] = useState(initialUsersData?.pagination?.total || 0);
  
  const [users, setUsers] = useState<any[]>(initialUsersData?.users || []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Fallback stats (Replace with `initialUsersData?.stats` if your backend provides it)
  const stats = initialUsersData?.stats || {
    forwarders: { total: 78, today: 3, week: 12, month: 28 },
    truckers: { total: 142, today: 1, week: 5, month: 14 },
    drivers: { total: 220, today: 4, week: 18, month: 42 }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    const roleMap: any = { 'Forwarders': 'forwarders', 'Truckers': 'truckers', 'Drivers': 'drivers' };
    
    const res = await getUsersAction(roleMap[activeTab], { 
      status: activeFilter, 
      search: searchQuery, 
      page: currentPage 
    });
    
    if (res.success) {
      setUsers(res.data.users);
      if (res.data.pagination) {
        setTotalPages(res.data.pagination.totalPages);
        setTotalUsers(res.data.pagination.total);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    const timer = setTimeout(() => { fetchUsers(); }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, activeFilter, searchQuery, currentPage]);

  const handleAction = async (actionFn: Function, id: string) => {
    // If it's a suspension action, we require a reason as per the API spec
    if (actionFn === suspendUserAction) {
      const reason = window.prompt("Enter reason for suspension:");
      if (!reason) return; // Cancelled or empty
      await actionFn(id, reason);
    } else {
      await actionFn(id);
    }
    fetchUsers();
  };

  const renderActions = (row: any) => {
    if (activeTab === 'Forwarders') {
      if (row.status === 'ACTIVE') return (
        <>
          <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button> 
          <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-[#EB3A32] border border-[#EB3A32] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-red-50 transition-colors">Suspend</button>
        </>
      );
      if (row.status === 'SUSPENDED') return (
        <>
          <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button> 
          <button onClick={() => handleAction(reactivateUserAction, row.id)} className="text-[#01AC4E] border border-[#01AC4E] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-green-50 transition-colors">Reactivate</button>
        </>
      );
      if (row.status === 'PENDING_REVIEW' || row.status === 'PENDING') return (
        <>
          <button onClick={() => handleAction(approveUserAction, row.id)} className="text-[#01AC4E] border border-[#01AC4E] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-green-50 transition-colors">Approve</button> 
          <button onClick={() => handleAction(rejectUserAction, row.id)} className="text-[#EB3A32] border border-[#EB3A32] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-red-50 transition-colors">Reject</button>
        </>
      );
      return <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button>;
    }
    
    if (activeTab === 'Truckers') {
      if (row.status === 'PENDING_REVIEW' || row.status === 'PENDING') return (
        <><button onClick={() => handleAction(approveUserAction, row.id)} className="text-[#01AC4E] border border-[#01AC4E] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-green-50 transition-colors">Approve</button> <button onClick={() => handleAction(rejectUserAction, row.id)} className="text-[#EB3A32] border border-[#EB3A32] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-red-50 transition-colors">Reject</button></>
      );
      if (row.status === 'SUSPENDED') return (
        <><button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button> <button onClick={() => handleAction(reactivateUserAction, row.id)} className="text-[#01AC4E] border border-[#01AC4E] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-green-50 transition-colors">Reactivate</button></>
      );
      return ( 
        <><button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button> <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-[#EB3A32] border border-[#EB3A32] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-red-50 transition-colors">Suspend</button></>
      );
    }

    if (activeTab === 'Drivers') {
      if (row.driverStatus === 'NOT_LINKED') return <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button>;
      if (row.driverStatus === 'LINKED') return (
        <><button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button> <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-[#EB3A32] border border-[#EB3A32] rounded-md text-xs font-semibold px-4 py-1.5 hover:bg-red-50 transition-colors">Suspend</button></>
      );
      return <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-xs border border-[#0241E8] rounded-md font-semibold px-4 py-1.5 hover:bg-blue-50 transition-colors">View</button>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <HeaderMenu title='User Management' label='Users' />

      {selectedUserId ? (
        <UserDetails userId={selectedUserId} onBack={() => { setSelectedUserId(null); fetchUsers(); }} />
      ) : (
        <div className='p-6 mx-auto'>
          
          {/* Top Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="TOTAL FORWARDERS" {...stats.forwarders} />
            <StatCard title="TOTAL TRUCKERS" {...stats.truckers} />
            <StatCard title="TOTAL DRIVERS" {...stats.drivers} />
          </div>

          <div className='flex mt-5 border-b border-b-slate-200'>
            {(['Forwarders', 'Truckers', 'Drivers'] as UserRole[]).map(t => (
              <button key={t} 
                onClick={() => { 
                  setActiveTab(t); 
                  setActiveFilter('All'); 
                  setSearchQuery('');
                  setCurrentPage(1); 
                }}
                className={`text-sm font-bold px-4 pb-2 transition-colors ${activeTab === t ? 'text-[#0241E8] border-b-2 border-[#0241E8]' : 'text-[#A1AEBF] border-b-2 border-transparent hover:text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className='my-5 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto custom-scrollbar pb-1">
              <div className='flex bg-white py-1.5 px-3 gap-2 border border-slate-300 rounded-lg w-full sm:w-72 focus-within:border-[#0241E8]'>
                <Search className="text-slate-400 mt-0.5" size={16} />
                <input 
                  type="text" 
                  placeholder='Search name, company...' 
                  value={searchQuery} 
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); 
                  }} 
                  className='flex-1 focus:outline-none text-xs text-slate-700' 
                />
              </div>
              
              <div className='flex items-center gap-2'>
                {['All', 'Active', 'Pending Profile', 'Pending Review', 'Suspended', 'Inactive', 'Banned'].map(f => (
                  <button key={f} 
                    onClick={() => {
                      setActiveFilter(f === 'All' ? 'All' : f.replace(' ', '_').toUpperCase());
                      setCurrentPage(1);
                    }}
                    className={`border h-8 px-4 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${activeFilter === (f === 'All' ? 'All' : f.replace(' ', '_').toUpperCase()) ? 'text-white bg-[#0241E8] border-[#0241E8]' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[400px] flex flex-col overflow-hidden">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#F0F2F5] text-[11px] font-bold text-[#A1AEBF] uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4 px-6">{activeTab === 'Forwarders' ? 'FORWARDER' : 'TRUCKER'}</th>
                    {activeTab === 'Forwarders' && <th className="p-4">PHONE</th>}
                    {activeTab === 'Truckers' && <th className="p-4">TYPE</th>}
                    {activeTab === 'Drivers' && <th className="p-4">LINKED COMPANY</th>}
                    <th className="p-4">JOBS</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4 px-6 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={7} className="p-12 text-center"><LoadiingSpiner/></td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="p-12 text-center text-slate-500">No users found.</td></tr>
                  ) : (
                    users.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0241E8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {row.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{row.name}</p>
                              <p className="text-[11px] text-[#A1AEBF]">{row.email}</p>
                            </div>
                          </div>
                        </td>

                        {activeTab === 'Forwarders' && <td className="p-4 text-[13px] text-slate-600 font-medium">{row.phone || '-'}</td>}
                        
                        {activeTab === 'Truckers' && (
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.truckerType?.toUpperCase() === 'COMPANY' ? 'bg-[#F4F4F5] text-[#52525B]' : 'bg-[#EEF2FF] text-[#4F46E5]'}`}>
                              {row.truckerType ? row.truckerType.charAt(0).toUpperCase() + row.truckerType.slice(1).toLowerCase() : 'Individual'}
                            </span>
                          </td>
                        )}
                        
                        {activeTab === 'Drivers' && (
                          <td className="p-4">
                            {row.linkedCompany ? (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-[#0241E8] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                  {row.linkedCompany.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[13px] font-bold text-slate-900">{row.linkedCompany.name}</p>
                                  <p className="text-[11px] text-[#A1AEBF]">{row.linkedCompany.email}</p>
                                </div>
                              </div>
                            ) : <span className="text-slate-400">-</span>}
                          </td>
                        )}

                        <td className="p-4 text-[13px] font-medium text-slate-800">{row.totalJobs || 0}</td>
                        <td className="p-4"><StatusPill status={activeTab === 'Drivers' ? row.driverStatus : row.status} /></td>
                        <td className="p-4 px-6 text-right space-x-3">{renderActions(row)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!isLoading && users.length > 0 && (
              <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
                <span>
                  Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
                </span>
                <div className="flex space-x-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors text-xs"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}