import GreetingExperience from '@/components/GreetingExperience';

export const metadata = {
  title: 'Selamat Ulang Tahun, Nurlaila! 🎂💖',
  description: 'Ucapan & kado spesial penuh cinta untuk Nurlaila dari Harizal & Berlian sekeluarga.',
};

export default function NurlailaPage() {
  return (
    <GreetingExperience
      recipientName="Nurlaila"
      senderName="Harizal & Berlian Sekeluarga"
      photoUrl="/kado/nurlaila.jpeg"
      tagline="HARI SPESIAL UNTUK NURLAILA"
    />
  );
}
