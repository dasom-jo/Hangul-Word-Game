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
    async jwt({ token, account, profile }) {
      console.log("🔍 Profile Data:", profile); // profile 데이터 확인

      if (account && profile) {
        token.kakaoid =
          profile.properties?.nickname || // properties에서 닉네임 가져오기
          profile.kakao_account?.profile?.nickname || // kakao_account에서 닉네임 가져오기
          "unknown"; // 닉네임이 없으면 unknown 설정

        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.name = token.kakaoid as string; // 닉네임을 name으로 설정
      return session;
    },
  },
});

export { handler as GET, handler as POST };
