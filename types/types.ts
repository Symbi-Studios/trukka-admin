export type UserRole = 'Forwarder' | 'Trucker' | 'Driver';
export type SubRole = 'Individual' | 'Company';
export type UserStatus = 'Active' | 'Linked' | 'Flagged' | 'Suspended' | 'Pending' | 'Not Linked';

export interface Truck {
  id: string;
  plate: string;
  type: string;
  weight: string;
  year: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  completed: boolean;
}

export interface UserDetailData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  subRole?: SubRole; // For Truckers
  status: UserStatus;
  riskScore: 'Low' | 'Medium' | 'High';
  stats: {
    jobsCompleted: number;
    jobsTrend: number;
    openDisputes: number;
    disputesTrend: number;
    financialTotal: string; // e.g., "₦4.2M"
    financialTrend: string;
    financialType: 'Spent' | 'Earned';
  };
  // Role-specific optional data
  trucks?: Truck[];
  recentActivity?: Activity[];
  linkedCompany?: {
    name: string;
    email: string;
  };
  verification?: {
    documentName: string;
    status: 'Verified' | 'Not verified' | 'Incomplete';
  };
}