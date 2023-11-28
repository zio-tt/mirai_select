import * as jose from 'jose';
import type { DefaultSession, DefaultUser, NextAuthOptions, Session, User } from 'next-auth';
import type { DefaultJWT, JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    appAccessToken: string;
  }
  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    provider?: 'google';
  }
  interface Session {
    user: User & DefaultUser;
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
  debug: true,
  providers: [
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID) ?? '',
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET) ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, token, }: { session: Session; token: JWT; }) => {
      // session.userが存在することを確認する
      if (!session.user) {
        session.user = { id: '', name: '', email: ''} as User;
      }

      // 必要なプロパティをsession.userに割り当てる
      session.user.id = token.id ?? session.user.id;
      session.user.name = token.name ?? session.user.name;
      session.user.email = token.email ?? session.user.email;
      session.user.image = token.picture ?? session.user.image;
      session.user.provider = token.provider;

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
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        if (account.provider === 'google') {
          token.provider = account.provider;
        }
        token.id = user.id; // profileから適切なプロパティを割り当てる
        token.name = user.name; // 同上
        token.email = user.email; // 同上
        token.picture = user.image;
      }

      return token;
    },
    async signIn({ user, account }) {
      // JWTトークンを生成する
      const tokenPayload = {
        provider: account?.provider,
        uid: user?.id,
        name: user?.name,
        email: user?.email,
        avatar: user?.image,
      };
      const secretKey = new TextEncoder().encode(process.env.APP_ACCESS_TOKEN_SECRET || '');
      // JWTトークンを署名する
      const token = await new jose.SignJWT(tokenPayload)
                                  .setProtectedHeader({ alg: 'HS256' })
                                  .sign(secretKey);

      try {
        // UsersController#createを呼び出し、ユーザー作成または確認
        const userCreateResponse = await axios({
          method: 'post',
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/auth/${account?.provider}/callback`,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          data: { token },
          withCredentials: true,
        });

        // ユーザー作成が成功した場合（ステータスコード200）
        return userCreateResponse.status === 200
      } catch (error) {
        console.error('エラー', error);
        return false;
      }
    },
  },
};