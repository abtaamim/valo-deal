import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TextTransition.css'; // Import the CSS file for animations

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

const transition = {
  duration: 1.5, // Total animation duration
  ease: "easeInOut" // Easing function for smoother animation
};

const TextTransition = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, 4500); // Change text every 1500ms (1.5 seconds)

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sequential-text-transition-container">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }} // Initial state
        animate={{ opacity: 1, y: [10,-5,-5]}} // Animate to visible and translate up
        exit={{ opacity: 0, y: -3 }} // Exit transition
        transition={{
          duration: "4.0",
          ease: "easeInOut" ,
         // delay:"1"
        }} // Transition settings
        className="text-content"
      >
        {strings[index]}
      </motion.div>
    </div>
  );
};

export default TextTransition;
