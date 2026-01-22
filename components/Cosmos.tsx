
import React, { useEffect, useRef } from 'react';

const Cosmos: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number; color: string }[] = [];

    const colors = ['#ffffff', '#e0f2fe', '#fef9c3', '#fae8ff', '#818cf8'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 400; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.2 + 0.05,
          opacity: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Twinkle
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 1) star.opacity = 1;

        // Move
        star.y -= star.speed;
        if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
        }
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="nebula absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full" />
        <div className="nebula absolute top-1/2 -right-40 w-80 h-80 bg-blue-600/10 rounded-full" />
        <div className="nebula absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full" />
      </div>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="shooting-star" style={{ top: '10%', left: '80%', animationDelay: '0s' }} />
        <div className="shooting-star" style={{ top: '30%', left: '95%', animationDelay: '7s' }} />
        <div className="shooting-star" style={{ top: '50%', left: '100%', animationDelay: '14s' }} />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-60 z-0" />
    </>
  );
};

export default Cosmos;
