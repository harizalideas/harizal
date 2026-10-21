/**
 * Relationship categories and context-aware greeting templates
 * Options A through L:
 * A. Orang Tua ke Anak (parent_to_child)
 * B. Anak ke Orang Tua (child_to_parent)
 * C. Pacar Pria ke Pacar Wanita (boyfriend_to_girlfriend)
 * D. Pacar Wanita ke Pacar Pria (girlfriend_to_boyfriend)
 * E. Suami ke Istri (husband_to_wife)
 * F. Istri ke Suami (wife_to_husband)
 * G. Sahabat ke Sahabat (bestfriend_to_bestfriend)
 * H. Teman ke Teman (friend_to_friend)
 * I. Teman Kerja ke Teman Kerja (coworker_to_coworker)
 * J. Siswa kepada Guru (student_to_teacher)
 * K. Yang Muda kepada Orang yang Lebih Tua (younger_to_elder)
 * L. Yang Lebih Tua kepada yang Lebih Muda (elder_to_younger)
 */

export const RELATIONSHIP_OPTIONS = [
  { id: 'parent_to_child', label: 'Orang Tua ke Anak', icon: '👨‍👧', group: 'Keluarga' },
  { id: 'child_to_parent', label: 'Anak ke Orang Tua', icon: '👵', group: 'Keluarga' },
  { id: 'husband_to_wife', label: 'Suami ke Istri', icon: '💍', group: 'Pasangan' },
  { id: 'wife_to_husband', label: 'Istri ke Suami', icon: '🛡️', group: 'Pasangan' },
  { id: 'boyfriend_to_girlfriend', label: 'Pacar Pria ke Pacar Wanita', icon: '🌹', group: 'Pasangan' },
  { id: 'girlfriend_to_boyfriend', label: 'Pacar Wanita ke Pacar Pria', icon: '🌟', group: 'Pasangan' },
  { id: 'bestfriend_to_bestfriend', label: 'Sahabat ke Sahabat', icon: '🤝', group: 'Pertemanan' },
  { id: 'friend_to_friend', label: 'Teman ke Teman', icon: '🎉', group: 'Pertemanan' },
  { id: 'coworker_to_coworker', label: 'Teman Kerja ke Teman Kerja', icon: '💼', group: 'Profesional' },
  { id: 'student_to_teacher', label: 'Siswa kepada Guru', icon: '📚', group: 'Pendidikan' },
  { id: 'younger_to_elder', label: 'Yang Muda kepada yang Lebih Tua', icon: '🌿', group: 'Sosial' },
  { id: 'elder_to_younger', label: 'Yang Lebih Tua kepada yang Lebih Muda', icon: '💫', group: 'Sosial' },
];

export function detectRelationship(rawRelationship, recipientName = '', senderName = '') {
  if (rawRelationship && RELATIONSHIP_OPTIONS.some((r) => r.id === rawRelationship)) {
    return rawRelationship;
  }

  const rec = (recipientName || '').toLowerCase();
  const snd = (senderName || '').toLowerCase();

  // Special cases or smart keywords
  if (rec.includes('luthfan') || snd.includes('ayah') || snd.includes('ibu') || snd.includes('mama') || snd.includes('papa') || snd.includes('bunda') || snd.includes('abi') || snd.includes('umi')) {
    return 'parent_to_child';
  }
  if (rec.includes('ayah') || rec.includes('ibu') || rec.includes('mama') || rec.includes('papa') || rec.includes('bunda')) {
    return 'child_to_parent';
  }
  if (snd.includes('suami') || rec.includes('istri')) {
    return 'husband_to_wife';
  }
  if (snd.includes('istri') || rec.includes('suami')) {
    return 'wife_to_husband';
  }
  if (rec.includes('guru') || rec.includes('ustadz') || rec.includes('ustadzah') || rec.includes('dosen')) {
    return 'student_to_teacher';
  }

  return 'bestfriend_to_bestfriend';
}

