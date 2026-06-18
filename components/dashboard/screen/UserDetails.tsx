import { StatusPill } from "@/app/(dashboard)/dashboard/operations/users/UsersClient";
import { getUserProfileAction } from "@/app/actions/users";
import { VerificationModal } from "@/components/modals/VerificationModal";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

 const TrendBadge = ({ change }: { change: number }) => {
  if (!change) return null;
  if (change > 0) return <span className="text-green-600 font-medium text-xs">↑ {change.toLocaleString()}</span>;
  return <span className="text-red-600 font-medium text-xs">↓ {Math.abs(change).toLocaleString()}</span>;
}

 const formatMoney = (amount: number) => `₦${(amount || 0).toLocaleString()}`

 const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.toLocaleString('en-US', { month: 'short', day: 'numeric' })} · ${date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
}

export const UserDetails = ({ userId, onBack }: { userId: string; onBack: () => void }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'KYB' | 'License' | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getUserProfileAction(userId);
    if (res.success) setProfile(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, [userId]);

  if (loading || !profile) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

  const isTrucker = profile.role === 'TRUCKER';
  const isDriver = profile.role === 'DRIVER';
  const isForwarder = profile.role === 'FORWARDER';

  console.log('profile', profile)

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-600 mb-6 hover:text-black">
        <ArrowLeft size={16} /> Back to list
      </button>

      {/* First section */}
      <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-[#0241E8] text-white flex items-center justify-center font-bold text-xl">
            {profile.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {profile.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{profile.email} • {profile.phone}</p>
            <div className="flex items-center mt-2 gap-1">
              <StatusPill status={profile.status} />
              <p className="text-[#0241E8] bg-[#E1E9FF] rounded-2xl font-bold text-xs px-2 py-0.5 flex items-center justify-center">{profile.role}</p>
              {isTrucker &&  <p className="text-[#718097] bg-[#EDF4FF] rounded-2xl font-bold text-xs px-2 py-0.5 flex items-center justify-center">{profile.truckerType}</p>}
              {isDriver && profile.driverStatus && <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${profile.driverStatus === 'LINKED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{profile.driverStatus.replace(/_/g, ' ')}</span>}
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col lg:flex-row gap-3">
          <Link href={`/dashboard/support?userId=${profile.id}`}>
            <button className="bg-[#0241E8] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Message</button>
          </Link>
          <button className="text-[#AC0700] border border-[#EB3A32] px-5 py-2 rounded-lg text-sm font-bold">Suspend</button>
        </div>
      </div>

      {/* Second section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Jobs</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{profile.totalJobsCompleted?.count || profile.totalJobs?.count || 0}</h3>
            <TrendBadge change={profile.totalJobsCompleted?.changeThisWeek || profile.totalJobs?.changeThisWeek} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{isForwarder ? 'Total Spent' : 'Total Earned'}</p>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-800">{formatMoney(profile.totalSpent?.amount || profile.totalEarned?.amount)}</h3>
            <TrendBadge change={profile.totalSpent?.changeThisWeek || profile.totalEarned?.changeThisWeek} />
          </div>
        </div>
      </div>

      {/* Third section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Trucks List */}
          {(profile.trucks) && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-b-[#BDBDBD] font-bold text-slate-800">Truck Information</div>
              {profile.trucks.map((t: any) => (
                <div key={t.id} className="p-4 border-b border-b-[#BDBDBD] last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-[#0241E8]">{t.plateNumber}</h5>
                    <StatusPill status={t.status} />
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{t.containerType} · {t.containerSize}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="grid gap-1 bg-[#E8ECF1] p-5 rounded-xl">
                      <span className="text-[#757575] font-bold text-xs">CONTAINER WEIGHT</span>
                      <span className="font-medium text-base text-[#212121]">{t.containerWeight} tons</span>
                    </div>
                    <div className="grid gap-1 bg-[#E8ECF1] p-5 rounded-xl">
                      <span className="text-[#757575] font-bold text-xs">YEAR</span>
                      <span className="font-medium text-base text-[#212121]">{t.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Linked Company for Drivers */}
          {profile.linkedCompany && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Linked Company</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                  {profile.linkedCompany.name.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">{profile.linkedCompany.name}</p>
                  <p className="text-xs text-slate-500">{profile.linkedCompany.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Verification Box */}
          {profile.verification.driverLicense && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 mb-4">Verification & Information</h4>
                <StatusPill status={profile.verification.driverLicense.kycStatus} />
              </div>
              {profile.verification.companyInfo && (
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Company Information</p>
                      <StatusPill status={profile.verification.companyInfo.kycStatus} />
                    </div>
                    
                  </div>
                  <button onClick={() => setModalType('KYB')} className="text-[#0241E8] border border-[#0241E8] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50">View</button>
                </div>
              )}
              {profile.verification.driverLicense && (
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Driver License</p>
                    <div className="mt-1"><StatusPill status={profile.verification.driverLicense.kycStatus} /></div>
                  </div>
                  <button onClick={() => setModalType('License')} className="text-[#0241E8] border border-[#0241E8] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-50">View</button>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity */}
          {profile.recentActivity && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h4 className="font-bold text-slate-800 mb-5">Recent Activity</h4>
              <div className="relative border-l border-slate-200 ml-2 space-y-6">
                {profile.recentActivity.map((act: any, i: number) => (
                  <div key={i} className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-500"></div>
                    <p className="text-sm font-medium text-slate-800">{act.event}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDateTime(act.timestamp)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      
      <VerificationModal type={modalType} userId={userId} onClose={() => setModalType(null)} onRefresh={fetchProfile} />
    </div>
  )
}