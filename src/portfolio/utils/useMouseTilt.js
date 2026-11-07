import { useState, useCallback } from 'react';

/**
 * useMouseTilt - calculates 3D perspective tilt and mouse coordinates
 * for smooth physics-based card hover effects (inspired by Awwwards / Framer).
 */
export function useMouseTilt(maxTilt = 8) {
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
  });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * -maxTilt;
      const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

      setMousePos({ x: percentX, y: percentY });
      setTiltStyle({
        transform: `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
        transition: 'transform 80ms ease-out',
      });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 400ms cubic-bezier(0.22, 1, 0.36, 1)',
    });
    setMousePos({ x: 50, y: 50 });
  }, []);

  return {
    tiltStyle,
    mousePos,
    handleMouseMove,
    handleMouseLeave,
  };
}
