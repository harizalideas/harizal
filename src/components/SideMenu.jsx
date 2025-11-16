import React, { useState, useCallback } from 'react';
import SideMenuObjects from './SideMenuObjects';
import ContentPanel from './ContentPanel';
import { menuItems } from './menuData';

const SideMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  
  // =====================================================================
  // PERBAIKAN: Hitung posisi awal berdasarkan kalkulasi baru
  // =====================================================================
  // Tepi kanan panel teal = 20px (left) + 441px (width) = 461px
  // Posisi awal (tersembunyi 100px di kiri) = 461 - 100 = 361px
  const [contentPosition, setContentPosition] = useState(361); 
  const [contentOpacity, setContentOpacity] = useState(0); 
  
  const [shapePositions, setShapePositions] = useState({
    circle: 0,
    square: 0,
    pentagon: 0,
    star: 0
  });

  const shapeToMenuMap = {
    'circle': 'about',
    'square': 'skills', 
    'pentagon': 'projects',
    'star': 'contact'
  };

  // Function untuk reset shapes lain
  const resetOtherShapes = useCallback((currentShape) => {
    const shapes = ['circle', 'square', 'pentagon', 'star'];
    
    shapes.forEach(shape => {
      if (shape !== currentShape) {
        setShapePositions(prev => ({
          ...prev,
          [shape]: 0
        }));
      }
    });
    
    const menuId = shapeToMenuMap[currentShape];
    if (menuId) {
      setActiveMenu(menuId);
    }
    
    // =====================================================================
    // PERBAIKAN: Reset posisi ke 361px
    // =====================================================================
    setContentPosition(361); 
    setContentOpacity(0);

  }, [shapeToMenuMap]);

  const handleShapeDrag = (shape) => {
    const menuId = shapeToMenuMap[shape];
    if (menuId && activeMenu !== menuId) {
      setActiveMenu(menuId);
    }
  };

  const handleShapeMove = (shape, progress) => {
    
    // =====================================================================
    // PERBAIKAN: Logika Gerakan (Slide from Behind)
    //
    // Posisi Awal (progress 0): 361px (tersembunyi)
    // Posisi Akhir (progress 1): 361px + 100px = 461px (tepat di tepi)
    // =====================================================================
    const targetPosition = 361 + (progress * 100); 
    setContentPosition(targetPosition);
    
    // Opacity (logika ini sudah benar)
    setContentOpacity(progress);
    
    // Pastikan menu yang benar aktif
    const menuId = shapeToMenuMap[shape];
    if (menuId && activeMenu !== menuId) {
      setActiveMenu(menuId);
    }
  };

  const activeItem = menuItems.find(item => item.id === activeMenu);

  return (
    <>
      <SideMenuObjects 
        onShapeDrag={handleShapeDrag}
        onShapeMove={handleShapeMove}
        resetOtherShapes={resetOtherShapes}
        shapePositions={shapePositions}
        onShapePositionChange={setShapePositions}
      />
      <ContentPanel 
        item={activeItem} 
        opacity={contentOpacity}
        position={contentPosition}
      />
    </>
  );
};

export default SideMenu;