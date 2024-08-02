import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'CarePulse',
  description: 'Healthcare manager system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' suppressHydrationWarning={true}>
      <body
        className={cn(
          'min-h-screen bg-dark-300 font-sans antialiased',
          font.variable,
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='dark'>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
