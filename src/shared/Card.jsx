import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = true, onClick = null }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
