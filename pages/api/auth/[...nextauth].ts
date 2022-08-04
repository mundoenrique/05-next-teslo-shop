import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUser } from '../../../database';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    Credentials({
      name: 'Custom login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        console.log({ credentials });
        return await dbUser.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  // callbacks
  jwt: {},
  session: {
    maxAge: 259200, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({ token, account, user });
      if (account) {
        token.accessToken = account.access_token;

        switch (account.type) {
          case 'oauth':
            token.user = await dbUser.oAuthToDbUser(user?.email || '', user?.name || '');
            break;

          case 'credentials':
            token.user = user;
            break;

          default:
            break;
        }
      }

      return token;
    },

    async session({ session, token, user }) {
      // console.log({ session, token, user });
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
