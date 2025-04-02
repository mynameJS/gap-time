import ChakraProvider from '@/components/providers/ChakraProvider';
import QueryProvider from '@/components/providers/QueryProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time-Gap',
  description: 'Time-Gap Developing',
  icons: {
    icon: '/image/logo.png',
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
