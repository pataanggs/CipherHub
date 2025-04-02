import React, { useState, useEffect, useRef } from "react";

const ScrambleText = ({ text, className }) => {
  const [scrambledText, setScrambledText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  
  // Characters to use for scrambling
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scrambleText = () => {
    let iteration = 0;
    const originalText = text;
    
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setScrambledText(
        originalText
          .split("")
          .map((_char, index) => {
            // If the iteration has passed the character's position, return the original character
            if (index < iteration) {
              return originalText[index];
            }
            
            // Otherwise return a random character
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      // If we've gone through all characters, stop the interval
      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }
      
      iteration += 1 / 3; // Control the speed of decryption
    }, 30); // Adjust interval for animation speed
  };
  
  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (isHovering) {
      scrambleText();
    } else {
      // When not hovering, revert to original text
      clearInterval(intervalRef.current);
      setScrambledText(text);
    }
  }, [isHovering, scrambleText, text]);
  
  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
    >
      {scrambledText}
    </span>
  );
};

export default ScrambleText;
