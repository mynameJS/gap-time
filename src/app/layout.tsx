import Provider from './provider';
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
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
