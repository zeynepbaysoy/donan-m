import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Donanımsal - Bilişim Teknolojilerinin Temelleri',
  description: 'Bilişim Teknolojilerinin Temelleri dersi için İç ve Dış Donanım Birimleri etkileşimli öğrenme ve oyun platformu.',
  openGraph: {
    title: 'Donanımsal - Bilişim Teknolojilerinin Temelleri',
    description: 'Bilişim Teknolojilerinin Temelleri dersi için İç ve Dış Donanım Birimleri etkileşimli öğrenme ve oyun platformu.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donanımsal - Bilişim Teknolojilerinin Temelleri',
    description: 'Bilişim Teknolojilerinin Temelleri dersi için İç ve Dış Donanım Birimleri etkileşimli öğrenme ve oyun platformu.',
  },
};

import { AuthProvider } from '@/lib/auth-context';
import { AuthModal } from '@/components/AuthModal';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
