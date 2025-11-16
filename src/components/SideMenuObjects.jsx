import React, { useState, useRef, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const SideMenuObjects = ({ 
  onShapeDrag, 
  onShapeMove, 
  resetOtherShapes,
  shapePositions,
  onShapePositionChange 
}) => {
  // ... (SEMUA KODE FUNGSI DI SINI TETAP SAMA) ...
  // ... (handleSliderChange, handleShapeDragStart, etc.) ...
  
  const [activeSlider, setActiveSlider] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPosition, setDragStartPosition] = useState(0);

  const shapeRefs = useRef({
    circle: useRef(null),
    square: useRef(null),
    pentagon: useRef(null),
    star: useRef(null)
  });

  const railRefs = useRef({
    circle: useRef(null),
    square: useRef(null),
    pentagon: useRef(null),
    star: useRef(null)
  });

  // KONFIGURASI DIMENSI
  const railStart = 50;     
  const railWidth = 251;    
  const shapeWidth = 100;   
  const maxPosition = railWidth; 
  const startOffset = railStart - (shapeWidth / 2); 
  const shapeComponentLeftOffset = 60; 
  const rightPadding = 50; 
  const requiredBackgroundWidth = (shapeComponentLeftOffset + startOffset + maxPosition + shapeWidth) - 20 + rightPadding; 
  
  const handleSliderChange = (shape, event, newValue) => {
    updateShapePosition(shape, newValue);
  };

  const handleShapeDragStart = (shape, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setActiveSlider(shape);
    setDragStartX(e.clientX);
    setDragStartPosition(shapePositions[shape]);
    if (resetOtherShapes) {
      resetOtherShapes(shape);
    }
  };

  const handleShapeDrag = (e) => {
    if (!isDragging || !activeSlider) return;
    const railElement = railRefs.current[activeSlider]?.current;
    if (!railElement) return;
    const railRect = railElement.getBoundingClientRect();
    const mouseX = e.clientX - railRect.left;
    const rawPosition = mouseX - railStart;
    const newPosition = Math.max(0, Math.min(maxPosition, rawPosition));
    updateShapePosition(activeSlider, newPosition);
  };

  const handleShapeDragEnd = () => {
    setIsDragging(false);
    setActiveSlider(null);
  };

  const updateShapePosition = (shape, newValue) => {
    const clampedValue = Math.max(0, Math.min(maxPosition, newValue));
    if (onShapePositionChange) {
      onShapePositionChange(prev => ({
        ...prev,
        [shape]: clampedValue
      }));
    }
    const sliderElement = document.querySelector(`[data-slider="${shape}"] input`);
    if (sliderElement) {
      sliderElement.value = clampedValue;
    }
    const progress = clampedValue / maxPosition;
    if (onShapeMove) {
      onShapeMove(shape, progress);
    }
    if (clampedValue > 15 && onShapeDrag) {
      onShapeDrag(shape);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleShapeDrag);
      document.addEventListener('mouseup', handleShapeDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleShapeDrag);
        document.removeEventListener('mouseup', handleShapeDragEnd);
      };
    }
  }, [isDragging, activeSlider, dragStartX, dragStartPosition]);

  const handleSliderChangeStart = (event, shape) => {
    setActiveSlider(shape);
    if (resetOtherShapes) {
      resetOtherShapes(shape);
    }
  };
  
  const handleSliderChangeEnd = (event) => {
    setActiveSlider(null);
  };

  const ShapeComponent = ({ shape, children, top, color }) => (
    <div 
      ref={railRefs.current[shape]}
      style={{ 
        position: 'absolute', 
        // =====================================================================
        // PERBAIKAN: Gunakan 'top' yang dikirim sebagai string (vh)
        // =====================================================================
        top: top, 
        left: '60px', 
        zIndex: 40,
        width: `${railStart + railWidth + (shapeWidth/2)}px`, 
        height: '100px'
      }}
    >
      {/* Rail */}
      <div style={{
        position: 'absolute', top: '40px', left: `${railStart}px`,
        width: `${railWidth}px`, height: '20px',
        backgroundColor: 'rgba(93, 199, 209, 0.3)', zIndex: 1, borderRadius: '2px'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.8 3.82" style={{ width: '100%', height: '100%' }}>
          <rect fill="#5DC7D1" width="73.8" height="3.82" rx="1.44" ry="1.91"/>
        </svg>
      </div>
      
      {/* MUI Slider */}
      <Box 
        data-slider={shape}
        sx={{ 
          position: 'absolute', top: '30px', left: `${railStart}px`,
          width: `${railWidth}px`, height: '40px', zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, pointerEvents: 'none'
        }}
      >
        <Slider
          value={shapePositions[shape]}
          onChange={(event, newValue) => handleSliderChange(shape, event, newValue)}
          onChangeCommitted={handleSliderChangeEnd}
          min={0}
          max={maxPosition}
        />
      </Box>

      {/* Shape */}
      <div
        ref={shapeRefs.current[shape]}
        style={{ 
          position: 'absolute', top: '0', 
          left: `${startOffset + shapePositions[shape]}px`, 
          width: `${shapeWidth}px`, height: '100px', zIndex: 3,
          cursor: isDragging && activeSlider === shape ? 'grabbing' : 'grab',
          transition: (isDragging && activeSlider === shape) ? 'none' : 'left 0.3s ease',
          transform: (isDragging && activeSlider === shape) ? 'scale(1.1)' : 'scale(1)',
          filter: (isDragging && activeSlider === shape) ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
        }}
        onMouseDown={(e) => handleShapeDragStart(shape, e)}
      >
        {children}
      </div>

      {/* Area click Rail */}
      <div
        style={{
          position: 'absolute', top: '30px', left: `${railStart}px`,
          width: `${railWidth}px`, height: '40px', zIndex: 2,
          cursor: 'pointer', backgroundColor: 'transparent'
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPosition = Math.max(0, Math.min(maxPosition, clickX));
          updateShapePosition(shape, newPosition);
        }}
      />
    </div>
  );

  return (
    <>
      {/* Background Panel Utama (Teal) */}
      <svg
        className="side-menu-background"
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        preserveAspectRatio="none" 
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          height: 'calc(100vh - 40px)', 
          width: `${requiredBackgroundWidth}px`, 
          zIndex: 35, 
          transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '20px', 
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
        }}
      >
        <rect fill="#51A8B1" width={requiredBackgroundWidth} height="100%" rx="20" ry="20"/> 
      </svg>

      {/* =====================================================================
      // PERBAIKAN: Ubah 'top' menjadi % atau vh
      // ===================================================================== */}
      
      {/* Circle */}
      <ShapeComponent shape="circle" top="20vh" color="#FF6B9D">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.31 7.31" style={{ width: '100%', height: '100%' }}>
          <circle fill="#FF6B9D" cx="3.65" cy="3.65" r="3.65"/>
        </svg>
      </ShapeComponent>

      {/* Square */}
      <ShapeComponent shape="square" top="40vh" color="#4ECDC4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.95 4.95" style={{ width: '100%', height: '100%' }}>
          <rect fill="#4ECDC4" width="4.95" height="4.95"/>
        </svg>
      </ShapeComponent>

      {/* Pentagon */}
      <ShapeComponent shape="pentagon" top="60vh" color="#FFB347">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.37 5.11" style={{ width: '100%', height: '100%' }}>
          <polygon fill="#FFB347" points="2.68,0 4.03,0.98 5.37,1.95 4.86,3.53 4.34,5.11 2.68,5.11 1.03,5.11 0.51,3.53 0,1.95 1.34,0.98"/>
        </svg>
      </ShapeComponent>

      {/* Star */}
      <ShapeComponent shape="star" top="80vh" color="#FF6B6B">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8.77 8.35" style={{ width: '100%', height: '100%' }}>
          <polygon fill="#FF6B6B" points="4.39,0 5.42,3.19 8.77,3.19 6.06,5.16 7.1,8.35 4.39,6.37 1.68,8.35 2.72,5.16 0,3.19 3.36,3.19"/>
        </svg>
      </ShapeComponent>
    </>
  );
};

export default SideMenuObjects;