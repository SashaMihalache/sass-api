import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@auth/prisma-adapter';

const primsa = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(primsa),
  providers: [
    DiscordProvider({
      clientId: String(process.env.DISCORD_OAUTH_CLIENT_ID),
      clientSecret: String(process.env.DISCORD_OAUTH_CLIENT_SECRET),
    }),
    // ...add more providers here
  ],
} as AuthOptions;

export default NextAuth(authOptions);
