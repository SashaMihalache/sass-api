import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
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
});
