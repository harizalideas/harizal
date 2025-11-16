import React from 'react';
import {
  MdSecurity,
  MdDesignServices,
  MdAnalytics,
  MdCampaign,
  MdEmail
} from 'react-icons/md';
import { FaReact, FaLinkedin, FaInstagram } from 'react-icons/fa';

// Objek untuk memetakan nama string ke komponen ikon
const iconMap = {
  MdSecurity,
  MdDesignServices,
  MdAnalytics,
  FaReact,
  MdCampaign,
  FaLinkedin,
  FaInstagram,
  MdEmail
};

const ContentPanel = ({ item, position = 400, opacity = 0 }) => {

  if (!item) return null;

  const renderContent = () => {
    // Jika konten adalah array (Keahlian & Hubungi Kami)
    if (Array.isArray(item.content)) {
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {item.content.map((line, index) => {
            const IconComponent = iconMap[line.icon];
            const isLink = item.id === 'contact';
            
            return (
              <li key={index} style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '18px', 
                fontSize: '18px',
                lineHeight: '1.7',
                color: '#34495E',
              }}>
                {IconComponent && (
                  <IconComponent
                    style={{
                      marginRight: '14px',
                      fontSize: '22px',
                      color: '#51A8B1', 
                      flexShrink: 0
                    }}
                  />
                )}
                
                {isLink ? (
                  <a 
                    href={line.text} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#34495E',
                      textDecoration: 'underline',
                      wordBreak: 'break-all'
                    }}
                  >
                    {line.text}
                  </a>
                ) : (
                  <span>{line.text}</span>
                )}
              </li>
            );
          })}
        </ul>
      );
    }

    // Jika konten adalah string (Tentang Saya & Pengalaman)
    return (
      <p style={{
        fontSize: '18px',
        lineHeight: '1.9', 
        color: '#34495E',
        whiteSpace: 'pre-line', 
        margin: 0
      }}>
        {item.content}
      </p>
    );
  };

  return (
    <div
      className="content-panel"
      style={{
        position: 'absolute',
        top: '35px', 
        height: 'calc(100vh - 70px)',
        left: `${position}px`,
        width: '450px', 
        padding: '60px 40px 40px 40px', 
        boxSizing: 'border-box',
        zIndex: 30, // zIndex (30) sudah benar (di atas Title 10, di bawah SideMenu 35)
        opacity: opacity, 
        transition: 'left 0.1s linear, opacity 0.1s linear',
        overflow: 'hidden',
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
        borderRadius: '0 20px 20px 0',
        
        // =====================================================================
        // PERBAIKAN: Perkuat efek blur
        // =====================================================================
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
      }}
    >
      {/* SVG Latar Belakang */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width="100%" height="100%" version="1.1"
        style={{
          shapeRendering: 'geometricPrecision', textRendering: 'geometricPrecision', 
          imageRendering: 'optimizeQuality', fillRule: 'evenodd', clipRule: 'evenodd',
          position: 'absolute', top: 0, left: 0, zIndex: 0,
        }}
        viewBox="0 0 355.56 572.11"
        preserveAspectRatio="none" 
      >
        <defs>
          <style type="text/css">
            {/* =====================================================================
            // PERBAIKAN: Buat lebih transparan (50%) agar blur terlihat
            // ===================================================================== */}
            {`.fil0 {fill:rgba(230, 230, 230, 0.5)}`}
          </style>
        </defs>
        <g id="Layer_x0020_1">
          <path className="fil0" d="M0 0l338.27 0c9.51,0 17.29,7.78 17.29,17.29l0 537.53c0,9.51 -7.78,17.29 -17.29,17.29l-338.27 0 0 -572.11z"/>
        </g>
      </svg>
      
      {/* Wrapper Konten */}
      <div 
        className="content-wrapper"
        style={{
          position: 'relative', zIndex: 1, 
          width: '100%', height: '100%', 
          display: 'flex', flexDirection: 'column',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Judul */}
        <h2 style={{
          margin: '0 0 25px 0', 
          fontSize: '32px', 
          color: '#2C3E50',
          fontWeight: '700',
          flexShrink: 0,
          fontFamily: "'Inter', sans-serif"
        }}>
          {item.title}
        </h2>
        
        {/* Teks / List Konten */}
        <div style={{
          flexGrow: 1, 
          overflowY: 'auto',
          paddingRight: '15px', 
        }}>
          {renderContent()}
        </div>
      </div> {/* Akhir dari content-wrapper */}
      
    </div>
  );
};

export default ContentPanel;