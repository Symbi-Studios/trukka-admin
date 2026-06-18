'use client'

import { HeaderMenu } from '@/components/layouts/HeaderMenu'
import { Search, ArrowLeft, Loader2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { 
  getUsersAction, approveUserAction, rejectUserAction, 
  suspendUserAction, reactivateUserAction   
} from '@/app/actions/users'
import { UserDetails } from '@/components/dashboard/screen/UserDetails'

export type UserRole = 'Forwarders' | 'Truckers' | 'Drivers'


export const StatusPill = ({ status }: { status?: string | null }) => {
  if (!status) {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">UNKNOWN</span>;
  }

  const s = status.toUpperCase();
  const formatted = status.replace(/_/g, ' '); 

  if (s === 'ACTIVE' || s === 'VERIFIED' || s === 'LINKED') {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">{formatted}</span>;
  }
  if (s === 'PENDING_REVIEW' || s === 'IN_REVIEW' || s === 'NOT_LINKED') {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600 border border-orange-100">{formatted}</span>;
  }
  if (s === 'SUSPENDED' || s === 'REJECTED') {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">{formatted}</span>;
  }
  if (s === 'NOT_STARTED') {
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">{formatted}</span>;
  }

  return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{formatted}</span>;
}



// ==========================================
// MAIN COMPONENT
// ==========================================
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
    await actionFn(id);
    fetchUsers();
  };

  const renderActions = (row: any) => {
    if (activeTab === 'Forwarders') {
      if (row.status === 'ACTIVE') return (
        <>
          <button onClick={() => setSelectedUserId(row.id)} className="text-[#0241E8] text-sm border-[#0241E8] border font-semibold px-3 py-1">View</button> 
          <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-[#EB3A32] border-[#EB3A32] border text-sm font-semibold px-3 py-1">Suspend</button>
        </>
      );
      if (row.status === 'SUSPENDED') return (
        <>
          <button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 text-sm font-semibold hover:underline">View</button> 
          <button onClick={() => handleAction(reactivateUserAction, row.id)} className="text-[#00652D]  border-[#00652D] border text-sm font-semibold px-3 py-1">Reactivate</button>
        </>
      );
      if (row.status === 'PENDING_REVIEW') return <button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 font-semibold px-3 py-1">View</button>;
    }
    
    if (activeTab === 'Truckers') {
      if (row.status === 'PENDING_REVIEW') return (
        <><button onClick={() => handleAction(approveUserAction, row.id)} className="text-green-600 font-semibold hover:underline">Approve</button> <button onClick={() => handleAction(rejectUserAction, row.id)} className="text-red-600 font-semibold hover:underline">Reject</button></>
      );
      if (row.status === 'SUSPENDED') return (
        <><button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 font-semibold hover:underline">View</button> <button onClick={() => handleAction(reactivateUserAction, row.id)} className="text-green-600 font-semibold hover:underline">Reactivate</button></>
      );
      return ( 
        <><button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 font-semibold hover:underline">View</button> <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-red-600 font-semibold hover:underline">Suspend</button></>
      );
    }

    if (activeTab === 'Drivers') {
      if (row.driverStatus === 'NOT_LINKED') return <button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 font-semibold hover:underline">View</button>;
      if (row.driverStatus === 'LINKED') return (
        <><button onClick={() => setSelectedUserId(row.id)} className="text-blue-600 font-semibold hover:underline">View</button> <button onClick={() => handleAction(suspendUserAction, row.id)} className="text-red-600 font-semibold hover:underline">Suspend</button></>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      <HeaderMenu title='User Management' label='Users' />

      {selectedUserId ? (
        <UserDetails userId={selectedUserId} onBack={() => { setSelectedUserId(null); fetchUsers(); }} />
      ) : (
        <div className='p-5 mx-auto'>
          
          <div className='flex mt-5 border-b border-b-slate-200'>
            {(['Forwarders', 'Truckers', 'Drivers'] as UserRole[]).map(t => (
              <button key={t} 
                onClick={() => { 
                  setActiveTab(t); 
                  setActiveFilter('All'); 
                  setSearchQuery('');
                  setCurrentPage(1); 
                }}
                className={`text-sm font-bold px-4 pb-2 transition-colors ${activeTab === t ? 'text-[#0241E8] border-b-2 border-[#0241E8]' : 'text-slate-400 border-b-2 border-transparent hover:text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className='my-5 flex flex-col sm:flex-row items-center gap-4'>
            <div className='flex bg-white p-2 gap-2 border border-slate-300 rounded-lg w-full sm:w-80 focus-within:border-[#0241E8]'>
              <Search className="text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder='Search users...' 
                value={searchQuery} 
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset pagination on search
                }} 
                className='flex-1 focus:outline-none text-sm' 
              />
            </div>
            
            <div className='flex items-center gap-2 overflow-x-auto custom-scrollbar w-full pb-1'>
              {['All', 'ACTIVE', 'PENDING_REVIEW', 'SUSPENDED'].map(f => (
                <button key={f} 
                  onClick={() => {
                    setActiveFilter(f);
                    setCurrentPage(1); // Reset pagination on filter change
                  }}
                  className={`border h-8 px-4 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeFilter === f ? 'text-white bg-[#0241E8] border-[#0241E8]' : 'text-slate-600 bg-white border-slate-300 hover:bg-slate-50'}`}>
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[400px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4 px-6">User</th>
                    {activeTab === 'Forwarders' && <th className="p-4">Phone</th>}
                    {activeTab === 'Truckers' && <th className="p-4">Type</th>}
                    {activeTab === 'Drivers' && <th className="p-4">Linked Company</th>}
                    <th className="p-4">Total Jobs</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={7} className="p-12 text-center"><Loader2 className="animate-spin text-blue-600 h-8 w-8 mx-auto" /></td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={7} className="p-12 text-center text-slate-500">No users found.</td></tr>
                  ) : (
                    users.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-[#0241E8] text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {row.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{row.name}</p>
                              <p className="text-xs text-slate-500">{row.email}</p>
                            </div>
                          </div>
                        </td>

                        {activeTab === 'Forwarders' && <td className="p-4 text-sm text-slate-600 font-medium">{row.phone}</td>}
                        {activeTab === 'Truckers' && (
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${row.truckerType === 'COMPANY' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                              {row.truckerType}
                            </span>
                          </td>
                        )}
                        {activeTab === 'Drivers' && (
                          <td className="p-4">
                            {row.linkedCompany ? (
                              <div>
                                <p className="text-sm font-bold text-slate-800">{row.linkedCompany.name}</p>
                                <p className="text-[11px] text-slate-500">{row.linkedCompany.email}</p>
                              </div>
                            ) : <span className="text-slate-400">-</span>}
                          </td>
                        )}

                        <td className="p-4 text-sm font-bold text-slate-700">{row.totalJobs}</td>
                        <td className="p-4"><StatusPill status={activeTab === 'Drivers' ? row.driverStatus : row.status} /></td>
                        <td className="p-4 px-6 text-right text-sm space-x-3">{renderActions(row)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!isLoading && users.length > 0 && (
              <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 rounded-b-xl">
                <span>
                  Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalUsers)} of {totalUsers} users
                </span>
                <div className="flex space-x-2">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={currentPage >= totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
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