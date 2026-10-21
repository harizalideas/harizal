import './globals.css';

export const metadata = {
  title: 'Selamat Ulang Tahun, Nurlaila! 🎂💖',
  description: 'Ucapan hangat & doa penuh berkah dari Harizal & Berlian sekeluarga untuk Nurlaila tercinta. Sentuh Mochi, tiup lilinnya, dan dengarkan lagunya!',
  keywords: ['Selamat Ulang Tahun Nurlaila', 'Birthday Nurlaila', 'Harizal Berlian', 'Coucou Mochi'],
  authors: [{ name: 'Harizal & Berlian' }],
  openGraph: {
    title: 'Selamat Ulang Tahun, Nurlaila! 🎂💖',
    description: 'Ucapan hangat & doa penuh berkah dari Harizal & Berlian sekeluarga untuk Nurlaila tercinta. Sentuh Mochi, tiup lilinnya, dan dengarkan lagunya!',
    url: 'https://harizal.vercel.app',
    siteName: 'Hari Spesial Nurlaila',
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
