// src/components/animations/AnimatedCard.jsx
import React from 'react';

const AnimatedCard = ({ 
  children, 
  className = '',
  hoverEffect = true,
  clickEffect = false
}) => {
  return (
    <div 
      className={`
        transform transition duration-300 ease-in-out
        ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-soft-lg' : ''}
        ${clickEffect ? 'active:translate-y-0 active:shadow-soft' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;