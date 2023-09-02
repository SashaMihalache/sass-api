import { Header } from '@/components/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    console.log('user logged in');
  } else {
    console.log('user not logged in');
    redirect('/api/auth/signin');
  }

  return (
    <div className="">
      <Header />
      <div className="max-w-5xl m-auto w-ful px-4">{children}</div>
    </div>
  );
}
