import { Header } from '@/components/Header';
import { isLoggedIn } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await isLoggedIn();

  return (
    <div className="">
      <Header />
      <div className="max-w-5xl m-auto w-ful px-4">{children}</div>
    </div>
  );
}
