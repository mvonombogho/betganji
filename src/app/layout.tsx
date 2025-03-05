import { Inter } from 'next/font/google';
import { LoadingProvider } from '@/components/providers/loading-provider';
import { DataProvider } from '@/contexts/data-context';
import { ServiceProvider } from '@/contexts/ServiceContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <ServiceProvider>
            <DataProvider>
              {children}
            </DataProvider>
          </ServiceProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
