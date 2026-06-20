'use client'

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import { getJobsAction } from '@/app/actions/jobs';
import ViewJobModal from '@/components/modals/ViewJobModal';
import InterveneModal from '@/components/modals/InterveneJobModal';
import JobDetails from '@/app/(dashboard)/dashboard/operations/job-monitoring/JobDetails';

// --- Types (Exported for modals) ---
export type JobStatus = 'On track' | 'At risk' | 'Delayed' | 'Completed' | string;

export default function JobMonitoringClient({ initialStats, initialPendingDocs, initialJobsData }: any) {
  // Primary Filter States
  const [activeFilter, setActiveFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Secondary Filter States
  const [truckerType, setTruckerType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(initialJobsData?.pagination?.page || 1);
  const [totalPages, setTotalPages] = useState(initialJobsData?.pagination?.totalPages || 1);
  const [totalJobs, setTotalJobs] = useState(initialJobsData?.pagination?.total || 0);

  // UI States
  const [jobsData, setJobsData] = useState(initialJobsData?.jobs || []);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  
  // Modal States
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [jobToIntervene, setJobToIntervene] = useState<string | null>(null);

  // Handlers to reset pagination when searching/filtering
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); 
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleSecondaryFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setCurrentPage(1); // Jump back to page 1 when dates or trucker type changes
  };

  // Re-fetch jobs when ANY filter, search, or page changes
  useEffect(() => {
    const fetchFilteredJobs = async () => {
      setIsLoadingJobs(true);
      const response = await getJobsAction({ 
        statusFilter: activeFilter, 
        search: searchQuery,
        truckerType: truckerType,
        dateFrom: dateFrom,
        dateTo: dateTo,
        page: currentPage 
      });
      
      const payload = response?.data || response;
      
      setJobsData(payload?.jobs || []);
      if (payload?.pagination) {
        setTotalPages(payload.pagination.totalPages);
        setTotalJobs(payload.pagination.total);
      }
      
      setIsLoadingJobs(false);
    };

    const debounceId = setTimeout(() => {
      fetchFilteredJobs();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [activeFilter, searchQuery, truckerType, dateFrom, dateTo, currentPage]);

  // --- Mappers ---
  const kpiData = [
    { label: 'DOCS PENDING', value: initialStats?.docsPending || 0, colorClass: 'text-amber-500' },
    { label: 'UNDER REVIEW', value: initialStats?.underReview || 0, colorClass: 'text-slate-800' },
    { label: 'MATCHING', value: initialStats?.matching || 0, colorClass: 'text-slate-800' },
    { label: 'ACTIVE', value: initialStats?.active || 0, colorClass: 'text-blue-600' },
    { label: 'COMPLETED', value: initialStats?.completed || 0, colorClass: 'text-emerald-500' },
  ];

  const filterPills = [
    { label: 'All', value: '' },
    { label: 'Active', value: 'Active' },
    { label: 'Delayed', value: 'Delayed' },
    { label: 'At risk', value: 'AtRisk' },
    { label: 'Completed', value: 'Completed' },
  ];

  // Styling Helpers
  const getBadgeStyles = (statusLabel: string) => {
    switch (statusLabel?.toLowerCase()) {
      case 'on track': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'at risk': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'delayed': return 'bg-red-50 text-red-600 border-red-100';
      case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getDotColor = (statusLabel: string) => {
    switch (statusLabel?.toLowerCase()) {
      case 'on track': return 'bg-emerald-500';
      case 'at risk': return 'bg-amber-500';
      case 'delayed': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-slate-500';
    }
  };

  // Logic for Free Days coloring
  const getFreeDaysDisplay = (freeDays: number) => {
    if (freeDays < 0) return { text: `${freeDays} days`, state: 'danger', color: 'text-red-600' };
    if (freeDays <= 1) return { text: `${freeDays} left`, state: 'warning', color: 'text-amber-500' };
    return { text: `${freeDays} left`, state: 'good', color: 'text-emerald-600' };
  };


   if (!initialJobsData  || !initialStats) {
      return (
        <div className="min-h-screen bg-slate-100/50 pb-10">
          <HeaderMenu title="Job Monitoring" label="Jobs " />
          <div className="p-6 text-center text-slate-500 font-medium">
            Failed to load dashboard. Please refresh the page.
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-slate-100/50 pb-10">
      <HeaderMenu title="Job Monitoring" label="Jobs" />

      {
        selectedJobId 
        ? <JobDetails 
          jobId={selectedJobId} 
          onBack={() => setSelectedJobId(null)}
          onIntervene={() => {
            const idToIntervene = selectedJobId;
            setSelectedJobId(null);
            
            setTimeout(() => {
              setJobToIntervene(idToIntervene);
            }, 200);
          }}  />
        : (
          <div className="p-4 sm:p-6  mx-auto space-y-6">
        
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-1 sm:mb-2">
                  {kpi.label}
                </h3>
                <div className={`text-2xl sm:text-3xl font-bold ${kpi.colorClass}`}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>

          {/* Documents Awaiting Review Banner */}
          {/* {initialPendingDocs.length > 0 && (
            <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[14px] sm:text-[15px] font-bold text-slate-800">
                  Documents Awaiting Review - <span className="font-medium text-slate-600">{initialStats?.docsPending || 0} pending</span>
                </h2>
                <Link href={'/dashboard/operations/doc-review'}> 
                  <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    View all
                  </button>
                </Link>
              </div>

              <div className="space-y-3">
                {initialPendingDocs.slice(0, 2).map((doc: any) => {
                  const tags = [];
                  if (doc.hasTdo) tags.push('TDO');
                  if (doc.hasExitNote) tags.push('Exit Note');
                  const initials = doc.forwarderName ? doc.forwarderName.substring(0, 2).toUpperCase() : 'FW';

                  return (
                    <div key={doc.id} className="bg-white border border-amber-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                            <span className="font-bold text-slate-800">{doc.forwarderName || 'Unknown'}</span>
                            <span className="font-bold text-blue-600 text-sm">{doc.jobNumber}</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold tracking-wide uppercase border border-amber-100">
                              {doc.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mb-2">
                            {doc.route} • {doc.container} • {new Date(doc.submittedAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            {tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded border border-emerald-200 text-emerald-600 text-[11px] font-bold bg-emerald-50/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Link href={`/dashboard/operations/doc-review/${doc.id}`}>
                        <button className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors">
                          Review
                        </button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )} */}

          {/* Main Data Table Area */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm min-h-[400px] flex flex-col">
            
            {/* Top Filters Row */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
              <div className="relative w-full xl:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search job ID, route, trucker..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className='flex items-center gap-3 flex-[70%] overflow-x-auto custom-scrollbar pb-1'>
                <div className='flex items-center gap-2'>
                  {filterPills.map((filter) => (
                    <div
                      key={filter.label}
                      onClick={() => handleFilterChange(filter.value)}
                      className={`border cursor-pointer h-8 px-4 rounded-full text-sm font-bold flex items-center justify-center transition-colors whitespace-nowrap ${
                        activeFilter === filter.value
                          ? 'text-white bg-[#0241E8] border-[#0241E8]'
                          : 'text-[#4F4F4F] bg-white border-[#BDBDBD] hover:bg-gray-50'
                      }`}
                    >
                      {filter.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Secondary Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Trucker</label>
                <div className="relative">
                  <select 
                    value={truckerType}
                    onChange={(e) => handleSecondaryFilterChange(setTruckerType, e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="All">All Truckers</option>
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Date From</label>
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => handleSecondaryFilterChange(setDateFrom, e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Date To</label>
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => handleSecondaryFilterChange(setDateTo, e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                />
              </div>

              {/* Ignored/Disabled visual placeholder per request */}
              {/* <div className="space-y-1.5 opacity-50 pointer-events-none">
                <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Free Days</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2">
                    <option>Any</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div> */}

            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4">Job ID</th>
                    <th className="px-4 sm:px-6 py-4">Trucker</th>
                    <th className="px-4 sm:px-6 py-4">Forwarder</th>
                    <th className="px-4 sm:px-6 py-4">Route</th>
                    <th className="px-4 sm:px-6 py-4">Status</th>
                    <th className="px-4 sm:px-6 py-4">Deadline</th>
                    <th className="px-4 sm:px-6 py-4">Free Days</th>
                    <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingJobs ? (
                    <tr><td colSpan={8} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" /></td></tr>
                  ) : jobsData.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-slate-500">No jobs found matching criteria.</td></tr>
                  ) : (
                    jobsData.map((job: any) => {
                      const freeDaysMeta = getFreeDaysDisplay(job.freeDays);
                      const isDanger = job.statusLabel === 'Delayed' || job.statusLabel === 'At risk';
                      
                      return (
                        <tr key={job.id} className={`transition-colors ${job.statusLabel === 'Delayed' ? 'bg-red-50/30 hover:bg-red-50/50' : 'hover:bg-slate-50/50'}`}>
                          <td className="px-4 sm:px-6 py-4 font-bold text-blue-600">{job.jobNumber}</td>
                          <td className="px-4 sm:px-6 py-4 font-medium text-slate-800">{job.truckerName || '-'}</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-600">{job.forwarderName || '-'}</td>
                          <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">{job.route}</td>
                          <td className="px-4 sm:px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeStyles(job.statusLabel)}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor(job.statusLabel)}`}></span>
                              {job.statusLabel}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-slate-600 font-medium">
                            {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                          <td className={`px-4 sm:px-6 py-4 font-bold ${freeDaysMeta.color}`}>
                            {freeDaysMeta.text}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-right space-x-2">
                            <button 
                              onClick={() => setSelectedJobId(job.id)}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View
                            </button>
                            {isDanger && (
                              <button 
                                onClick={() => setJobToIntervene(job.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-white border rounded-lg transition-colors text-slate-600 border-slate-200 hover:bg-slate-50"
                              >
                                Intervene
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!isLoadingJobs && jobsData.length > 0 && (
              <div className="p-4 sm:px-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 rounded-b-xl">
                <span>
                  Showing {(currentPage - 1) * 20 + 1} to {Math.min(currentPage * 20, totalJobs)} of {totalJobs} jobs
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
        )
        
      }

      

      {/* MODALS */}
      <InterveneModal 
        isOpen={!!jobToIntervene} 
        jobId={jobToIntervene}
        onClose={() => setJobToIntervene(null)}
      />
    </div>
  );
}