export function getGreetingContext(relationshipKey, recipientName = 'Sahabat', senderName = 'Kami') {
  const rel = detectRelationship(relationshipKey, recipientName, senderName);

  switch (rel) {
    case 'parent_to_child':
      return {
        relationship: 'parent_to_child',
        tagline: `KASIH ABADI DARI ORANG TUA UNTUK ${recipientName.toUpperCase()} TERCINTA`,
        letterTitle: 'Pesan Hangat Dari Ayah & Ibu',
        letterGreeting: `Untuk Anakku Tersayang, ${recipientName},`,
        letterParagraphs: [
          `Di hari lahirmu yang penuh berkah ini, rasa syukur tak terhingga senantiasa kami panjatkan kepada Allah SWT atas anugerah terindah berupa kehadiranmu dalam hidup kami.`,
          `Melihatmu tumbuh menjadi pribadi yang berakhlak mulia, tangguh, dan penuh kebaikan adalah kebahagiaan serta kebanggaan terbesar bagi kami sebagai orang tua.`,
          `Doa kami (${senderName}) akan senantiasa mengalir di setiap sujud dan hembusan nafas. Semoga Allah SWT senantiasa melimpahkan kesehatan, umur panjang yang barakah, kelapangan rezeki halal, ilmu yang bermanfaat, serta kemudahan dalam meraih seluruh impian dan cita-cita ${recipientName} di dunia dan akhirat.`,
        ],
        letterSignature: `Dengan segenap cinta, kasih sayang, dan doa tulus tanpa batas, ${senderName} ❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} ❤️`,
            text: `Selamat ulang tahun anakku tersayang, ${recipientName}! Sehat selalu, berbakti, sukses dunia akhirat, dan senantiasa dalam lindungan Allah SWT. Pintu doa kami selalu terbuka untukmu. 🤲🌟`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: `Keluarga Besar ${senderName}`,
            text: `Barakallahu fii umrik ${recipientName}! Tumbuhlah menjadi kebanggaan keluarga yang sholeh/sholehah, tangguh, dan membawa keberkahan bagi banyak orang! 🎂✨`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Horeee selamat ulang tahun Kak ${recipientName}! Mochi ikut berdoa agar semua harapan mulia Kak ${recipientName} dikabulkan Allah! 🐾🎉`,
            time: 'Baru saja',
          },
        ],
      };

    case 'child_to_parent':
      return {
        relationship: 'child_to_parent',
        tagline: `BAKTI, HORMAT & CINTA TERDALAM UNTUK ${recipientName.toUpperCase()} TERCINTA`,
        letterTitle: 'Pesan Cinta & Bakti Tulus',
        letterGreeting: `Untuk ${recipientName} Tercinta,`,
        letterParagraphs: [
          `Selamat ulang tahun untuk sosok panutan hidupku yang paling luar biasa. Tiada kata yang sanggup melukiskan betapa bersyukurnya aku terlahir dan dibimbing olehmu.`,
          `Terima kasih atas segala cucuran peluh, pengorbanan tanpa pamrih, nasihat berharga, dan kasih sayang tanpa batas yang tak pernah putus kau berikan siang dan malam.`,
          `Di usiamu yang bertambah ini, doaku (${senderName}) memohon kepada Allah SWT agar melimpahkan kesehatan paripurna, ketenangan jiwa, umur yang penuh berkah, kebahagiaan di hari tua, serta ganjaran surga firdaus kelak.`,
        ],
        letterSignature: `Bakti, cinta tulus, dan peluk hangat dari anakmu, ${senderName} 🌸❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 💖`,
            text: `Barakallah fii umrik ${recipientName} tercinta. Semoga sehat selalu, panjang umur, bahagia, dan selalu diberkahi oleh Allah SWT. Terima kasih atas semua kasih sayangmu yang tulus. 🤲🌸`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: `Keluarga Besar`,
            text: `Selamat milad ${recipientName}! Semoga limpahan rahmat, rezeki berkah, dan ketenteraman hidup senantiasa menyertai setiap langkah. 🌟🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun ${recipientName}! Mochi kirim peluk hangat dan doa semoga selalu sehat dan bahagia! 🐾💖`,
            time: 'Baru saja',
          },
        ],
      };

    case 'boyfriend_to_girlfriend':
      return {
        relationship: 'boyfriend_to_girlfriend',
        tagline: `HARI SPESIAL UNTUK WANITA TERINDAH DALAM HIDUPKU 🌹`,
        letterTitle: 'Pesan Manis Dari Lubuk Hatiku',
        letterGreeting: `Untuk ${recipientName} Cantikku Tersayang,`,
        letterParagraphs: [
          `Selamat ulang tahun untuk wanita yang selalu berhasil membuat hariku lebih cerah dan duniaku terasa jauh lebih indah. Selamat bertambah usia, sayang.`,
          `Terima kasih telah hadir dengan ketulusanmu, senyuman manismu, dan kesabaranmu menemani setiap langkah perjalananku. Bersamamu, segalanya terasa begitu berarti.`,
          `Semoga di usiamu yang baru ini, Allah SWT melimpahkan kesehatan, kebahagiaan yang meluap, kemudahan dalam setiap urusan, serta mengabulkan semua impian indahmu. Aku (${senderName}) berjanji akan selalu ada di sisimu, menjaga dan mendukungmu selalu.`,
        ],
        letterSignature: `Peluk hangat penuh cinta dari kekasihmu, ${senderName} 🌹❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 🌹❤️`,
            text: `Happy birthday sayangku, ${recipientName}! Semoga makin cantik, bahagia selalu, dan semua impianmu lekas terwujud. I love you so much! 🌹✨`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Sahabat & Teman Dekat',
            text: `Happy birthday ${recipientName}! Semoga panjang umur, sukses selalu, dan langgeng bahagia bersama ${senderName}! 🥳🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Kak ${recipientName}! Tetap manis, ceria, dan bersinar selalu ya! 🐾🌸`,
            time: 'Baru saja',
          },
        ],
      };

    case 'girlfriend_to_boyfriend':
      return {
        relationship: 'girlfriend_to_boyfriend',
        tagline: `HARI ISTIMEWA UNTUK PRIA HEBAT PENJAGA HATIKU 🌟`,
        letterTitle: 'Surat Penuh Cinta Untukmu',
        letterGreeting: `Untuk ${recipientName} Tersayang,`,
        letterParagraphs: [
          `Selamat ulang tahun untuk pria terhebat, teman cerita paling nyaman, dan orang yang paling kusayangi di dunia ini.`,
          `Terima kasih atas perlindunganmu, kerja kerasmu, kesabaranmu menghadapi sifatku, dan kasih sayang tulus yang selalu kamu berikan setiap hari.`,
          `Semoga di usia yang baru ini, kamu senantiasa diberikan kesehatan prima, kelapangan rezeki, kesuksesan besar dalam setiap ikhtiarmu, dan keberkahan di setiap langkah. Aku (${senderName}) selalu bangga padamu dan akan selalu ada menyemangatimu.`,
        ],
        letterSignature: `Cinta dan peluk hangat selalu dari kekasihmu, ${senderName} 💖`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 💖`,
            text: `Happy birthday sayangku, ${recipientName}! Semoga sehat selalu, lancar rezeki, sukses segala urusan, dan makin sayang sama aku. Proud of you always! 🎂✨`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Sahabat & Kawan Karib',
            text: `Selamat ulang tahun bro ${recipientName}! Semoga makin sukses karirnya, sehat selalu, dan langgeng terus bersama ${senderName}! 🍻🎉`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Kak ${recipientName}! Semangat terus pantang menyerah dan raih mimpimu! 🐾🎈`,
            time: 'Baru saja',
          },
        ],
      };

    case 'husband_to_wife':
      return {
        relationship: 'husband_to_wife',
        tagline: `HARI LAHIR BELAHAN JIWAKU & IBU DARI ANAK-ANAKKU 💐`,
        letterTitle: 'Pesan Cinta Dari Suamimu',
        letterGreeting: `Untuk Istriku Tercinta, ${recipientName},`,
        letterParagraphs: [
          `Barakallahu fii umrik bidadari duniaku. Di hari bahagiamu ini, aku bersyukur sedalam-dalamnya kepada Allah SWT yang telah memilihmu sebagai pendamping setia perjalanan hidupku.`,
          `Terima kasih atas segala pengorbananmu yang tak terhitung, ketulusanmu merawat rumah tangga kita, serta senyummu yang selalu menjadi penyejuk jiwa di kala lelah.`,
          `Doaku (${senderName}) memohon agar Allah senantiasa melindungimu, melimpahkan kesehatan, memanjangkan umurmu dalam ketaatan, dan meridhoi ikatan cinta suci kita hingga ke jannah-Nya kelak.`,
        ],
        letterSignature: `Dari suamimu yang senantiasa mencintaimu karena Allah, ${senderName} 💍❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `Suamimu, ${senderName} 💍`,
            text: `Selamat ulang tahun istriku sayang, ${recipientName}! Terima kasih sudah menjadi istri terbaik dan cahaya di rumah kita. Sehat dan bahagia selalu bersamaku. 🤲🌸`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Keluarga Tercinta',
            text: `Barakallah fii umrik ${recipientName}! Semoga selalu dilimpahi sakinah, mawaddah, wa rahmah, dan keberkahan rumah tangga yang abadi. 🏡🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Ibu ${recipientName}! Semoga rumah tangga selalu dipenuhi canda, tawa, dan kebahagiaan! 🐾💖`,
            time: 'Baru saja',
          },
        ],
      };

    case 'wife_to_husband':
      return {
        relationship: 'wife_to_husband',
        tagline: `DOA TULUS UNTUK IMAM, PELINDUNG, DAN KEPALA KELUARGAKU 🛡️`,
        letterTitle: 'Untaian Doa Dari Istrimu',
        letterGreeting: `Untuk Suamiku Tercinta, ${recipientName},`,
        letterParagraphs: [
          `Selamat ulang tahun imamku tercinta. Hari ini adalah hari istimewa untuk sosok pria yang memimpin keluarga kecil kita dengan penuh ketulusan, tanggung jawab, dan kelembutan.`,
          `Terima kasih atas setiap tetes keringatmu dalam mencari nafkah halal, perlindunganmu yang menentramkan hatiku, serta bimbinganmu yang selalu mendekatkan kita kepada kebaikan.`,
          `Semoga Allah SWT melimpahkan kesehatan paripurna, umur yang berkah, melapangkan pintu rezeki dari arah yang tak disangka, serta mempermudah setiap urusanmu. Aku (${senderName}) akan senantiasa setia mendampingi dan mendoakanmu di setiap hela nafasku.`,
        ],
        letterSignature: `Istrimu yang selalu mencintaimu dan bangga padamu, ${senderName} ❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `Istrimu, ${senderName} ❤️`,
            text: `Selamat ulang tahun suamiku tercinta, ${recipientName}! Semoga selalu sehat, dimudahkan rezekinya, dan menjadi imam yang senantiasa diridhoi Allah SWT. Amin. 🤲✨`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Keluarga Besar',
            text: `Barakallahu fii umrik ${recipientName}! Semoga makin sukses, bijaksana dalam memimpin keluarga, dan berkah selalu kehidupannya. 🌟🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Bapak ${recipientName}! Terima kasih sudah menjadi sosok pelindung yang hebat dan penyayang! 🐾🎉`,
            time: 'Baru saja',
          },
        ],
      };

    case 'bestfriend_to_bestfriend':
      return {
        relationship: 'bestfriend_to_bestfriend',
        tagline: `HARI SPESIAL UNTUK SAHABAT SEJATI DALAM SUKA & DUKA 🤝`,
        letterTitle: 'Pesan Hangat Dari Kami',
        letterGreeting: `Untuk Sahabat Sejatiku, ${recipientName},`,
        letterParagraphs: [
          `Di hari yang penuh kebahagiaan ini, kami ingin mengucapkan Selamat Ulang Tahun yang paling hangat dan penuh berkah.`,
          `Bagi kami (${senderName}), ${recipientName} bukan sekadar sahabat, tapi sudah menjadi bagian keluarga yang begitu berharga dan kami sayangi.`,
          `Terima kasih atas segala tawa, ketulusan, dan kebaikan yang selalu mengalir selama ini. Semoga Allah SWT senantiasa menganugerahkan kesehatan, umur penuh berkah, kebahagiaan lahir batin, kelapangan rezeki, serta kemudahan dalam menggapai setiap impian dan cita-cita ${recipientName}.`,
        ],
        letterSignature: `Peluk hangat & doa tulus, ${senderName} ❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} ❤️`,
            text: `Selamat ulang tahun ${recipientName} sayang! Makasih udah selalu jadi sahabat terbaik dan keluarga buat kami. Sehat terus, bahagia selalu, dan lancar semua urusannya ya! 🤲🌸`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: `Keluarga Besar ${senderName}`,
            text: `Barakallahu fii umrik ${recipientName}! Semoga di usia yang baru ini Allah limpahkan berkah berlipat ganda, rezeki melimpah, serta kebahagiaan dunia akhirat! 🌟🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Horeee selamat ulang tahun Kak ${recipientName}! Mochi ikut berdoa agar semua harapan Kak ${recipientName} terwujud! 🐾✨`,
            time: 'Baru saja',
          },
        ],
      };

    case 'friend_to_friend':
      return {
        relationship: 'friend_to_friend',
        tagline: `SELAMAT MERAYAKAN HARI KELAHIRAN PENUH KECERIAAN 🎉`,
        letterTitle: 'Ucapan Hangat Dari Teman',
        letterGreeting: `Halo ${recipientName},`,
        letterParagraphs: [
          `Selamat ulang tahun! Senang sekali bisa berteman denganmu dan berbagi momen-momen penuh canda tawa dan kebaikan bersama.`,
          `Semoga di usia yang baru ini, setiap harimu selalu dipenuhi dengan hal-hal positif, inspirasi baru, dan energi kebahagiaan.`,
          `Doa kami (${senderName}) semoga kamu senantiasa diberikan kesehatan, tercapai segala rencana dan impian di tahun ini, serta dikelilingi orang-orang yang tulus menyayangimu. Sukses selalu untuk ${recipientName}!`,
        ],
        letterSignature: `Salam hangat dan doa terbaik dari temanmu, ${senderName} 🎈`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 🎈`,
            text: `Selamat ulang tahun ${recipientName}! Semoga panjang umur, sehat selalu, lancar segala urusan, dan sukses dalam setiap rencana! 🎂🎉`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Kawan-kawan Sekitar',
            text: `Happy Birthday ${recipientName}! Semoga hari ulang tahun ini membawa banyak berkah, rezeki, dan kebahagiaan! 🥳✨`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Kak ${recipientName}! Semoga harimu ceria terus dan penuh semangat! 🐾🍰`,
            time: 'Baru saja',
          },
        ],
      };

    case 'coworker_to_coworker':
      return {
        relationship: 'coworker_to_coworker',
        tagline: `SELAMAT ULANG TAHUN PARTNER KERJA TERBAIK & PROFESIONAL 💼`,
        letterTitle: 'Apresiasi & Doa Rekan Kerja',
        letterGreeting: `Untuk Rekan Kerja Terbaik, ${recipientName},`,
        letterParagraphs: [
          `Selamat ulang tahun! Bekerja sama dan berkolaborasi denganmu adalah pengalaman yang selalu menyenangkan, produktif, dan menginspirasi.`,
          `Terima kasih atas dedikasi tinggi, kerja sama solid, profesionalisme, serta semangat positif yang selalu kamu bawa ke dalam tim.`,
          `Semoga di usia yang baru ini kamu senantiasa dianugerahi kesehatan prima, pencapaian karir yang gemilang, kemudahan dalam setiap proyek, serta kebahagiaan hidup yang seimbang bersama keluarga tercinta.`,
        ],
        letterSignature: `Salam hangat dan sukses selalu dari rekanmu, ${senderName} 💼🤝`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 💼`,
            text: `Happy birthday ${recipientName}! Sukses terus untuk karirnya, sehat selalu, dan semoga makin bersinar di setiap langkah profesionalmu! 🎂📊`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Rekan-rekan Satu Tim',
            text: `Selamat ulang tahun rekan ${recipientName}! Terima kasih atas kerja samanya yang luar biasa selama ini. Wish you all the best! 🚀🎉`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Kak ${recipientName}! Semangat kerjanya tinggi dan jangan lupa nikmati hari spesialmu! 🐾☕`,
            time: 'Baru saja',
          },
        ],
      };

    case 'student_to_teacher':
      return {
        relationship: 'student_to_teacher',
        tagline: `PENGHORMATAN & DOA TULUS UNTUK GURU PEMBIMBING TERBAIK 📚`,
        letterTitle: 'Ungkapan Rasa Terima Kasih Murid',
        letterGreeting: `Yang Terhormat Bapak/Ibu ${recipientName},`,
        letterParagraphs: [
          `Dengan segenap ketulusan hati, kami mengucapkan Selamat Ulang Tahun kepada Bapak/Ibu guru yang amat kami muliakan dan hormati.`,
          `Terima kasih tak terhingga atas setiap butir ilmu bermanfaat, kesabaran tanpa batas dalam mendidik, keteladanan budi pekerti, serta kasih sayang yang telah dicurahkan kepada kami.`,
          `Doa kami (${senderName}) memohon kepada Tuhan Yang Maha Esa agar Bapak/Ibu senantiasa dianugerahi kesehatan paripurna, umur panjang yang penuh barakah, ketenteraman keluarga, serta pahala yang terus mengalir atas setiap ilmu yang telah diajarkan.`,
        ],
        letterSignature: `Hormat dan takzim dari muridmu, ${senderName} 📖✨`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 📚`,
            text: `Selamat ulang tahun Bapak/Ibu ${recipientName}. Semoga senantiasa sehat, panjang umur, dan terus menjadi pelita inspirasi bagi kami murid-muridmu. 🤲🌸`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Perwakilan Siswa & Alumni',
            text: `Barakallah fii umrik untuk guru tercinta kami, ${recipientName}. Terima kasih atas segala bimbingan dan teladan berharganya. 🎓🎂`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Bapak/Ibu Guru ${recipientName}! Mochi ikut mendoakan semoga sehat dan bahagia selalu! 🐾🌷`,
            time: 'Baru saja',
          },
        ],
      };

    case 'younger_to_elder':
      return {
        relationship: 'younger_to_elder',
        tagline: `PENGHORMATAN & DOA KESELAMATAN UNTUK YANG KAMI MULIAKAN 🌿`,
        letterTitle: 'Untaian Doa & Rasa Takzim',
        letterGreeting: `Kepada ${recipientName} yang Kami Hormati,`,
        letterParagraphs: [
          `Dengan penuh rasa hormat dan takzim, kami menyampaikan selamat hari lahir yang penuh berkah dan rahmat.`,
          `Bagi kami, ${recipientName} adalah sosok teladan yang sarat dengan kebijaksanaan hidup, nasihat berharga yang menenangkan, serta ketulusan yang mengayomi kami yang lebih muda.`,
          `Semoga di usia yang baru ini, Allah SWT senantiasa menganugerahkan kesehatan jasmani dan rohani, ketentraman hati, umur panjang yang dipenuhi barakah, serta perlindungan dari segala mara bahaya.`,
        ],
        letterSignature: `Salam takzim dan doa tulus dari yang muda, ${senderName} 🤲❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 🤲`,
            text: `Selamat ulang tahun ${recipientName}. Semoga Allah selalu memberikan kesehatan, umur panjang yang barakah, dan kebahagiaan lahir batin. Amin. 🌟🎂`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Keluarga & Kerabat',
            text: `Barakallahu fii umrik ${recipientName}. Semoga hari demi hari selalu dipenuhi limpahan rahmat dan kasih sayang-Nya. 🌸✨`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat milad ${recipientName}! Mochi mendoakan semoga selalu sehat walafiat dan diberkahi selalu! 🐾💖`,
            time: 'Baru saja',
          },
        ],
      };

    case 'elder_to_younger':
      return {
        relationship: 'elder_to_younger',
        tagline: `DOA & SAYANG DARI YANG LEBIH TUA UNTUK GENERASI MUDA 🌟`,
        letterTitle: 'Pesan Kasih & Harapan Mulia',
        letterGreeting: `Untuk ${recipientName} yang Kami Sayangi & Banggakan,`,
        letterParagraphs: [
          `Selamat bertambah usia adik/ananda tercinta. Rasanya waktu berlalu begitu cepat melihatmu kini tumbuh semakin dewasa, cerdas, dan bijaksana.`,
          `Masa depanmu membentang begitu luas dengan sejuta potensi indah yang menunggumu. Jangan pernah ragu untuk melangkah maju, teruslah berani bermimpi dan belajar dari setiap pengalaman hidup.`,
          `Doa kami (${senderName}) senantiasa menyertaimu agar menjadi insan yang tangguh, rendah hati, berakhlak mulia, dijauhkan dari marabahaya, serta dipermudah oleh Allah SWT dalam meraih seluruh cita-cita luhurmu.`,
        ],
        letterSignature: `Kasih sayang dan doa selalu dari, ${senderName} 💫❤️`,
        defaultWishes: [
          {
            id: 1,
            name: `${senderName} 💫`,
            text: `Selamat ulang tahun ${recipientName}! Terus semangat belajar dan berkarya, jaga akhlak, dan raihlah cita-citamu setinggi langit. Kami selalu bangga padamu! 🎂✨`,
            time: 'Hari ini',
          },
          {
            id: 2,
            name: 'Keluarga & Kakak-kakak',
            text: `HBD ${recipientName}! Semoga sehat selalu, cerdas, berbakti, dan banyak rezeki serta kemudahan hidup. 🚀🎉`,
            time: 'Hari ini',
          },
          {
            id: 3,
            name: 'Coucou (Mochi) 🐾',
            text: `Selamat ulang tahun Kak ${recipientName}! Ayo kita bermain dan kejar impian bersama Mochi! 🐾🎈`,
            time: 'Baru saja',
          },
        ],
      };

    default:
      return getGreetingContext('bestfriend_to_bestfriend', recipientName, senderName);
  }
}
