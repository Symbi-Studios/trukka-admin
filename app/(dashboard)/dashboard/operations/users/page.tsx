import { getUsersAction } from '@/app/actions/users';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  // Fetch the initial payload for the default tab (Forwarders)
  const initialRes = await getUsersAction('forwarders', { status: 'All', page: 1 });

  console.log('initialsUser', initialRes.data)

  return (
    <UsersClient 
      initialUsersData={initialRes?.data || { users: [], pagination: {} }} 
    />
  );
}