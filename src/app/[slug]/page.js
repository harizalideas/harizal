import { supabaseAdmin } from '@/lib/supabaseServer';
import GreetingExperience from '@/components/GreetingExperience';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === 'nurlaila') {
    return {
      title: 'Selamat Ulang Tahun, Nurlaila! 🎂💖',
      description: 'Ucapan & kado spesial penuh cinta untuk Nurlaila dari Harizal & Berlian sekeluarga.',
    };
  }

  // Check greetings table first
  const { data: gRecord } = await supabaseAdmin
    .from('greetings')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (gRecord) {
    return {
      title: `Selamat Ulang Tahun, ${gRecord.recipient_name}! 🎂💖`,
      description: `Ucapan spesial dari ${gRecord.sender_name} untuk ${gRecord.recipient_name}.`,
    };
  }

  // Fallback to umkm_profiles table
  const { data: record } = await supabaseAdmin
    .from('umkm_profiles')
    .select('*')
    .eq('owner_url', slug)
    .maybeSingle();

  if (record) {
    return {
      title: `Selamat Ulang Tahun, ${record.nama_umkm}! 🎂💖`,
      description: `Ucapan spesial dari ${record.deskripsi} untuk ${record.nama_umkm}.`,
    };
  }

  return {
    title: 'Pengalaman Ucapan Spesial 🎂',
    description: 'Sampaikan ucapan menjadi pengalaman tak terlupakan.',
  };
}

export default async function DynamicSlugPage({ params }) {
  const { slug } = await params;

  if (slug === 'nurlaila') {
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

  // Fetch from greetings table first
  let recipient = null;
  let sender = null;
  let photo = null;
  let relationship = null;

  const { data: gRecord } = await supabaseAdmin
    .from('greetings')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (gRecord) {
    recipient = gRecord.recipient_name;
    sender = gRecord.sender_name;
    photo = gRecord.photo_url;
    relationship = gRecord.relationship;
  } else {
    // Fallback to umkm_profiles table
    const { data: record } = await supabaseAdmin
      .from('umkm_profiles')
      .select('*')
      .eq('owner_url', slug)
      .maybeSingle();

    if (record) {
      recipient = record.nama_umkm;
      sender = record.deskripsi;
      photo = record.logo_url;
      relationship = record.marketplace_url;
    }
  }

  if (!recipient) {
    return (
      <div className="mobile-app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '32px 24px', maxWidth: '420px', width: '100%' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍🎂</div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
            Kartu Ucapan Belum Ditemukan
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px', lineHeight: '1.6' }}>
            Tautan ucapan ini mungkin sudah diperbarui atau belum dibuat. Ingin membuat kejutan untuk orang tersayang?
          </p>
          <Link
            href="/"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #F43F5E, #FB7185)',
              color: '#FFFFFF',
              fontWeight: '700',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)',
            }}
          >
            ✨ Buat Ucapan Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <GreetingExperience
      recipientName={recipient || 'Sahabat'}
      senderName={sender || 'Seseorang yang Menyayangimu'}
      photoUrl={photo || '/images/placeholder-card.svg'}
      relationship={relationship}
      slug={slug}
    />
  );
}
