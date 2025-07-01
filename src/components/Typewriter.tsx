import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  speed = 100, 
  delay = 0,
  className = "" 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  useEffect(() => {
    clearTimers();
    setDisplayText('');
    setShowCursor(true);
    setIsDeleting(false);

    const texts = Array.isArray(text) ? text : [text];
    let currentIndex = 0;
    let deleting = false;
    let localTextIndex = currentTextIndex;

    const typeLoop = () => {
      const currentText = texts[localTextIndex];
      if (!deleting && currentIndex < currentText.length) {
        setDisplayText(currentText.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeLoop, speed);
      } else if (!deleting && currentIndex === currentText.length) {
        timeoutRef.current = setTimeout(() => {
          deleting = true;
          setIsDeleting(true);
          typeLoop();
        }, 1200);
      } else if (deleting && currentIndex > 0) {
        setDisplayText(currentText.slice(0, currentIndex - 1));
        currentIndex--;
        timeoutRef.current = setTimeout(typeLoop, speed / 2);
      } else if (deleting && currentIndex === 0) {
        setIsDeleting(false);
        deleting = false;
        localTextIndex = (localTextIndex + 1) % texts.length;
        setCurrentTextIndex(localTextIndex);
        timeoutRef.current = setTimeout(typeLoop, 600);
      }
    };

    timeoutRef.current = setTimeout(typeLoop, delay);

    return () => {
      clearTimers();
    };
  }, [text, delay, speed, currentTextIndex]);

  useEffect(() => {
    const texts = Array.isArray(text) ? text : [text];
    const currentText = texts[currentTextIndex];
    if (!isDeleting && displayText === currentText) {
      intervalRef.current = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
    } else {
      setShowCursor(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDeleting, displayText, text, currentTextIndex]);

  return (
    <span className={className} style={{ position: 'relative' }}>
      {displayText}
      {showCursor && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-block align-middle w-1 h-[1em] sm:h-8 bg-white-100 dark:bg-white-100 bg-white-100-light ml-1"
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </span>
  );
};

export default Typewriter; 