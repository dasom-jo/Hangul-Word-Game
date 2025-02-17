import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string; // 🔥 타입 변환 추가
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string; // 🔥 타입 변환 추가
      return session;
    },
  },
});

export { handler as GET, handler as POST };
