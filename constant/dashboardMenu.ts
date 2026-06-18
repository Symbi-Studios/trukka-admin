import { 
  LayoutDashboard, Home, BarChart3, 
  Settings2, ClipboardList, Package, Truck,
  Banknote, TrendingUp, TrendingDown, FileText,
  Users, MessageSquare, Share2, Megaphone,
  Lightbulb, PieChart, LineChart, Sparkles,
  Cpu, Settings, UserCog, Terminal, 
  Briefcase,
  CreditCard,
  Bell,
  Cog,
  ScrollText
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
      { label: "Payments", link: "/finance/revenue", icon: CreditCard },
    ]
  },
  {
    title: "Engagements",
    items: [
      { label: "Feedback", link: "/engagements/social", icon: MessageSquare },
    ]
  },
  {
    title: "System",
    items: [
      { label: "Notifications", link: "/system/settings", icon: Bell },
      { label: "Comms Hub", link: "/dashboard/system/users", icon: MessageSquare },
      { label: "Roles & Access", link: "/dashboard/system/row-access", icon: UserCog },
      { label: "Global Settings", link: "/system/logs", icon: Cog }, 
      { label: "Audit Logs", link: "/dashboard/system/logs", icon: ScrollText } 
    ]
  }
];
