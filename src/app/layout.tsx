import "./globals.css";

export const metadata = {
  title: "한글 낱말 게임",
  description: "한글 낱말 게임을 즐겨보세요!",
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="KO">
      <body>{children}</body>
    </html>
  );
}
