import { getCompanyInfoAction, getLicenseInfoAction, reviewKybAction, reviewLicenseAction } from "@/app/actions/users";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export const VerificationModal = ({ type, userId, onClose, onRefresh }: { type: 'KYB' | 'License' | null, userId: string, onClose: () => void, onRefresh: () => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type) return;
    setLoading(true);
    const fetcher = type === 'KYB' ? getCompanyInfoAction : getLicenseInfoAction;
    fetcher(userId).then(res => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, [type, userId]);

  const handleDecision = async (decision: 'approve' | 'reject') => {
    let reason = '';
    if (decision === 'reject') {
      reason = window.prompt("Enter reason for rejection:") || '';
      if (!reason) return;
    }
    const action = type === 'KYB' ? reviewKybAction : reviewLicenseAction;
    const res = await action(userId, decision, reason);
    if (res.success) {
      onRefresh();
      onClose();
    }
  };

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-b-[#BDBDBD] flex justify-between items-center">
          <h2 className="font-bold text-lg">{type === 'KYB' ? 'Company Information' : 'Driver License Review'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
        </div>
        <div className="p-5">
          {loading ? <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div> : (
            <div className="space-y-4">
              {type === 'KYB' ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500 font-bold uppercase text-xs">Business Name</p><p className="font-medium">{data.businessName}</p></div>
                  <div><p className="text-gray-500 font-bold uppercase text-xs">CAC Number</p><p className="font-medium">{data.cacNumber}</p></div>
                  <div><p className="text-gray-500 font-bold uppercase text-xs">Tax ID</p><p className="font-medium">{data.taxId}</p></div>
                  <div className="col-span-2"><p className="text-gray-500 font-bold uppercase text-xs">Address</p><p className="font-medium">{data.businessAddress}</p></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-gray-500 font-bold uppercase text-xs">License Number</p><p className="font-medium">{data.licenseNumber}</p></div>
                    <div><p className="text-gray-500 font-bold uppercase text-xs">Expires At</p><p className="font-medium">{new Date(data.licenseExpiresAt).toLocaleDateString()}</p></div>
                  </div>
                  {data.licenseUrl && (
                    <div className="h-48 relative bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden">
                      <iframe src={data.licenseUrl} className="w-full h-full" title="License" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {data?.kycStatus === 'IN_REVIEW' && (
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <button onClick={() => handleDecision('reject')} className="px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded-lg bg-white hover:bg-red-50">Reject</button>
            <button onClick={() => handleDecision('approve')} className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">Approve</button>
          </div>
        )}
      </div>
    </div>
  )
}