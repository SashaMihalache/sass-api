import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import prisma from './prisma';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export async function createCustomerIfNull() {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    if (!user?.stripe_customer_id) {
      const customer = await stripe.customers.create({
        email: String(user?.email),
      });

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          stripe_customer_id: customer.id,
        },
      });
    }
  }
}
