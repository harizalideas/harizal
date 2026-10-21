import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { sendGreetingCreatedEmail } from '@/lib/resend';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    // 1. Handling Login / Fetch Greeting Data (Returns all cards for this user)
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
        const matchingGList = gRecords.filter(
          (r) => r.password === password || r.password === null
        );

        if (matchingGList.length === 0) {
          return NextResponse.json(
            { error: 'Password yang Anda masukkan salah. Mohon periksa kembali email Anda.' },
            { status: 401 }
          );
        }

        const mappedGreetings = matchingGList.map((g) => ({
          id: g.id,
          recipient_name: g.recipient_name,
          sender_name: g.sender_name,
          photo_url: g.photo_url,
          relationship: g.relationship || 'parent_to_child',
          slug: g.slug,
          email: g.email,
          created_at: g.created_at,
        }));

        return NextResponse.json({
          success: true,
          greetings: mappedGreetings,
          greeting: mappedGreetings[0], // primary / latest card
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
      const matchingRecordList = records.filter(
        (r) => r.tiktok_url === password || r.tiktok_url === null
      );

      if (matchingRecordList.length === 0) {
        return NextResponse.json(
          { error: 'Password yang Anda masukkan salah. Mohon periksa kembali email Anda.' },
          { status: 401 }
        );
      }

      const mappedRecords = matchingRecordList.map((r) => ({
        id: r.id,
        recipient_name: r.nama_umkm,
        sender_name: r.deskripsi,
        photo_url: r.logo_url,
        relationship: r.marketplace_url || 'parent_to_child',
        slug: r.owner_url,
        email: r.instagram_url,
        created_at: r.created_at,
      }));

      return NextResponse.json({
        success: true,
        greetings: mappedRecords,
        greeting: mappedRecords[0],
      });
    }

    // 2. Handling Update with FormData (supports new photo upload, relationship, and specific card id/slug)
    const formData = await request.formData();
    const id = formData.get('id')?.trim();
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

    // Target the specific greeting by id or slug first, fallback to first matching password
    const targetG = gRecords?.find(
      (r) =>
        ((id && r.id === id) || (slug && r.slug === slug)) &&
        (r.password === password || !r.password)
    ) || gRecords?.find((r) => r.password === password || !r.password);

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

    const targetRecord = records?.find(
      (r) =>
        ((id && r.id === id) || (slug && r.owner_url === slug)) &&
        (r.tiktok_url === password || !r.tiktok_url)
    ) || records?.find((r) => r.tiktok_url === password || !r.tiktok_url);

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
