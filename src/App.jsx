import React, { useState, useRef } from 'react';
import SideMenu from './components/SideMenu';
import PandaSVG from './components/PandaSVG';
import LanyardSVG from './components/LanyardSVG';
import { usePandaAnimation } from './hooks/usePandaAnimation';
import { useLanyardAnimation } from './hooks/useLanyardAnimation';
import { usePandaInteraction } from './hooks/usePandaInteraction';
import './styles/App.css';
import harizalImage from './assets/harizal.png';
import AnimatedTitle from './components/AnimatedTitle'; // Pastikan ini diimpor

const App = () => {
  const [jump, setJump] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isLanyardHovering, setIsLanyardHovering] = useState(false);
  
  const svgRef = useRef(null);
  const lanyardRef = useRef(null);

  usePandaAnimation(jump, setJump, svgRef);
  useLanyardAnimation(isLanyardHovering, lanyardRef);
  usePandaInteraction(jump, setJump, setIsHovering, svgRef);

  return (
    <div className="app-container">
      <SideMenu />
      <AnimatedTitle />

      <div 
        className="panda-container"
        style={{
          transform: 'scale(2)' // Panda tetap 2x
        }}
      >
        <div className="panda-wrapper">
          <PandaSVG innerRef={svgRef} isHovering={isHovering} />
          <div className="shadow" />
        </div>
      </div>

      <a 
        href="https://kabayan.id"
        target="_blank"
        rel="noopener noreferrer"
        className="lanyard-container"
        onMouseEnter={() => setIsLanyardHovering(true)}
        onMouseLeave={() => setIsLanyardHovering(false)}
        style={{ 
          // =====================================================================
          // PERBAIKAN: Atur ulang lebar dan paksa ke kanan
          // =====================================================================
          width: '300px', // Ukuran yang lebih wajar
          top: 0,
          right: '50px', // Paksa menempel 50px dari kanan
          left: 'auto', // Hapus referensi ke kiri
          cursor: 'pointer'
        }} 
      >
        <LanyardSVG innerRef={lanyardRef} imageUrl={harizalImage} />
      </a>
    </div>
  );
};

export default App;