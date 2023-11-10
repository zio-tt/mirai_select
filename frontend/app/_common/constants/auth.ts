import * as jose from 'jose';
import type { DefaultSession, DefaultUser, NextAuthOptions, Session, User } from 'next-auth';
import type { DefaultJWT, JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    appAccessToken: string;
  }
  interface Session {
    user: User & DefaultUser & {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      provider?: 'google';
    };
  }
  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    provider?: 'google';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    iat: number;
    exp: number;
    jti: string;
    id?: string;
    provider?: 'google';
  }
}

export const options: NextAuthOptions = {
  // debug: true,
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID) ?? '',
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET) ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, token, }: { session: Session; user: User; token: JWT; }) => {
      // session.userが存在することを確認する
      if (!session.user) {
        session.user = { id: '', name: '', email: ''} as User; // ここで適切な型アサーションを行うか、または必要なプロパティを持つ空のオブジェクトを割り当てます
      }

      // 必要なプロパティをsession.userに割り当てる
      session.user.id = token.sub ?? session.user.id; // token.subがundefinedでない場合のみ割り当てる
      session.user.name = token.name ?? session.user.name; // 同上
      session.user.email = token.email ?? session.user.email; // 同上
      if (token.provider === 'google') {
        session.user.provider = token.provider; // isOidcProvider関数を通して割り当てる
      }

      if (token.sub != null && token.provider != null) {
        const payload = {
          sub: token.sub,
          provider: String(token.provider),
        };

        const secret = new TextEncoder().encode(
          String(process.env.APP_ACCESS_TOKEN_SECRET),
        );

        const alg = 'HS256';

        session.appAccessToken = await new jose.SignJWT(payload)
          .setProtectedHeader({ alg })
          .setExpirationTime('30d')
          .setJti(String(token.jti))
          .sign(secret);
      }

      return session;
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    jwt: async ({ token, account, profile }) => {
      if (account && profile) {
        // isOidcProviderを使ってproviderの型を確認する
        if (account.provider === 'google') {
          token.provider = account.provider;
        }
        token.sub = profile.sub; // profileから適切なプロパティを割り当てる
        token.name = profile.name; // 同上
        token.email = profile.email; // 同上
      }

      return token;
    },
    async signIn({ user, account }) {
      const provider = account?.provider;
      const uid = user?.id;
      const name = user?.name;
      const email = user?.email;
      const avatar = user?.image;

      try {
        const response = await axios.post(
          `${process.env.RAILS_API_URL}/auth/${provider}/callback`,
          {
            uid,
            provider,
            name,
            email,
            avatar,
          }
        );

        return response.status === 200;
      } catch (error) {
        console.error('エラー', error);
        return false;
      }
    },
  },
};