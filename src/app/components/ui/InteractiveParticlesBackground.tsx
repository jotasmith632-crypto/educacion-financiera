import React, { useEffect, useRef } from 'react';

interface InteractiveParticlesBackgroundProps {
  particleColor?: string;
  lineColor?: string;
  particleCountMobile?: number;
  particleCountDesktop?: number;
  maxDistance?: number;
  interactionRadius?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const InteractiveParticlesBackground: React.FC<InteractiveParticlesBackgroundProps> = ({
  particleColor = 'rgba(108, 76, 241, 0.35)',
  lineColor = 'rgba(108, 76, 241, 0.12)',
  particleCountMobile = 40,
  particleCountDesktop = 90,
  maxDistance = 110,
  interactionRadius = 140,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Determinar cantidad de partículas según el tamaño de la pantalla
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? particleCountMobile : particleCountDesktop;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5, // Movimiento lento y elegante
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 1.5,
        });
      }
    };

    // Escuchadores de eventos para interactividad
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Ajustar tamaño inicial
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    // Loop de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar y actualizar partículas
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Rebotes en los bordes con fricción cero
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mantener dentro del lienzo ante cambios bruscos
        if (p.x < -10) p.x = canvas.width + 5;
        if (p.x > canvas.width + 10) p.x = -5;
        if (p.y < -10) p.y = canvas.height + 5;
        if (p.y > canvas.height + 10) p.y = -5;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      });

      // Dibujar conexiones entre partículas y con el cursor
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Conectar con otras partículas
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.45; // Opacidad según distancia
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Reemplazar la opacidad en la línea
            const cleanLineColor = lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.strokeStyle = cleanLineColor;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Conectar con el ratón/cursor
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;
        if (mouseX !== null && mouseY !== null) {
          const mouseDist = Math.hypot(p1.x - mouseX, p1.y - mouseY);

          if (mouseDist < interactionRadius) {
            const alpha = (1 - mouseDist / interactionRadius) * 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);

            // Línea más brillante al interactuar
            const cleanLineColor = lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.strokeStyle = cleanLineColor;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleColor, lineColor, particleCountMobile, particleCountDesktop, maxDistance, interactionRadius]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none select-none block"
      style={{ zIndex: 0 }}
    />
  );
};
