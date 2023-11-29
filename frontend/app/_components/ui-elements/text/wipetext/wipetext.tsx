import './style.css';
import { useEffect, useState } from 'react';

type WipeTextProps = {
  text: string;
  delay?: number; // Optional: Each character's animation delay in milliseconds
};

export const WipeText = ({text, delay} : WipeTextProps) => {
  delay = delay || 20;
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentText = '';
    const timer = setInterval(() => {
      if (currentText.length < text.length) {
        currentText = text.substring(0, currentText.length + 1);
        setDisplayedText(currentText);
      } else {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <div className="wipe-container">
      {displayedText.split('').map((char, index) => (
        <span key={index} className="wipe-animation">
          {char}
        </span>
      ))}
    </div>
  );
};