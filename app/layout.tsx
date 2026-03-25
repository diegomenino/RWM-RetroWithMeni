import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'RWM — Team Retrospectives',
  description: 'Real-time collaborative retrospective tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>{children}</AuthProvider>
        <div className="fixed bottom-2 left-3 text-[11px] text-gray-400 select-none pointer-events-none">
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </div>
      </body>
    </html>
  );
}
