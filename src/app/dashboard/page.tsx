import prisma from '@/lib/prisma';
import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
  stripe,
} from '@/lib/stripe';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const customer = await createCustomerIfNull();
  const hasSub = await hasSubscription();
  const checkoutLink = await createCheckoutLink(String(customer));
  const user = await prisma.user.findFirst({
    where: {
      email: String(session?.user?.email),
    },
  });

  const top10RecentLogs = await prisma.log.findMany({
    where: {
      userId: user?.id,
    },
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  });

  let currentUsage = 0;

  if (hasSub) {
    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripe_customer_id),
    });

    const invoices = await stripe.invoices.retrieveUpcoming({
      subscription: String(subscriptions.data.at(0)?.id),
    });

    currentUsage = invoices.amount_due / 100;
  }

  return (
    <main>
      {hasSub ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="rounded-md px-4 py-2 bg-emerald-400 text-white text-sm font-medium">
              You have a subscription
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">
                Current Usage
              </p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-8 ">
                ${currentUsage}
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">API Key</p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-8 ">
                {user?.api_key}
              </p>
            </div>

            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4 font-bold">
                Log Events
              </p>
              {top10RecentLogs.map((log) => (
                <div className="flex items-center gap-4" key={log.id}>
                  <p className="text-sm font-mono text-zinc-900 px-6 py-4">
                    {log.method}
                  </p>
                  <p className="text-sm font-mono text-zinc-900 px-6 py-4">
                    {log.status}
                  </p>
                  <p className="text-sm font-mono text-zinc-900 px-6 py-4">
                    {log.createdAt.toDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[60vh] grid place-items-center rounded-lg px-6 py-10 bg-slate-100">
            <Link
              href={checkoutLink}
              className="font-medium text-base hover:underline"
            >
              <p>You have no subscriptipn. Click here to subscribe.</p>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
