import { Box, Flex } from '@chakra-ui/react';
import Header from '@/components/layout/Header';
import type { Metadata } from 'next';

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
    <>
      <Flex height="100vh" direction="column" px={{ xl: '15rem', lg: '10rem', base: '3rem' }}>
        <Header />
        <Box flex={1}>{children}</Box>
      </Flex>
    </>
  );
}
