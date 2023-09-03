import prisma from '@/lib/prisma';
import {
  createCheckoutLink,
  createCustomerIfNull,
  hasSubscription,
} from '@/lib/stripe';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session);
  const customer = await createCustomerIfNull();
  const hasSub = await hasSubscription();
  const checkoutLink = await createCheckoutLink(String(customer));
  const user = await prisma.user.findFirst({
    where: {
      email: String(session?.user?.email),
    },
  });

  return (
    <main>
      {hasSub ? (
        <>
          <div className="flex flex-col gap-4">
            <div className="rounded-md px-4 py-2 bg-emerald-400 text-white text-sm font-medium">
              You have a subscription
            </div>
            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-md">
              <p className="text-sm text-black px-6 py-4">API Key</p>
              <p className="text-sm font-mono text-zinc-800 px-6 py-8">
                {user?.api_key}
              </p>
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
