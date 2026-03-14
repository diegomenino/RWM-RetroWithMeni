import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

const hasSSOConfigured =
  (!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET) ||
  (!!process.env.AZURE_AD_CLIENT_ID &&
    !!process.env.AZURE_AD_CLIENT_SECRET &&
    !!process.env.AZURE_AD_TENANT_ID);

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
          }),
        ]
      : []),
    ...(!hasSSOConfigured
      ? [
          CredentialsProvider({
            id: 'email-only',
            name: 'Email',
            credentials: {
              email: { label: 'Email', type: 'email' },
            },
            async authorize(credentials) {
              const email = credentials?.email?.trim().toLowerCase();
              if (!email || !email.includes('@')) return null;
              const name = email.split('@')[0].replace(/[._-]/g, ' ');
              return {
                id: email,
                email,
                name: name.charAt(0).toUpperCase() + name.slice(1),
              };
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
