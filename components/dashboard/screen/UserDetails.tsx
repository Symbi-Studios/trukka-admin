'use client'

import { ArrowLeft, Loader2, FileText, Search, MapPinPlusInside } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserProfileAction } from "@/app/actions/users";
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
    // In a real scenario, this fetches the mapped JSON provided
    const res = await getUserProfileAction(userId);
    if (res.success) setProfile(res.data);
    console.log('detaisl', res.data)
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, [userId]);

  if (loading || !profile) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;
  }

  const role = profile.role; // "FORWARDER", "TRUCKER", "DRIVER"
  const isTrucker = role === 'TRUCKER';
  const isForwarder = role === 'FORWARDER';
  const isDriver = role === 'DRIVER';
  
  // Determine available tabs based on Role (Matches Capture 2.PNG, Capture 5.PNG, Capture 11.PNG)
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
    <div className="p-5  mx-auto font-sans">
      
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
        {activeTab === 'Saved Destinations' && <SavedDestinationsTab />}
        {activeTab === 'Job History' && <JobHistoryTab />}
        {activeTab === 'Transaction History' && <TransactionHistoryTab role={role} />}
        {activeTab === 'Truck & Company Information' && <DetailsTab profile={profile} onOpenModal={setModalType} />} {/* Fallback for driver */}
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
              <InfoRow label="Business Name" value={profile.name} />
              <InfoRow label="Business CAC Number" value={details.company?.cacNumber || '—'} />
              <InfoRow label="Business Address" value={details.company?.address || '—'} />
              <InfoRow label="Tax Identification Number" value={details.company?.tin || '—'} />
              <InfoRow label="Phone Number" value={profile.phone} />
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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-slate-800">Truck information</h3>
          <span className="text-xs font-bold text-[#0241E8] bg-[#E1E9FF] px-3 py-1 rounded-full">{trucks.length} truck{trucks.length !== 1 && 's'}</span>
        </div>
        
        {trucks.map((t: any) => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-[#0241E8] text-lg">{t.plateNumber}</h4>
                <p className="text-sm text-slate-500 mt-1">{t.containerType} • {t.containerSize}</p>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">Approved</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#F8F9FB] rounded-lg p-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Container Weight</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{t.containerWeight} tons</p>
              </div>
              <div className="bg-[#F8F9FB] rounded-lg p-4">
                <p className="text-[11px] font-bold text-slate-500 uppercase">Year</p>
                <p className="text-lg font-bold text-slate-800 mt-1">{t.year}</p>
              </div>
            </div>
          </div>
        ))}
        {trucks.length === 0 && <p className="text-sm text-slate-500">No trucks linked to this account.</p>}
      </div>

      {verification?.driverLicense && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Verification & Information</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-100 px-3 py-1 rounded-full">• Verified</span>
          </div>
          
          <div className="flex justify-between items-center p-4 border border-slate-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-lg text-slate-500">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">Driver's License</p>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">Verified</span>
              </div>
            </div>
            <button className="text-[#0241E8] border border-slate-200 hover:border-[#0241E8] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">View</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder tabs based on images (Job History, Transactions, Destinations)
const JobHistoryTab = () => (
  <div className="bg-white border border-slate-200 rounded-xl">
    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="flex items-center px-3 py-2 border border-slate-300 rounded-lg w-full sm:w-80">
        <Search size={16} className="text-slate-400 mr-2" />
        <input type="text" placeholder="Search job ID, route, trucker..." className="bg-transparent text-sm w-full outline-none" />
      </div>
      <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
        {['All', 'Active', 'Completed', 'Cancelled'].map(f => (
          <button key={f} className={`px-4 py-1.5 text-sm font-bold rounded-md ${f === 'All' ? 'bg-[#0241E8] text-white' : 'text-slate-600 hover:bg-slate-200'}`}>{f}</button>
        ))}
      </div>
    </div>
    <div className="p-10 text-center text-slate-500 text-sm">Table content mapped here (Refer to Capture 3 / 7)</div>
  </div>
);

const TransactionHistoryTab = ({ role }: { role: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-slate-800">Transaction History</h3>
      <span className="text-sm text-slate-500">12 transactions</span>
    </div>
    <div className="space-y-0">
      {/* Example row based on Capture 4 / 8 */}
      <div className="flex justify-between items-center py-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">⇄</div>
           <div>
             <p className="font-bold text-sm text-slate-800">{role === 'FORWARDER' ? 'Wallet Deposit' : 'Earnings Deposit'}</p>
             <p className="text-xs text-slate-400 mt-1">02:53 PM • 9 Jun 2026</p>
           </div>
        </div>
        <span className="font-bold text-slate-900">₦400,000.00</span>
      </div>
    </div>
  </div>
);

const SavedDestinationsTab = () => (
  <div className="bg-white border border-slate-200 rounded-xl p-6">
     <div className="flex justify-between items-center mb-6">
      <h3 className="font-bold text-slate-800">Saved destinations</h3>
      <span className="text-sm text-slate-500">3 saved</span>
    </div>
    {/* Static content based on Capture 2 */}
    <div className="space-y-6">
      <div className="flex gap-3 items-start">
        <div className="mt-1"><MapPinPlusInside /></div>
        <div>
          <p className="font-bold text-sm text-slate-800">Aba Industrial Road</p>
          <p className="text-xs text-slate-500 mt-1">14 Aba Industrial Road, Aba, Abia State</p>
        </div>
      </div>
    </div>
  </div>
);