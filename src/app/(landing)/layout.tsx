import type { Metadata } from 'next';
import Header from './components/layout/header';
import { Box, Flex } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Time-Gap',
  description: 'Time-Gap LandingPage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Flex height="100vh" direction="column">
          <Header />
          <Box flex={1}>{children}</Box>
        </Flex>
      </body>
    </html>
  );
}
