import { getDocReviewStatsAction, getDocQueueAction, getTruckRegAction } from '@/app/actions/doc-review';
import DocReviewClient from './DocReviewClient';

export default async function DocReviewPage() {
  const [statsRes, queueRes, trucksRes] = await Promise.all([
    getDocReviewStatsAction(),
    getDocQueueAction({ page: 1, status: 'awaiting' }),
    getTruckRegAction({ page: 1, status: 'awaiting' })
  ]);

  // console.log('statsRes', statsRes)
  // console.log('queueRes', queueRes.data)
  // console.log('trucksRes', trucksRes.data)

  return (
    <DocReviewClient 
      initialStats={statsRes?.data || statsRes} 
      initialQueue={queueRes?.data || queueRes}
      initialTrucks={trucksRes?.data || trucksRes}
    />
  );
}