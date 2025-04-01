import type { Metadata } from 'next';
import { Box } from '@chakra-ui/react';

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
      <Box width="100vw" height="100vh">
        {children}
      </Box>
    </>
  );
}
