import './globals.css';

export const metadata = {
  title: 'Selamat Ulang Tahun Harizal! 🎂✨',
  description: 'Website interaktif ucapan selamat ulang tahun untuk Harizal dengan animasi karakter Coucou (Mochi) yang responsif terhadap sentuhan dan kursor.',
  keywords: ['Selamat Ulang Tahun Harizal', 'Birthday Harizal', 'Coucou Mochi', 'Next.js Interactive'],
  authors: [{ name: 'Harizal Friends' }],
  openGraph: {
    title: 'Selamat Ulang Tahun Harizal! 🎂✨',
    description: 'Beri ucapan, sentuh Mochi yang lucu, tiup lilinnya, dan rayakan hari bahagia ini bersama!',
    url: 'https://harizal.vercel.app',
    siteName: 'Harizal Birthday Special',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#07080C',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
