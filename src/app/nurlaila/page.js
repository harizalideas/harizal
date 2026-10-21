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
      photoUrl="https://xymznvulpheibgtiyzwx.supabase.co/storage/v1/object/public/kado-gifts/gifts/nurlaila.jpeg"
      tagline="HARI SPESIAL UNTUK NURLAILA"
      relationship="bestfriend_to_bestfriend"
      slug="nurlaila"
    />
  );
}
