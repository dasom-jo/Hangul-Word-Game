"use client"; // 클라이언트 컴포넌트로 설정

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
