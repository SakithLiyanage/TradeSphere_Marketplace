/ src/components/animations/SlideIn.jsx
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const SlideIn = ({
  children,
  direction = 'left',
  delay = 0,
  className = '',
  threshold = 0.1,
  duration = 500
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true
  });
  
  const elementRef = useRef();
  
  // Determine initial transform based on direction
  const getInitialTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-50px)';
      case 'right': return 'translateX(50px)';
      case 'up': return 'translateY(50px)';
      case 'down': return 'translateY(-50px)';
      default: return 'translateX(-50px)';
    }
  };
  
  useEffect(() => {
    const element = elementRef.current;
    
    if (inView) {
      setTimeout(() => {
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translate(0)';
        }
      }, delay);
    }
  }, [inView, delay]);
  
  return (
    <div 
      ref={(node) => {
        ref(node);
        elementRef.current = node;
      }}
      className={`${className}`}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default SlideIn;