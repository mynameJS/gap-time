import ChakraProvider from '@/components/providers/ChakraProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gaptime.online'),
  title: 'Gap-Time',
  description: '틈새시간을 계획하는 새로운 방법',
  keywords: '틈새시간, 계획, 시간관리, 생산성, 효율성',
  authors: [{ name: 'Gap-Time' }],
  creator: 'Gap-Time',
  openGraph: {
    title: 'Gap-Time',
    description: '틈새시간을 계획하는 새로운 방법',
    url: 'https://www.gaptime.online/',
    siteName: 'Gap-Time',
    images: [
      {
        url: '/image/logo.webp',
        width: 800,
        height: 600,
        alt: 'Gap-Time Logo',
      },
    ],
    locale: 'ko-KR',
    type: 'website',
  },
  icons: {
    icon: 'icon/favicon.ico',
    shortcut: 'icon/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ChakraProvider>
          <QueryProvider>{children}</QueryProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
