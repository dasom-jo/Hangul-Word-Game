import Background from "./components/background";
import "./globals.css";
import ClientProvider from "./providers/ClientProvider";

export const metadata = {
  title: "한글 낱말 게임",
  description: "한글 낱말 게임을 즐겨보세요!",
};

export { viewport } from "./viewport"; // viewport 설정 가져오기

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <ClientProvider>
          {/* <Background /> */}
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
