import { getJobStatsAction, getPendingDocsAction, getJobsAction } from '@/app/actions/jobs';
import JobMonitoringClient from './JobMonitoringClient';

export default async function JobMonitoringPage() {
  // Fetch the three primary data sources in parallel for maximum speed
  const [stats, pendingDocs, initialJobs] = await Promise.all([
    getJobStatsAction(),
    getPendingDocsAction(),
    getJobsAction({ page: 1 })
  ]);

  return (
    <JobMonitoringClient 
      // Added optional chaining (?.) to prevent crashes if the server actions return undefined
      initialStats={stats?.data || null} 
      initialPendingDocs={pendingDocs?.data?.jobs || []} 
      initialJobsData={initialJobs?.data || { jobs: [], pagination: {} }}
    />
  );
}
