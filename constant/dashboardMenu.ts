import { 
  LayoutDashboard, Home, BarChart3, 
  Settings2, ClipboardList, Package, Truck,
  Banknote, TrendingUp, TrendingDown, FileText,
  Users, MessageSquare, Share2, Megaphone,
  Lightbulb, PieChart, LineChart, Sparkles,
  Cpu, Settings, UserCog, Terminal 
} from 'lucide-react';

export const dashboard_menu = [
  {
    title: "Overview",
    items: [
      { label: "Overview", link: "/dashboard/main", icon: Home },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "Job Monitoring", link: "/operations/tasks", icon: ClipboardList },
      { label: "Users", link: "/operations/inventory", icon: Package },
      { label: "Disputes", link: "/operations/logistics", icon: Truck },
      { label: "Support & Safety ", link: "/operations/logistics", icon: Truck }
    ]
  },
  {
    title: "Finance",
    items: [
      { label: "Payments", link: "/finance/revenue", icon: TrendingUp },
      { label: "Pricing & Rates", link: "/finance/expenses", icon: TrendingDown },
    ]
  },
  {
    title: "Engagements",
    items: [
      { label: "Promotions", link: "/engagements/feedback", icon: MessageSquare },
      { label: "Feedback", link: "/engagements/social", icon: Share2 },
    ]
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", link: "/insights/analytics", icon: PieChart },
    ]
  },
  {
    title: "System",
    items: [
      { label: "Notifications", link: "/system/settings", icon: Settings },
      { label: "Push Notifications", link: "/system/users", icon: UserCog },
      { label: "Roles & Access", link: "/system/logs", icon: Terminal },
      { label: "Global Settings", link: "/system/logs", icon: Terminal },
      { label: "Audit Logs", link: "/system/logs", icon: Terminal }
    ]
  }
];
