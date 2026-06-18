import MarketplaceOverview from './MarketplaceOverview';
import { getOverviewAction } from '@/app/actions/overview';

export default async function OverviewPage() {
  const result = await getOverviewAction();



  // Pass the data down. If the request fails, default to null safely.
  return (
    <MarketplaceOverview initialData={result.success ? result.data : null} />
  );
}