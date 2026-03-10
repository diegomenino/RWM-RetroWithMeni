import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RetroBoard — Team Retrospectives',
  description: 'Real-time collaborative retrospective tool',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
