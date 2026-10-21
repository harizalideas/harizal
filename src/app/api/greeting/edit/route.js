import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sendGreetingCreatedEmail } from '@/lib/resend';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // 1. Handling Login / Fetch Greeting Data
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const email = body.email?.trim().toLowerCase();
      const password = body.password?.trim();

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Silakan masukkan email dan password akun Anda.' },
          { status: 400 }
        );
      }

      // Check greetings table first
      const { data: gRecords } = await supabaseAdmin
        .from('greetings')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (gRecords && gRecords.length > 0) {
        const matchingG = gRecords.find(
          (r) => r.password === password || r.password === null
        );

        if (!matchingG) {
          return NextResponse.json(
            { error: 'Password yang Anda masukkan salah. Mohon periksa kembali email Anda.' },
            { status: 401 }
          );
        }

        return NextResponse.json({
          success: true,
          greeting: {
            id: matchingG.id,
            recipient_name: matchingG.recipient_name,
            sender_name: matchingG.sender_name,
            photo_url: matchingG.photo_url,
            relationship: matchingG.relationship || 'parent_to_child',
            slug: matchingG.slug,
            email: matchingG.email,
          },
        });
      }

      // Fallback: Check umkm_profiles table
      const { data: records, error: dbError } = await supabaseAdmin
        .from('umkm_profiles')
        .select('*')
        .eq('instagram_url', email)
        .order('created_at', { ascending: false });

      if (dbError || !records || records.length === 0) {
        return NextResponse.json(
          { error: 'Akun dengan email tersebut belum terdaftar. Silakan buat kartu baru terlebih dahulu.' },
          { status: 404 }
        );
      }

      // Verify password
      const matchingRecord = records.find(
        (r) => r.tiktok_url === password || r.tiktok_url === null
      );

      if (!matchingRecord) {
        return NextResponse.json(
          { error: 'Password yang Anda masukkan salah. Mohon periksa kembali email Anda.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        greeting: {
          id: matchingRecord.id,
          recipient_name: matchingRecord.nama_umkm,
          sender_name: matchingRecord.deskripsi,
          photo_url: matchingRecord.logo_url,
          relationship: matchingRecord.marketplace_url || 'parent_to_child',
          slug: matchingRecord.owner_url,
          email: matchingRecord.instagram_url,
        },
      });
    }

    // 2. Handling Update with FormData (supports new photo upload and relationship change)
    const formData = await request.formData();
    const email = formData.get('email')?.trim().toLowerCase();
    const password = formData.get('password')?.trim();
    const recipientName = formData.get('recipient_name')?.trim();
    const senderName = formData.get('sender_name')?.trim();
    const relationship = formData.get('relationship')?.trim();
    const currentPhotoUrl = formData.get('current_photo_url')?.trim();
    const photoFile = formData.get('photo');
    const slug = formData.get('slug')?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password dibutuhkan untuk verifikasi.' },
        { status: 400 }
      );
    }

    // Check greetings table first
    const { data: gRecords } = await supabaseAdmin
      .from('greetings')
      .select('*')
      .eq('email', email);

    const targetG = gRecords?.find((r) => r.password === password || !r.password);

    if (targetG) {
      let finalPhotoUrl = currentPhotoUrl || targetG.photo_url || '/images/placeholder-card.svg';

      // Handle new photo if provided
      if (photoFile && typeof photoFile === 'object' && photoFile.size > 0) {
        try {
          const fileExt = photoFile.name?.split('.').pop() || 'jpg';
          const fileName = `gifts/${slug || targetG.slug}-${Date.now()}.${fileExt}`;
          const arrayBuffer = await photoFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('kado-gifts')
            .upload(fileName, buffer, {
              contentType: photoFile.type || 'image/jpeg',
              upsert: true,
            });

          if (!uploadError) {
            const { data: publicUrlData } = supabaseAdmin.storage
              .from('kado-gifts')
              .getPublicUrl(fileName);
            finalPhotoUrl = publicUrlData.publicUrl;
          }
        } catch (err) {
          console.error('Error uploading replacement photo:', err);
        }
      }

      // Update greetings table
      const { error: updateError } = await supabaseAdmin
        .from('greetings')
        .update({
          recipient_name: recipientName || targetG.recipient_name,
          sender_name: senderName || targetG.sender_name,
          photo_url: finalPhotoUrl,
          relationship: relationship || targetG.relationship || 'parent_to_child',
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetG.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Gagal memperbarui data: ' + updateError.message },
          { status: 500 }
        );
      }

      const host = request.headers.get('host') || 'harizal.vercel.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const activeSlug = targetG.slug;
      const greetingUrl = `${protocol}://${host}/${activeSlug}`;

      // Send update notification email via Resend
      try {
        await sendGreetingCreatedEmail({
          toEmail: email,
          recipientName: recipientName || targetG.recipient_name,
          senderName: senderName || targetG.sender_name,
          greetingUrl,
          password,
          isEdit: true,
        });
      } catch (mailErr) {
        console.warn('Update email notice failed:', mailErr);
      }

      return NextResponse.json({
        success: true,
        greetingUrl,
        slug: activeSlug,
        greeting: {
          id: targetG.id,
          recipient_name: recipientName || targetG.recipient_name,
          sender_name: senderName || targetG.sender_name,
          photo_url: finalPhotoUrl,
          relationship: relationship || targetG.relationship || 'parent_to_child',
          slug: activeSlug,
        },
      });
    }

    // Fallback: Check umkm_profiles table
    const { data: records } = await supabaseAdmin
      .from('umkm_profiles')
      .select('*')
      .eq('instagram_url', email);

    const targetRecord = records?.find((r) => r.tiktok_url === password || !r.tiktok_url);
    if (!targetRecord) {
      return NextResponse.json(
        { error: 'Verifikasi gagal. Email atau password tidak sesuai.' },
        { status: 401 }
      );
    }

    let finalPhotoUrl = currentPhotoUrl || targetRecord.logo_url || '/images/placeholder-card.svg';

    // Handle new photo if provided
    if (photoFile && typeof photoFile === 'object' && photoFile.size > 0) {
      try {
        const fileExt = photoFile.name?.split('.').pop() || 'jpg';
        const fileName = `gifts/${slug || 'kado'}-${Date.now()}.${fileExt}`;
        const arrayBuffer = await photoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('kado-gifts')
          .upload(fileName, buffer, {
            contentType: photoFile.type || 'image/jpeg',
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabaseAdmin.storage
            .from('kado-gifts')
            .getPublicUrl(fileName);
          finalPhotoUrl = publicUrlData.publicUrl;
        }
      } catch (err) {
        console.error('Error uploading replacement photo:', err);
      }
    }

    // Update in database
    const { error: updateError } = await supabaseAdmin
      .from('umkm_profiles')
      .update({
        nama_umkm: recipientName || targetRecord.nama_umkm,
        deskripsi: senderName || targetRecord.deskripsi,
        logo_url: finalPhotoUrl,
        marketplace_url: relationship || targetRecord.marketplace_url || 'parent_to_child',
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetRecord.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Gagal memperbarui data: ' + updateError.message },
        { status: 500 }
      );
    }

    const host = request.headers.get('host') || 'harizal.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const activeSlug = targetRecord.owner_url || slug;
    const greetingUrl = `${protocol}://${host}/${activeSlug}`;

    // Send update notification email via Resend
    try {
      await sendGreetingCreatedEmail({
        toEmail: email,
        recipientName: recipientName || targetRecord.nama_umkm,
        senderName: senderName || targetRecord.deskripsi,
        greetingUrl,
        password,
        isEdit: true,
      });
    } catch (mailErr) {
      console.warn('Update email notice failed:', mailErr);
    }

    return NextResponse.json({
      success: true,
      greetingUrl,
      slug: activeSlug,
      greeting: {
        id: targetRecord.id,
        recipient_name: recipientName || targetRecord.nama_umkm,
        sender_name: senderName || targetRecord.deskripsi,
        photo_url: finalPhotoUrl,
        relationship: relationship || targetRecord.marketplace_url || 'parent_to_child',
        slug: activeSlug,
      },
    });
  } catch (error) {
    console.error('Edit greeting error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem: ' + error.message },
      { status: 500 }
    );
  }
}
