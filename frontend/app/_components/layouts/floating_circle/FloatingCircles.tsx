import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Circle = {
  id: number;
  size: number;
  duration: number;
  color: string;
  opacity: number;
};

const colors = ["red", "blue", "green", "yellow", "purple"];
const sizeRange = [70, 250];
const maxCircles = 10;

const getRandomSize = () => Math.floor(Math.random() * (sizeRange[1] - sizeRange[0] + 1)) + sizeRange[0];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
const getRandomDuration = () => Math.random() * 7 + 4;
const getRandomOpacity = () => Math.random() * 0.5 + 0.2;

export const FloatingCircles = () => {
  const [circles, setCircles] = useState<Circle[]>([]);

  useEffect(() => {
    const initialCount = Math.floor(Math.random() * 8) + 5; // 2〜5個の初期円

    const interval = setInterval(() => {
      if (circles.length < maxCircles) {
        const newCircle = {
          id: Math.random(),
          size: getRandomSize(),
          duration: getRandomDuration(),
          color: getRandomColor(),
          opacity: getRandomOpacity(),
        };
        setCircles((prev) => [...prev, newCircle]);
      }
    }, 500);

    // 初期円の追加
    for (let i = 0; i < initialCount; i++) {
      circles.push({
        id: Math.random(),
        size: getRandomSize(),
        duration: getRandomDuration(),
        color: getRandomColor(),
        opacity: getRandomOpacity(),
      });
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-1 overflow-hidden">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          initial={{ y: "100vh", x: Math.random() * window.innerWidth }}
          animate={{ y: "-100vh" }}
          transition={{ duration: circle.duration, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            width: circle.size,
            height: circle.size,
            borderRadius: "50%",
            backgroundColor: circle.color,
            opacity: circle.opacity,
          }}
        />
      ))}
    </div>
  );
};
