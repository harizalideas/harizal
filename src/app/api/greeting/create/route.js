import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sendGreetingCreatedEmail } from '@/lib/resend';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const recipientName = formData.get('recipient_name')?.trim();
    const senderName = formData.get('sender_name')?.trim();
    const email = formData.get('email')?.trim().toLowerCase();
    const password = formData.get('password')?.trim();
    const relationship = formData.get('relationship')?.trim() || 'parent_to_child';
    const photoFile = formData.get('photo');

    if (!recipientName || !senderName || !email || !password) {
      return NextResponse.json(
        { error: 'Mohon lengkapi semua kolom yang wajib diisi.' },
        { status: 400 }
      );
    }

    // 1. Generate unique slug with 4-digit unique code (e.g. jane-doe-4829)
    const baseSlug = slugify(recipientName) || 'ucapan';
    let random4Digits = Math.floor(1000 + Math.random() * 9000);
    let slug = `${baseSlug}-${random4Digits}`;

    // Ensure absolute uniqueness against greetings and umkm_profiles
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const { data: gSlugs } = await supabaseAdmin
        .from('greetings')
        .select('slug')
        .eq('slug', slug);

      const { data: umkmSlugs } = await supabaseAdmin
        .from('umkm_profiles')
        .select('owner_url')
        .eq('owner_url', slug);

      if ((!gSlugs || gSlugs.length === 0) && (!umkmSlugs || umkmSlugs.length === 0)) {
        isUnique = true;
      } else {
        random4Digits = Math.floor(1000 + Math.random() * 9000);
        slug = `${baseSlug}-${random4Digits}`;
        attempts++;
      }
    }

    // 2. Handle photo upload
    let photoUrl = '/images/placeholder-card.svg'; // default generic placeholder
    if (photoFile && typeof photoFile === 'object' && photoFile.size > 0) {
      try {
        const fileExt = photoFile.name?.split('.').pop() || 'jpg';
        const fileName = `gifts/${slug}-${Date.now()}.${fileExt}`;
        const arrayBuffer = await photoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('kado-gifts')
          .upload(fileName, buffer, {
            contentType: photoFile.type || 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
        } else {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('kado-gifts')
            .getPublicUrl(fileName);
          photoUrl = publicUrlData.publicUrl;
        }
      } catch (uploadErr) {
        console.error('Photo processing failed:', uploadErr);
      }
    }

    // 3. Create or update user in Supabase Auth
    let authUserId = null;
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          recipient_name: recipientName,
          sender_name: senderName,
          slug,
          photo_url: photoUrl,
        },
      });

      if (authData?.user) {
        authUserId = authData.user.id;
      } else if (authError) {
        // User may already exist, let's update password
        const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
        const existing = userList?.users?.find((u) => u.email === email);
        if (existing) {
          authUserId = existing.id;
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password,
            user_metadata: {
              recipient_name: recipientName,
              sender_name: senderName,
              slug,
              photo_url: photoUrl,
            },
          });
        }
      }
    } catch (authErr) {
      console.warn('Auth creation warning:', authErr);
    }

    // 4. Save greeting record in Supabase database (supports greetings and umkm_profiles tables)
    let dbError = null;
    const { error: gError } = await supabaseAdmin
      .from('greetings')
      .insert({
        slug,
        recipient_name: recipientName,
        sender_name: senderName,
        photo_url: photoUrl,
        email,
        password,
        relationship,
        message: 'Doa & Ucapan Hangat Penuh Kasih',
      });

    if (gError) {
      const { error: umkmError } = await supabaseAdmin
        .from('umkm_profiles')
        .insert({
          user_id: authUserId,
          nama_umkm: recipientName,
          deskripsi: senderName,
          logo_url: photoUrl,
          owner_url: slug,
          instagram_url: email,
          tiktok_url: password,
          marketplace_url: relationship,
        });
      dbError = umkmError;
    }

    if (dbError && gError) {
      console.error('Database insert error:', dbError || gError);
      return NextResponse.json(
        { error: 'Gagal menyimpan ucapan ke database: ' + (dbError?.message || gError?.message) },
        { status: 500 }
      );
    }

    // Determine host for link
    const host = request.headers.get('host') || 'harizal.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const greetingUrl = `${protocol}://${host}/${slug}`;

    // 5. Send attractive & funny email via Resend
    let emailStatus = 'sent';
    try {
      await sendGreetingCreatedEmail({
        toEmail: email,
        recipientName,
        senderName,
        greetingUrl,
        password,
        isEdit: false,
      });
    } catch (emailErr) {
      console.error('Resend email error:', emailErr);
      emailStatus = 'failed: ' + emailErr.message;
    }

    return NextResponse.json({
      success: true,
      slug,
      greetingUrl,
      emailStatus,
      recipientName,
      senderName,
    });
  } catch (error) {
    console.error('Create greeting error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem: ' + error.message },
      { status: 500 }
    );
  }
}
