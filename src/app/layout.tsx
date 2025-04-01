import ChakraProvider from '@/components/chakraUI/ChakraProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time-Gap',
  description: 'Time-Gap Developing',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  );
}
