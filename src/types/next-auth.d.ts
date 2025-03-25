// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      kakaoid?: string; // ✅ kakaoid 추가
    };
    accessToken?: string; // ✅ accessToken도 추가
  }

  interface JWT {
    accessToken?: string;
    kakaoid?: string;
  }
  interface Profile {
    properties?: {
      nickname?: string;
    };
    kakao_account?: {
      profile?: {
        nickname?: string;
      };
    };
  }
}
