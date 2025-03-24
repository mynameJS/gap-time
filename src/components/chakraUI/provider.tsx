'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { system } from '@/styles/custom';
import { ThemeProvider } from 'next-themes';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {props.children}
      </ThemeProvider>
    </ChakraProvider>
  );
}
