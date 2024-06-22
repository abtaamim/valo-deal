import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TextTransition.css';

const strings = [
  "First string",
  "Second string",
  "Third string",
  "Fourth string",
  "Fifth string",
  "Sixth string",
  "Seventh string",
  "Eighth string",
  "Ninth string",
  "Tenth string"
];

const TextTransition = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, 4500); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sequential-text-transition-container">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: [10,-5,-5]}} 
        exit={{ opacity: 0, y: -3 }} 
        transition={{
          duration: 4.0,
          ease: "easeInOut",
        }} 
        className="text-content"
      >
        {strings[index]}
      </motion.div>
    </div>
  );
};

export default TextTransition;
