import { getNotificationsAction } from '@/app/actions/notifications';
import NotificationClient from './NotificationClient';

export default async function NotificationsPage() {
  // Fetch initial notifications on the server
  const initialRes = await getNotificationsAction({ tab: 'All', page: 1, limit: 20 });

  console.log(initialRes)
  return (
    <NotificationClient 
      initialData={initialRes?.data || { notifications: [], pagination: {} }} 
    />
  );
}