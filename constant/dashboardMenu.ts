import {  Home,  FileText,
  Users, MessageSquare, UserCog, 
  Briefcase,
  CreditCard,
  Bell,
  Cog,
  ScrollText,
  Download
} from 'lucide-react';

export const dashboard_menu = [
  {
    title: "Overview",
    items: [
      { label: "Overview", link: "/dashboard", icon: Home },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Job Monitoring", link: "/dashboard/operations/job-monitoring", icon: Briefcase }, 
      { label: "Doc Review", link: "/dashboard/operations/doc-review", icon: FileText }, 
      { label: "Users", link: "/dashboard/operations/users", icon: Users }, 
    ]
  },
  {
    title: "Finance",
    items: [
      { label: "Payments", link: "/dashboard/finance/payments", icon: CreditCard },
      { label: "Payouts", link: "/dashboard/finance/payouts", icon: Download },
    ]
  },
  {
    title: "Engagements",
    items: [
      { label: "Feedback", link: "/dashboard/engagement/feedbacks", icon: MessageSquare },
    ]
  },
  {
    title: "System",
    items: [
      { label: "Notifications", link: "/dashboard/system/notification", icon: Bell },
      { label: "Support", link: "/dashboard/system/support", icon: MessageSquare },
      { label: "Roles & Access", link: "/dashboard/system/row-access", icon: UserCog },
      { label: "Global Settings", link: "/dashboard/system/global-settings", icon: Cog }, 
      { label: "Audit Logs", link: "/dashboard/system/logs", icon: ScrollText } 
    ]
  }
];
