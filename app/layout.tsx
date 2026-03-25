import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'RWM — Team Retrospectives',
  description: 'Real-time collaborative retrospective tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`} style={{ background: 'linear-gradient(150deg, #f0f7ff 0%, #e8f0fe 35%, #f5f0ff 70%, #fdf2fb 100%)' }}>
        <AuthProvider>{children}</AuthProvider>
        <div className="fixed bottom-2 left-3 text-[11px] text-gray-400 select-none pointer-events-none">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </div>
      </body>
    </html>
  );
}
