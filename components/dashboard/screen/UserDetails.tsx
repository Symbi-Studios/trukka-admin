'use client'

import { ArrowLeft, Loader2, FileText, Search, MapPinPlusInside, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  getUserProfileAction, 
  getUserSavedDestinationsAction, 
  getUserJobsAction, 
  getUserTransactionsAction 
} from "@/app/actions/users";
import { StatusPill } from "@/app/(dashboard)/dashboard/operations/users/UsersClient";
import { VerificationModal } from "@/components/modals/VerificationModal";

// --- Helper Components ---

const TrendBadge = ({ change, label }: { change?: number, label?: string }) => {
  if (change === undefined || change === null) return null;
  const isPositive = change >= 0;
  return (
    <div className="flex items-center gap-1 text-[11px] font-medium mt-2">
      <span className={isPositive ? "text-green-600" : "text-red-600"}>
        {isPositive ? '↑' : '↓'} {Math.abs(change).toLocaleString()}
      </span>
      <span className="text-slate-400">{label || 'this week'}</span>
    </div>
  );
};

const formatMoney = (amount: number) => `₦${(amount || 0).toLocaleString()}`;

const formatDate = (isoString: string) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
};


// --- Custom Job Status Pill ---
const JobStatusPill = ({ status }: { status: string }) => {
  const s = (status || '').toUpperCase();
  
  if (s === 'COMPLETED') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-[#EBF0FF] text-[#0241E8]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0241E8] mr-2"></span>Completed
      </span>
    );
  }
  if (s === 'CANCELLED') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-[#FDECEB] text-[#EB3A32]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EB3A32] mr-2"></span>Cancelled
      </span>
    );
  }
  // Default to Active / On track
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium bg-[#E6F7ED] text-[#01AC4E]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#01AC4E] mr-2"></span>On track
    </span>
  );
};

// Helper for 'Jun 12' date format
const formatShortDate = (isoString?: string) => {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const StatCard = ({ title, value, change, valueClass = "text-slate-900" }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{title}</p>
    <h3 className={`text-3xl font-bold ${valueClass}`}>{value}</h3>
    <TrendBadge change={change} />
  </div>
);

const InfoRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
  <div className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className="text-sm font-bold text-slate-900 text-right">{value || '—'}</span>
  </div>
);

// --- Main Component ---

