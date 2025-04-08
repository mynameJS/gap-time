import { Box } from '@chakra-ui/react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time-Gap',
  description: 'Time-Gap MainPage',
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
