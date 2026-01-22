
import React, { useEffect, useRef } from 'react';

const Cosmos: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string; twinkle: number }[] = [];

    const starColors = ['#ffffff', '#cbd5e1', '#fef9c3', '#818cf8', '#fae8ff', '#a5b4fc'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Distant static-ish stars
      for (let i = 0; i < 400; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.7,
          speedX: (Math.random() - 0.5) * 0.02,
          speedY: -(Math.random() * 0.05 + 0.02),
          opacity: Math.random(),
          color: '#ffffff',
          twinkle: Math.random() * 0.02
        });
      }
      // Bright colorful stars
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.8,
          speedX: (Math.random() - 0.5) * 0.05,
          speedY: -(Math.random() * 0.15 + 0.05),
          opacity: Math.random(),
          color: starColors[Math.floor(Math.random() * starColors.length)],
          twinkle: Math.random() * 0.05
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

        // Twinkle Logic
        star.opacity += (Math.random() - 0.5) * star.twinkle;
        if (star.opacity < 0.2) star.opacity = 0.2;
        if (star.opacity > 1) star.opacity = 1;

        // Drift Logic
        star.y += star.speedY;
        star.x += star.speedX;

        // Loop screen
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Nebulas */}
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-indigo-900/10 rounded-full blur-[120px] nebula" />
        <div className="absolute top-[30%] -right-[20%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[100px] nebula" />
        <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[110px] nebula" />
        
        {/* Particle Overlay (Stardust) */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-90 z-0" />
    </>
  );
};

export default Cosmos;
