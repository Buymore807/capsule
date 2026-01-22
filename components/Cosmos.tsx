
import React, { useEffect, useRef } from 'react';

const Cosmos: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; size: number; speed: number; opacity: number; color: string; drift: number }[] = [];

    const starColors = ['#ffffff', '#cbd5e1', '#fef9c3', '#818cf8', '#fae8ff'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      // Distant stars
      for (let i = 0; i < 300; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 0.8,
          speed: Math.random() * 0.05 + 0.02,
          opacity: Math.random(),
          color: starColors[0],
          drift: (Math.random() - 0.5) * 0.02
        });
      }
      // Mid stars
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.15 + 0.05,
          opacity: Math.random(),
          color: starColors[Math.floor(Math.random() * starColors.length)],
          drift: (Math.random() - 0.5) * 0.05
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = star.color;
        
        // Circular star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Very occasional glow for larger stars
        if (star.size > 1.2 && star.opacity > 0.8) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // Twinkle effect
        star.opacity += (Math.random() - 0.5) * 0.02;
        if (star.opacity < 0.2) star.opacity = 0.2;
        if (star.opacity > 1) star.opacity = 1;

        // Subtle drift movement
        star.y -= star.speed;
        star.x += star.drift;

        if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
        }
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
        <div className="nebula absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full" />
        <div className="nebula absolute top-[40%] -right-[20%] w-[50%] h-[50%] bg-purple-700/10 rounded-full" />
        <div className="nebula absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 rounded-full" />
      </div>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-80 z-0" />
    </>
  );
};

export default Cosmos;
