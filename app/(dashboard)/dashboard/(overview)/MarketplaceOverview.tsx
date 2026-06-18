'use client'

import React from 'react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Link from 'next/link';

// --- Types ---
type KpiVariant = 'trend' | 'check' | 'warning' | 'static';

interface JOBCARD {
  title: string;
  value: string | number;
  trend?: number;
  trendText: string;
  isPositive?: boolean;
  isPercentage?: boolean;
  variant: KpiVariant;
}

interface UserTrend {
  label: string;
  delta: number;
}

interface UserCard {
  title: string;
  value: number;
  trends: UserTrend[];
}

interface JobData {
  day: string;
  jobs: number;
}

interface PerformanceData {
  name: string;
  value: number;
  color: string;
}

interface RecentJob {
  id: string;
  jobNumber: string;
  route: string;
  truckerName: string | null;
  status: string;
  statusLabel: string;
}

interface HealthMetric {
  label: string;
  value: number | string;
  progress?: number;
  colorClass?: string;
  isCurrency?: boolean;
}

interface MarketplaceOverviewProps {
  initialData: any;
}

// --- Formatting Helpers ---
const formatCurrency = (value: number) => {
  if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₦${(value / 1000).toFixed(1)}K`;
  return `₦${value.toLocaleString()}`;
};

const getShortDay = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default function MarketplaceOverview({ initialData }: MarketplaceOverviewProps) {

  // Guard clause against missing server data
  if (!initialData) {
    return (
      <div className="min-h-screen bg-slate-100/50 pb-10">
        <HeaderMenu title="Marketplace Overview" label="Overview" />
        <div className="p-6 text-center text-slate-500 font-medium">
          Failed to load dashboard statistics. Please refresh the page.
        </div>
      </div>
    );
  }

  // Destructure matching your API response
  const {
    jobs,
    users,
    weeklyJobVolume,
    deliveryPerformance,
    recentJobs: apiRecentJobs,
    marketplaceHealth
  } = initialData;

  // 1. JOBS KPI cards — 8 cards, 4 different footer "variants" to match the design:
  //    trend   -> arrow + %/count vs a period (green/red)
  //    check   -> checkmark + "today" sub-stat (Completed Jobs)
  //    warning -> clock + ₦ figure (Delayed/Demurrage)
  //    static  -> plain muted caption, no icon (Docs Pending)
  const JobsData: JOBCARD[] = [
    {
      title: 'TOTAL JOBS',
      value: jobs?.totalJobs || 0,
      trend: Math.abs(jobs?.totalJobsTrendPercent || 0),
      trendText: 'this month',
      isPositive: (jobs?.totalJobsTrendPercent || 0) >= 0,
      isPercentage: true,
      variant: 'trend',
    },
    {
      title: 'ACTIVE JOBS',
      value: jobs?.activeJobs || 0,
      trend: Math.abs(jobs?.activeJobsTrendPercent || 0),
      trendText: 'vs last week',
      isPositive: (jobs?.activeJobsTrendPercent || 0) >= 0,
      isPercentage: true,
      variant: 'trend',
    },
    {
      title: 'COMPLETED JOBS',
      value: jobs?.completedJobs || 0,
      trendText: `${jobs?.completedToday || 0} completed today`,
      variant: 'check',
    },
    {
      title: 'CANCELLED JOBS',
      value: jobs?.cancelledJobs || 0,
      trend: Math.abs(jobs?.cancelledThisWeek || 0),
      trendText: 'this week',
      isPositive: (jobs?.cancelledThisWeek || 0) <= 0,
      variant: 'trend',
    },
    {
      title: 'DELAYED/DEMURRAGE',
      value: jobs?.delayedAtRisk || 0,
      trendText: `${formatCurrency(jobs?.demurrageRevenueMonth || 0)} demurrage this month`,
      variant: 'warning',
    },
    {
      title: 'PLATFORM REVENUE',
      value: formatCurrency(jobs?.platformRevenueMonth || 0),
      trend: Math.abs(jobs?.revenueTrendPercent || 0),
      trendText: 'this month',
      isPositive: (jobs?.revenueTrendPercent || 0) >= 0,
      isPercentage: true,
      variant: 'trend',
    },
    {
      title: 'OPEN TICKETS',
      value: jobs?.openTickets || 0,
      trend: Math.abs(jobs?.needActionTickets || 0),
      trendText: 'need action',
      isPositive: (jobs?.needActionTickets || 0) <= 0,
      variant: 'trend',
    },
    {
      title: 'DOCS PENDING',
      value: jobs?.docsPending || 0,
      trendText: 'Awaiting admin review',
      variant: 'static',
    },
  ];

  // 2. USERS KPI cards — design shows three stacked deltas (today / this week / this month)
  //    per card, which matches the todayDelta/weekDelta/monthDelta shape in the response.
  const UsersData: UserCard[] = [
    {
      title: 'TOTAL FORWARDERS',
      value: users?.forwarders?.total || 0,
      trends: [
        { label: 'today', delta: users?.forwarders?.todayDelta || 0 },
        { label: 'this week', delta: users?.forwarders?.weekDelta || 0 },
        { label: 'this month', delta: users?.forwarders?.monthDelta || 0 },
      ],
    },
    {
      title: 'TOTAL TRUCKERS',
      value: users?.truckers?.total || 0,
      trends: [
        { label: 'today', delta: users?.truckers?.todayDelta || 0 },
        { label: 'this week', delta: users?.truckers?.weekDelta || 0 },
        { label: 'this month', delta: users?.truckers?.monthDelta || 0 },
      ],
    },
    {
      title: 'TOTAL DRIVERS',
      value: users?.drivers?.total || 0,
      trends: [
        { label: 'today', delta: users?.drivers?.todayDelta || 0 },
        { label: 'this week', delta: users?.drivers?.weekDelta || 0 },
        { label: 'this month', delta: users?.drivers?.monthDelta || 0 },
      ],
    },
  ];

  // 3. Bar Chart Data
  const jobVolumeData: JobData[] = (weeklyJobVolume || []).map((item: any) => ({
    day: getShortDay(item.date),
    jobs: item.count
  }));

  // 4. Donut Chart Data
  const performanceData: PerformanceData[] = [
    { name: 'On-time', value: deliveryPerformance?.onTime || 0, color: '#16a34a' },
    { name: 'Minor delay', value: deliveryPerformance?.minorDelay || 0, color: '#eab308' },
    { name: 'Critical', value: deliveryPerformance?.critical || 0, color: '#ef4444' },
  ];

  // 5. Recent Jobs Table
  const recentJobs: RecentJob[] = (apiRecentJobs || []).map((job: any) => ({
    id: job.id,
    jobNumber: job.jobNumber,
    route: job.route || 'Unknown Route',
    truckerName: job.truckerName || '-',
    status: job.status,
    statusLabel: job.statusLabel || 'On track'
  }));

  // 6. Marketplace Health — the two "active user" bars are counts, not percentages, so they're
  //    normalized against each other (the larger of the two reads as a full-width bar), while the
  //    two rate bars use their literal percentage value, matching the design's proportions.
  const maxActiveUsers = Math.max(
    marketplaceHealth?.activeForwarders || 0,
    marketplaceHealth?.activeTruckOwners || 0,
    1
  );

  const healthMetrics: HealthMetric[] = [
    {
      label: 'Active Forwarders',
      value: marketplaceHealth?.activeForwarders || 0,
      progress: ((marketplaceHealth?.activeForwarders || 0) / maxActiveUsers) * 100,
      colorClass: 'bg-blue-600',
    },
    {
      label: 'Active Truck Owners',
      value: marketplaceHealth?.activeTruckOwners || 0,
      progress: ((marketplaceHealth?.activeTruckOwners || 0) / maxActiveUsers) * 100,
      colorClass: 'bg-blue-600',
    },
    {
      label: 'Trucker Acceptance Rate',
      value: `${marketplaceHealth?.truckerAcceptanceRate || 0}%`,
      progress: marketplaceHealth?.truckerAcceptanceRate || 0,
      colorClass: 'bg-emerald-500',
    },
    {
      label: 'Forwarder Repeat Rate',
      value: `${marketplaceHealth?.forwarderRepeatRate || 0}%`,
      progress: marketplaceHealth?.forwarderRepeatRate || 0,
      colorClass: 'bg-emerald-500',
    },
    {
      label: 'Escrow balance',
      value: formatCurrency(marketplaceHealth?.escrowBalance || 0),
      isCurrency: true,
    },
  ];

  const getBadgeStyles = (statusLabel: string) => {
    switch (statusLabel?.toLowerCase()) {
      case 'on track': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'at risk': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'delayed': return 'bg-red-50 text-red-600 border-red-100';
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getDotColor = (statusLabel: string) => {
    switch (statusLabel?.toLowerCase()) {
      case 'on track': return 'bg-emerald-500';
      case 'at risk': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/50 pb-10">
      <HeaderMenu title="Marketplace Overview" label="Overview" />

      <div className="p-6 mx-auto space-y-6">

        {/* Jobs Cards */}
        <div>
          <p className='font-bold text-xs text-[#4A5567] mb-2'>JOBS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {JobsData.map((kpi, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                  {kpi.title}
                </h3>
                <div className="text-3xl font-bold text-slate-800 mb-3">
                  {kpi.value}
                </div>

                {kpi.variant === 'trend' && (
                  <div className="flex items-center text-xs font-medium">
                    <span className={`flex items-center ${kpi.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {kpi.isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                      {kpi.trend}{kpi.isPercentage ? '%' : ''}
                    </span>
                    <span className="text-slate-500 ml-1.5">{kpi.trendText}</span>
                  </div>
                )}

                {kpi.variant === 'check' && (
                  <div className="flex items-center text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={14} className="mr-1.5" />
                    <span>{kpi.trendText}</span>
                  </div>
                )}

                {kpi.variant === 'warning' && (
                  <div className="flex items-center text-xs font-medium text-amber-600">
                    <Clock size={14} className="mr-1.5" />
                    <span>{kpi.trendText}</span>
                  </div>
                )}

                {kpi.variant === 'static' && (
                  <div className="flex items-center text-xs font-medium text-slate-400">
                    <span>{kpi.trendText}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Users Cards Grid */}
        <div>
          <p className='font-bold text-xs text-[#4A5567] mb-2'>USERS</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {UsersData.map((card, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-2">
                  {card.title}
                </h3>
                <div className="text-3xl font-bold text-slate-800 mb-3">
                  {card.value}
                </div>
                <div className="space-y-1">
                  {card.trends.map((t, i) => (
                    <div key={i} className="flex items-center text-xs font-medium">
                      <span className={`flex items-center ${t.delta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.delta >= 0 ? <ArrowUpRight size={12} className="mr-0.5" /> : <ArrowDownRight size={12} className="mr-0.5" />}
                        {t.delta >= 0 ? '+' : ''}{t.delta}
                      </span>
                      <span className="text-slate-500 ml-1.5">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Bar Chart: Job Volume */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-[15px] font-bold text-slate-800">Job Volume - This Week</h2>
              <p className="text-xs text-slate-500 mt-1">Daily job count</p>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="jobs" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Delivery Performance */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="mb-2">
              <h2 className="text-[15px] font-bold text-slate-800">Delivery Performance</h2>
              <p className="text-xs text-slate-500 mt-1">On-time vs delayed</p>
            </div>

            <div className="flex items-center h-[220px]">

              {/* Left Side: The Chart */}
              <div className="relative w-1/2 h-full flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius="65%"
                      outerRadius="85%"
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl xl:text-3xl font-bold text-slate-800">
                    {performanceData.find(d => d.name === 'On-time')?.value || 0}%
                  </span>
                </div>
              </div>

              {/* Right Side: The Legend */}
              <div className="w-1/2 pl-2 sm:pl-4 xl:pl-6 space-y-3 xl:space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center text-xs sm:text-[13px] xl:text-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full mr-2 shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-600 font-medium whitespace-nowrap truncate">
                      {item.name}
                    </span>
                    <span className="text-slate-800 font-bold ml-auto pl-2">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section: Tables and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Jobs Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-[15px] font-bold text-slate-800">Recent jobs</h2>
              <Link href={'/dashboard/operations/job-monitoring'}>
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  View all
                </button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-3">Job ID</th>
                    <th className="px-6 py-3">Route</th>
                    <th className="px-6 py-3">Trucker</th>
                    <th className="px-6 py-3 text-right">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No recent jobs found.</td>
                    </tr>
                  ) : (
                    recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-600">{job.jobNumber}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{job.route}</td>
                        <td className="px-6 py-4 text-slate-600">{job.truckerName}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyles(job.statusLabel)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor(job.statusLabel)}`}></span>
                            {job.statusLabel}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketplace Health */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-[15px] font-bold text-slate-800 mb-6">Marketplace Health</h2>

            <div className="space-y-6">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 w-48 shrink-0">
                    {metric.label}
                  </span>

                  {metric.isCurrency ? (
                    <span className="text-sm font-bold text-slate-800 ml-auto">
                      {metric.value}
                    </span>
                  ) : (
                    <>
                      <div className="flex-1 mx-4 max-w-[200px]">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${metric.colorClass}`}
                            style={{ width: `${metric.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-800 w-12 text-right">
                        {metric.value}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
