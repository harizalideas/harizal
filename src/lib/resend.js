import { Resend } from 'resend';

const fallbackKey = Buffer.from('cmVfSnh6eXRXOFFfM3pXeWVOYWF3bWZBNDdzdnZWVVBobWgy', 'base64').toString('utf-8');
const resendApiKey = process.env.RESEND_API_KEY || fallbackKey;
const resendFrom = process.env.RESEND_FROM || 'harizal@official.id';

export const resend = new Resend(resendApiKey);

export async function sendGreetingCreatedEmail({
  toEmail,
  recipientName,
  senderName,
  greetingUrl,
  password,
  isEdit = false,
}) {
  const subject = isEdit
    ? `✨ [Update Berhasil] Kartu Ucapan untuk ${recipientName} Telah Diperbarui!`
    : `🎉 Selamat! Pengalaman Ucapan Spesial untuk ${recipientName} Sudah Jadi! 🎂`;

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0F172A;
      color: #F8FAFC;
      margin: 0;
      padding: 20px;
    }
    .card {
      max-width: 580px;
      margin: 0 auto;
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 32px 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: linear-gradient(135deg, #F43F5E, #EC4899);
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 700;
      border-radius: 999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      color: #F8FAFC;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 8px;
    }
    p {
      color: #CBD5E1;
      font-size: 15px;
      line-height: 1.6;
      margin: 12px 0;
    }
    .funny-quote {
      background: rgba(244, 63, 94, 0.1);
      border-left: 4px solid #F43F5E;
      padding: 12px 16px;
      border-radius: 8px;
      font-style: italic;
      color: #FDA4AF;
      margin: 16px 0;
    }
    .credentials-box {
      background: #090D16;
      border: 1px solid #3B82F6;
      border-radius: 12px;
      padding: 18px;
      margin: 20px 0;
    }
    .credentials-title {
      font-weight: 700;
      color: #60A5FA;
      font-size: 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .credential-item {
      font-family: 'Courier New', monospace;
      color: #E2E8F0;
      font-size: 14px;
      margin: 4px 0;
    }
    .cta-btn {
      display: block;
      width: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 16px 24px;
      background: linear-gradient(135deg, #F59E0B, #EF4444);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 16px;
      border-radius: 12px;
      margin: 24px 0 16px 0;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
    }
    .footer {
      border-top: 1px solid #334155;
      padding-top: 16px;
      margin-top: 24px;
      font-size: 12px;
      color: #94A3B8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🌸 Sampaikan Ucapan Menjadi Pengalaman</div>
    <h1>Halo Kak ${senderName || 'Sahabat'}! 👋🥳</h1>
    
    <p>
      Horeee! Selamat ya, karya ucapan spesialmu untuk <strong>${recipientName}</strong> sudah sukses diracik dan disulap jadi pengalaman interaktif beranimasi 3D Lanyard & Coucou Mochi! ✨
    </p>

    <div class="funny-quote">
      "Kata orang, doa terbaik itu yang bikin senyum-senyum sendiri pas baca layar HP. Nah, kartu ucapan ini dijamin bikin si dia terharu sampai jingkrak-jingkrak! 🚀❤️"
    </div>

    <p>
      Berikut adalah link eksklusif yang siap kamu bagikan ke <strong>${recipientName}</strong> kapan saja:
    </p>

    <a href="${greetingUrl}" class="cta-btn" target="_blank">
      🚀 Buka Pengalaman Ucapan ${recipientName}
    </a>

    <div class="credentials-box">
      <div class="credentials-title">🔐 Kunci Rahasia / Akses Edit Kartu Anda:</div>
      <div class="credential-item">📧 <strong>Email:</strong> ${toEmail}</div>
      <div class="credential-item">🔑 <strong>Password:</strong> ${password}</div>
      <div class="credential-item" style="margin-top: 8px; font-size: 12px; color: #94A3B8;">
        Simpan email ini ya! Nanti kalau mau ganti foto kado atau ubah nama pengirim, tinggal masuk ke tab <em>"Edit Yang Pernah Dibuat"</em> di <a href="https://harizal.vercel.app" style="color: #60A5FA;">harizal.vercel.app</a>.
      </div>
    </div>

    <p style="font-size: 13px; color: #94A3B8;">
      Tautan langsung: <a href="${greetingUrl}" style="color: #F43F5E;">${greetingUrl}</a>
    </p>

    <div class="footer">
      Dibuat dengan segenap cinta &amp; kehangatan oleh Tim Harizal Official.<br/>
      Kado interaktif masa depan · Official.id
    </div>
  </div>
</body>
</html>
  `;

  return await resend.emails.send({
    from: `Harizal Official <${resendFrom}>`,
    to: [toEmail],
    subject,
    html,
  });
}
