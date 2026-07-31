'use client'

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Download } from 'lucide-react';
import { HeaderMenu } from '@/components/layouts/HeaderMenu';
import { getAuditLogsAction } from '@/app/actions/audit'; 

const filterOptions = ['All', 'Super Admin', 'Operations', 'Finance'];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters & Pagination state
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  // Fetch data whenever filter, search, or page changes
  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const res = await getAuditLogsAction({
        roleGroup: activeFilter,
        search: searchQuery,
        page: page,
      });

      if (res.success && res.data) {
        setLogs(res.data.logs || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalLogs(res.data.pagination?.total || 0);
      } else {
        setLogs([]);
      }
      setIsLoading(false);
    };

    // Debounce to prevent spamming API on every keystroke
    const timer = setTimeout(() => {
      fetchLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery, page]);

  // Reset to page 1 when changing filters or searching
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  // --- Formatters ---
  const formatRole = (roleStr: string) => {
    if (!roleStr) return 'Unknown';
    return roleStr.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleBadgeClasses = (role: string) => {
    const r = role?.toLowerCase() || '';
    if (r.includes('super')) return 'bg-indigo-100 text-indigo-700';
    if (r.includes('operation')) return 'bg-emerald-100 text-emerald-700';
    if (r.includes('finance')) return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // --- CSV Export Logic ---
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Fetch all records matching the current filters (using a high limit)
      const res = await getAuditLogsAction({
        roleGroup: activeFilter,
        search: searchQuery,
        page: 1,
        limit: 5000, 
      });

      if (res.success && res.data?.logs) {
        const exportData = res.data.logs;
        
        // Define CSV Headers
        const headers = ['Time', 'Admin Name', 'Admin Email', 'Role', 'Action', 'Entity Label', 'Entity Type', 'Result', 'Note'];
        
        // Map data to rows, escaping quotes to prevent CSV breakage
        const csvRows = exportData.map((log: any) => [
          formatDate(log.createdAt),
          log.admin?.name || 'System',
          log.admin?.email || '',
          formatRole(log.admin?.role),
          log.action,
          log.entityLabel || log.entityId || '',
          log.entityType || '',
          log.result === 'SUCCESS' ? 'Success' : 'Failed',
          log.note || ''
        ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')); // Wrap fields in quotes

        // Combine headers and rows
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        
        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const dateString = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `audit_logs_${dateString}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Failed to fetch data for export.");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("An error occurred while exporting.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <HeaderMenu title="Audit Logs" label="Audit" />

      <div className="p-5 mx-auto">
        
        {/* Toolbar: Search, Filters, Export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Filters & Search */}
          <div className='my-5 flex items-center gap-4 flex-1 w-full'>
            <div className='flex bg-white p-2 gap-2 border border-slate-300 rounded-lg flex-[30%] focus-within:border-blue-600 transition-colors'>
                <Search className='text-slate-400' size={20} />
                <input 
                  type="text" 
                  placeholder='Search action, entity or admin...' 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className='flex-1 focus:outline-none text-sm' 
                />
            </div>
            <div className='flex items-center gap-3 flex-[70%] overflow-x-auto no-scrollbar'>
                <div className='flex items-center gap-3 whitespace-nowrap'>
                {filterOptions.map(f => (
                    <div 
                      key={f} 
                      onClick={() => handleFilterChange(f)}
                      className={`border cursor-pointer h-8 px-4 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                          activeFilter === f 
                            ? 'text-white bg-blue-600 border-blue-600' 
                            : 'text-slate-600 bg-white border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {f}
                    </div>
                ))}
                </div>
            </div>
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-slate-400 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Export
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[400px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] font-bold tracking-wider text-slate-400 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Result</th>
                  <th className="px-6 py-4">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500 font-medium">
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Time */}
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {formatDate(log.createdAt)}
                      </td>
                      
                      {/* Admin */}
                      <td className="px-6 py-4 text-slate-800 font-semibold">
                        {log.admin?.name || 'System'}
                      </td>
                      
                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getRoleBadgeClasses(log.admin?.role)}`}>
                          {formatRole(log.admin?.role)}
                        </span>
                      </td>
                      
                      {/* Action */}
                      <td className="px-6 py-4 text-slate-600">
                        {log.action}
                      </td>
                      
                      {/* Entity */}
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-medium">{log.entityLabel || log.entityId || '-'}</span>
                      </td>
                      
                      {/* Result Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          log.result === 'SUCCESS' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.result === 'SUCCESS' ? 'Success' : 'Failed'}
                        </span>
                      </td>

                      {/* Note */}
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {log.note || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && logs.length > 0 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
              <span>
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, totalLogs)} of {totalLogs} logs
              </span>
              <div className="flex space-x-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors font-medium"
                >
                  Previous
                </button>
                <button 
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}