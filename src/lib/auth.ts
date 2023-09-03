import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function isLoggedIn() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log('not logged in');
    redirect('/api/auth/signin');
  }
  console.log('logged in');
}
