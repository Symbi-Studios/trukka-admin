// Your client component
import { getJobStatsAction, getPendingDocsAction, getJobsAction } from '@/app/actions/jobs';
import JobMonitoringClient from './JobMonitoringClient';

export default async function JobMonitoringPage() {
  // Fetch the three primary data sources in parallel for maximum speed
  const [stats, pendingDocs, initialJobs] = await Promise.all([
    getJobStatsAction(),
    getPendingDocsAction(),
    getJobsAction({ page: 1 })
  ]);


  // console.log('jobs', pendingDocs)
  // console.log('jobsData', initialJobs.data)

  return (
    <JobMonitoringClient 
      initialStats={stats.data} 
      // initialPendingDocs={pendingDocs.data.jobs || []} 
      initialJobsData={initialJobs?.data || { jobs: [], pagination: {} }}
    />
  );
}