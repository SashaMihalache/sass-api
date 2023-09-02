import { Header } from '@/components/Header';
import { isLoggedIn } from '@/lib/auth';
import { createCustomerIfNull } from '@/lib/stripe';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await isLoggedIn();
  await createCustomerIfNull();

  return (
    <div className="">
      <Header />
      <div className="max-w-5xl m-auto w-ful px-4">{children}</div>
    </div>
  );
}
