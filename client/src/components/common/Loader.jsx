// src/components/common/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen }) => {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const dotVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const colors = ["#0ea5e9", "#6366f1", "#d946ef"];

  const LoaderContent = () => (
    <motion.div
      className="flex items-center justify-center space-x-2"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
          variants={dotVariants}
        />
      ))}
      <p className="ml-4 text-gray-600 font-medium">Loading...</p>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-12">
      <LoaderContent />
    </div>
  );
};

export default Loader;