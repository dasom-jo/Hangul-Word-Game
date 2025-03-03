"use client";
import Background from "./components/background";
import "./globals.css";
import ClientProvider from "./providers/ClientProvider";
import { WordProvider } from "./contexts/wordContext"; // 추가

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ClientProvider>
          <WordProvider>
            <Background />
            {children}
          </WordProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
