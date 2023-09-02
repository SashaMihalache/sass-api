import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: String(process.env.DISCORD_OAUTH_CLIENT_ID),
      clientSecret: String(process.env.DISCORD_OAUTH_CLIENT_SECRET),
    }),
    GithubProvider({
      clientId: String(process.env.GITHUB_OAUTH_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_OAUTH_CLIENT_SECRET),
    }),
  ],
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
