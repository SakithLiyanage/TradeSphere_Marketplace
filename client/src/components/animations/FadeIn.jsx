// src/components/animations/FadeIn.jsx
import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

const FadeIn = ({ 
  children, 
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
  
  useEffect(() => {
    const element = elementRef.current;
    
    if (inView) {
      setTimeout(() => {
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
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
        transform: 'translateY(20px)',
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeIn;


