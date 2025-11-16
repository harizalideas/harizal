// src/components/AnimatedTitle.jsx
import React from 'react';

const AnimatedTitle = () => {
  return (
    <h1 
      className="animated-title" 
      style={{
        position: 'absolute',
        // =====================================================================
        // PERBAIKAN: Posisi digeser ke kiri
        // =====================================================================
        top: '15vh', 
        left: '55%', // Diubah dari 65% (geser ke kiri)
        
        transform: 'translateX(-50%)',
        fontSize: '50px',
        fontFamily: "'Russo One', sans-serif", 
        fontWeight: 400, 
        zIndex: 10, 
        textAlign: 'center',
        lineHeight: '1.2' 
      }}
    >
      Digital<br />Consultant
    </h1>
  );
};

export default AnimatedTitle;