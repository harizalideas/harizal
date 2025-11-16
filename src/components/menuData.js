// src/components/menuData.js
export const menuItems = [
  {
    id: 'about',
    shape: 'circle',
    color: '#FF6B9D',
    title: 'Tentang Saya',
    // Konten ini tetap string karena formatnya paragraf
    content: `Perkenalkan, saya Harizal. Saya lulusan Teknik Informatika S1 dari STMIK JABAR pada tahun 2005. Perjalanan karier saya dimulai sebagai Junior Desktop Programmer di sebuah perusahaan IT di Jakarta.

Setelah itu, saya sempat mendirikan usaha sendiri di bidang agensi kreatif sebelum akhirnya bergabung dengan keluarga besar Kabayan Group sebagai Partnership Experience.

Secara profesional, saya memiliki spesialisasi di bidang Keamanan Siber dan Desain UI/UX. Di luar IT, saya juga seorang analis untuk berbagai studi kasus, khususnya di bidang ekonomi mikro dan ekonomi kreatif.`
  },
  {
    id: 'skills',
    shape: 'square',
    color: '#4ECDC4',
    title: 'Keahlian',
    // PERUBAHAN: Ubah 'content' menjadi array of objects
    content: [
      {
        icon: 'MdSecurity', // Nama ikon dari react-icons/md
        text: 'Analisa Keamanan Siber (Sertifikasi BNSP)'
      },
      {
        icon: 'MdDesignServices', // Nama ikon dari react-icons/md
        text: 'Desain UI/UX (Sertifikasi BNSP)'
      },
      {
        icon: 'MdAnalytics', // Nama ikon dari react-icons/md
        text: 'Data Analis (Sertifikasi Google Analytic)'
      },
      {
        icon: 'FaReact', // Nama ikon dari react-icons/fa
        text: 'Programming (React.js)'
      },
      {
        icon: 'MdCampaign', // Nama ikon dari react-icons/md
        text: 'Marketing'
      }
    ]
  },
  {
    id: 'projects',
    shape: 'pentagon',
    color: '#FFB347',
    title: 'Pengalaman',
    // Konten ini tetap string
    content: `Pengalaman Project:
• Pengembangan aplikasi desktop untuk pelayanan SIM - Korlantas POLRI
• Penyusunan Masterplan TIK - Kabupaten Kampar

Pengalaman Keamanan Siber:
• Penanganan insiden siber website BPSDM Kemenhub

Pengalaman Desain:
• Desain UI/UX untuk berbagai website company profile`
  },
  {
    id: 'contact',
    shape: 'star',
    color: '#FF6B6B',
    title: 'Hubungi Kami',
    // PERUBAHAN: Ubah 'content' menjadi array of objects
    content: [
      {
        icon: 'FaLinkedin', // Nama ikon dari react-icons/fa
        text: 'https://www.linkedin.com/in/harizalbanget/'
      },
      {
        icon: 'FaInstagram', // Nama ikon dari react-icons/fa
        text: 'https://instagram.com/harizal.official'
      },
      {
        icon: 'MdEmail', // Nama ikon dari react-icons/md
        text: 'harizal@kabayan.id'
      }
    ]
  }
];