// src/components/MenuButton.jsx
import React from 'react';

const MenuButton = ({ item, isActive, onClick, index }) => {
  const shapes = {
    circle: (
      <circle cx="25" cy="25" r="20" fill={item.color} />
    ),
    square: (
      <rect x="5" y="5" width="40" height="40" rx="5" fill={item.color} />
    ),
    pentagon: (
      <polygon 
        points="25,5 45,18 38,40 12,40 5,18" 
        fill={item.color} 
      />
    ),
    star: (
      <polygon 
        points="25,5 30,18 45,18 33,27 38,40 25,32 12,40 17,27 5,18 20,18" 
        fill={item.color} 
      />
    )
  };

  return (
    <div
      className="menu-button-wrapper"
      style={{
        position: 'absolute',
        top: `${120 + index * 110}px`,
        left: isActive ? '220px' : '20px',
        transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        zIndex: 100
      }}
      onClick={onClick}
    >
      <svg width="50" height="50" style={{ 
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        transition: 'transform 0.3s ease'
      }}>
        {shapes[item.shape]}
      </svg>
    </div>
  );
};

export default MenuButton;