export const UserDetails = ({ userId, onBack }: { userId: string; onBack: () => void }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('Details');
  const [modalType, setModalType] = useState<'KYB' | 'License' | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getUserProfileAction(userId);
    if (res.success) setProfile(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, [userId]);

  if (loading || !profile) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0241E8] w-8 h-8" /></div>;
  }

  const role = profile.role; // "FORWARDER", "TRUCKER", "DRIVER"
  const isTrucker = role === 'TRUCKER';
  const isForwarder = role === 'FORWARDER';
  const isDriver = role === 'DRIVER';
  
  // Determine available tabs based on Role
  let tabs = ['Details'];
  if (isForwarder) tabs.push('Saved Destinations', 'Job History', 'Transaction History');
  if (isTrucker) tabs.push('Truck Information', 'Job History', 'Transaction History');
  if (isDriver) tabs.push('Truck & Company Information', 'Job History');

  // Stats Data
  const stats = profile.stats || {};
  const wallet = profile.walletBalance || { amount: 0 };
  const totalMoneyTitle = isForwarder ? 'TOTAL SPENT' : 'TOTAL EARNED';
  const totalMoney = profile.totalSpent?.amount || profile.totalEarned?.amount || 0;
  const totalMoneyChange = profile.totalSpent?.changeThisWeek || profile.totalEarned?.changeThisWeek || 0;

  return (
    <div className="p-5 max-w-[1400px] mx-auto font-sans">
      
      {/* Breadcrumb & Back */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-black hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
        <span className="text-sm text-slate-400">
          {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} / <span className="text-slate-600">{profile.name}</span>
        </span>
      </div>

      {/* Header Profile Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#0241E8] text-white flex items-center justify-center font-bold text-2xl shrink-0">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <StatusPill status={profile.status} />
              <span className="text-[#0241E8] bg-[#E1E9FF] rounded-full font-bold text-xs px-3 py-1">{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</span>
              {isTrucker && profile.truckerType && (
                <span className="text-slate-600 bg-slate-100 rounded-full font-bold text-xs px-3 py-1">
                  {profile.truckerType.charAt(0).toUpperCase() + profile.truckerType.slice(1).toLowerCase()}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">{profile.email}</p>
            <p className="text-xs text-slate-400 mt-2">
              Joined {formatDate(profile.joinedAt).split(',')[0]} • Last login: {profile.lastLoginAt ? formatDate(profile.lastLoginAt) : 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href={`/dashboard/support?userId=${profile.id}`} className="flex-1 md:flex-none">
            <button className="w-full bg-[#0241E8] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Message</button>
          </Link>
          <button className="flex-1 md:flex-none text-[#AC0700] border border-[#EB3A32] px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">Suspend</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="TOTAL JOBS" value={stats.totalJobs?.count || 0} change={stats.totalJobs?.changeThisWeek} />
        <StatCard title="FAILED JOBS" value={stats.failedJobs?.count || 0} change={stats.failedJobs?.changeThisWeek} valueClass="text-[#EB3A32]" />
        <StatCard title={totalMoneyTitle} value={formatMoney(totalMoney)} change={totalMoneyChange} />
        <StatCard title="WALLET BALANCE" value={formatMoney(wallet.amount)} change={0} />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 mb-6 flex gap-6 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab ? 'text-[#0241E8] border-[#0241E8]' : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="mb-10">
        {activeTab === 'Details' && <DetailsTab profile={profile} onOpenModal={setModalType} />}
        {activeTab === 'Truck Information' && <TruckInfoTab trucks={profile.trucks || []} verification={profile.verification} />}
        {activeTab === 'Saved Destinations' && <SavedDestinationsTab userId={userId} />}
        {activeTab === 'Job History' && <JobHistoryTab userId={userId} role={role} />}
        {activeTab === 'Transaction History' && <TransactionHistoryTab userId={userId} role={role} />}
        {activeTab === 'Truck & Company Information' && <DetailsTab profile={profile} onOpenModal={setModalType} />}
      </div>

      <VerificationModal type={modalType} userId={userId} onClose={() => setModalType(null)} onRefresh={fetchProfile} />
    </div>
  );
};

// --- Tab Sub-Components ---

const DetailsTab = ({ profile, onOpenModal }: { profile: any, onOpenModal: (type: any) => void }) => {
  const details = profile.details || {};
  const personal = details.personal || {};
  const account = details.account || {};
  const isCompany = profile.truckerType === 'COMPANY';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal / Company Info Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="font-bold text-slate-800 mb-2">{isCompany ? 'Company Information' : 'Personal Information'}</h3>
        <div className="mt-4">
          {isCompany ? (
            <>
              <InfoRow label="Business Name" value={details.company?.businessName || profile.name} />
              <InfoRow label="Business CAC Number" value={details.company?.cacNumber || '—'} />
              <InfoRow label="Business Address" value={details.company?.businessAddress || '—'} />
              <InfoRow label="Tax Identification Number" value={details.company?.taxId || '—'} />
              <InfoRow label="Phone Number" value={details.company?.phone || profile.phone} />
            </>
          ) : (
            <>
              <InfoRow label="First name" value={personal.firstName} />
              <InfoRow label="Middle name" value={personal.middleName || '—'} />
              <InfoRow label="Last name" value={personal.lastName} />
              <InfoRow label="Date of birth" value={personal.dateOfBirth ? formatDate(personal.dateOfBirth).split(',')[0] : '—'} />
              <InfoRow label="Phone number" value={profile.phone} />
            </>
          )}
        </div>
      </div>

      {/* Account Info Box */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-2">Account Information</h3>
        <div className="mt-4 flex-1">
          <InfoRow label="Account type" value={account.accountType || profile.role} />
          <InfoRow label="Date joined" value={formatDate(profile.joinedAt)} />
          <InfoRow label="Last Login" value={profile.lastLoginAt ? formatDate(profile.lastLoginAt) : '—'} />
          <InfoRow label="Account status" value={<span className="text-slate-900">{profile.status.charAt(0).toUpperCase() + profile.status.slice(1).toLowerCase()}</span>} />
        </div>
      </div>
    </div>
  );
};

const TruckInfoTab = ({ trucks, verification }: { trucks: any[], verification?: any }) => {
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Truck List Section */}
      <div className="lg:col-span-2">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-[14px]">Truck information</h3>
            <span className="text-xs font-bold text-[#0241E8] bg-[#EBF0FF] px-3 py-1 rounded-full">
              {trucks.length} truck{trucks.length !== 1 && 's'}
            </span>
          </div>
          
          {/* Truck Items */}
          <div className="divide-y divide-slate-100">
            {trucks.map((t: any) => (
              <div key={t.id} className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-[#0241E8] text-[15px] tracking-wide">
                    {t.plateNumber}
                  </h4>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                    t.status === 'APPROVED' || !t.status 
                      ? 'text-[#01AC4E] bg-[#E6F7ED]' 
                      : 'text-amber-600 bg-amber-50'
                  }`}>
                    {t.status ? t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase() : 'Approved'}
                  </span>
                </div>
                
                <p className="text-[13px] text-slate-500 font-medium mb-4">
                  {t.containerType || 'Container Truck'} • {t.containerSize || '40ft'}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#EEF1F6] rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Container Weight
                    </p>
                    <p className="text-[14px] font-medium text-slate-900 mt-1.5">
                      {t.containerWeight || '30'} tons
                    </p>
                  </div>
                  <div className="bg-[#EEF1F6] rounded-xl p-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Year
                    </p>
                    <p className="text-[14px] font-medium text-slate-900 mt-1.5">
                      {t.year || '2018'}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {trucks.length === 0 && (
              <p className="text-sm text-slate-500 p-8 text-center">No trucks linked to this account.</p>
            )}
          </div>

        </div>
      </div>

      {/* Verification Sidebar */}
      {verification?.kycStatus && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-[14px]">Verification & Information</h3>
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
              verification.kycStatus === 'VERIFIED' 
                ? 'text-[#01AC4E] bg-[#E6F7ED]' 
                : 'text-amber-600 bg-amber-50'
            }`}>
              • {verification.kycStatus}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-lg text-slate-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-[13px] text-slate-800">Driver’s License</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${
                  verification.kycStatus === 'VERIFIED' 
                    ? 'text-[#01AC4E] bg-[#E6F7ED]' 
                    : 'text-amber-600 bg-amber-50'
                }`}>
                  {verification.kycStatus}
                </span>
              </div>
            </div>
            {/* Added onClick handler to open modal */}
            <button 
              onClick={() => setIsDocModalOpen(true)}
              className="text-[#0241E8] border border-slate-200 hover:border-[#0241E8] hover:bg-blue-50 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* --- Simple Document Modal --- */}
      {isDocModalOpen && verification?.driverLicense && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Driver's License</h2>
              <button 
                onClick={() => setIsDocModalOpen(false)} 
                className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Image & Details) */}
            <div className="p-6 bg-slate-50 space-y-4">
              <div className="w-full h-auto max-h-[60vh] overflow-hidden rounded-xl border border-slate-200 bg-white flex justify-center items-center">
                <img 
                  src={verification.driverLicense.licenseUrl} 
                  alt="Driver License Document" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">License Number:</span>
                <span className="text-sm font-bold text-slate-900">
                  {verification.driverLicense.licenseNumber || 'N/A'}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const JobHistoryTab = ({ userId, role }: { userId: string; role: string }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    const res = await getUserJobsAction(userId, { tab: filter, page });
    if (res.success && res.data) {
      setJobs(res.data.jobs || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [userId, filter, page]);

  // Dynamically show the counterparty column based on the profile we are viewing
  const counterpartyHeader = role === 'FORWARDER' ? 'TRUCKER' : 'FORWARDER';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      
      {/* Search & Filters */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center px-3 py-2 border border-slate-200 rounded-lg w-full sm:max-w-md focus-within:border-[#0241E8] transition-colors">
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search job ID, route, trucker..." 
            className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full sm:w-auto">
          {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
            <button 
              key={f} 
              onClick={() => { setFilter(f); setPage(1); }}
              className={`px-4 py-1.5 text-sm font-bold rounded-full border whitespace-nowrap transition-colors ${
                f === filter 
                  ? 'bg-[#0241E8] text-white border-[#0241E8]' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-[#F8FAFC] text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4 px-6">JOB ID</th>
              <th className="p-4">{counterpartyHeader}</th>
              <th className="p-4">ROUTE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">COMPLETION DATE</th>
              <th className="p-4 px-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={6} className="p-10 text-center"><Loader2 className="animate-spin text-[#0241E8] w-6 h-6 mx-auto" /></td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-sm text-slate-500">No jobs found.</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.jobId} className="hover:bg-slate-50/50 transition-colors">
                  {/* Ensure Job ID has the '#' prefix as shown in the design */}
                  <td className="p-4 px-6 font-bold text-[#0241E8] text-sm">
                    {job.jobId.startsWith('#') ? job.jobId : `#${job.jobId}`}
                  </td>
                  
                  {/* Show the correct counterparty name */}
                  <td className="p-4 text-sm text-slate-800 font-medium">
                    {role === 'FORWARDER' ? job.trucker : job.forwarder}
                  </td>
                  
                  <td className="p-4 text-sm text-slate-800 truncate max-w-[200px]" title={job.route}>
                    {job.route}
                  </td>
                  
                  <td className="p-4">
                    <JobStatusPill status={job.status} />
                  </td>
                  
                  <td className="p-4 text-sm text-slate-800">
                    {formatShortDate(job.completionDate || job.createdAt)}
                  </td>
                  
                  <td className="p-4 px-6 text-center">
                    <button className="px-4 py-1.5 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#0241E8] hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {!loading && jobs.length > 0 && (
        <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-white">
          <span>Page {page} of {totalPages}</span>
          <div className="flex space-x-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const TransactionHistoryTab = ({ userId, role }: { userId: string, role: string }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await getUserTransactionsAction(userId, { page });
    if (res.success && res.data) {
      setTransactions(res.data.transactions || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotal(res.data.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, [userId, page]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Transaction History</h3>
        <span className="text-sm text-slate-500">{total} transactions</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0241E8] w-6 h-6" /></div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-6">No transactions found.</p>
      ) : (
        <div className="space-y-0">
          {transactions.map(txn => (
            <div key={txn.id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold">⇄</div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{txn.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(txn.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 block">{formatMoney(txn.amount)}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block ${txn.status === 'COMPLETED' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>{txn.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex space-x-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white font-medium transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

const SavedDestinationsTab = ({ userId }: { userId: string }) => {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchDestinations = async () => {
    setLoading(true);
    const res = await getUserSavedDestinationsAction(userId);
    if (res.success && res.data) {
      setDestinations(res.data.destinations || []);
      setTotal(res.data.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchDestinations(); }, [userId]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
       <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Saved destinations</h3>
        <span className="text-sm text-slate-500">{total} saved</span>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#0241E8] w-6 h-6" /></div>
      ) : destinations.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-6">No saved destinations found.</p>
      ) : (
        <div className="space-y-6">
          {destinations.map(dest => (
            <div key={dest.id} className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="mt-1 text-slate-400"><MapPinPlusInside size={20} /></div>
              <div>
                <p className="font-bold text-sm text-slate-800">{dest.label}</p>
                <p className="text-xs text-slate-500 mt-1">{dest.address}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Added {formatDate(dest.createdAt).split(',')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};