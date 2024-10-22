import React, { useEffect, useRef } from 'react';

const RetroHeader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Retro color palette
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA',
      '#F0B67F', '#FE4A49', '#A9E5BB', '#851E3E', '#247BA0'
    ];

    const stripeWidth = 15;
    let colorIndex = 0;

    for (let x = 0; x < width; x += stripeWidth) {
      ctx.fillStyle = colors[colorIndex % colors.length];
      ctx.fillRect(x, 0, stripeWidth, height);
      colorIndex++;
    }

    // Add a slight noise texture
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 20 - 10;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

  }, []);

  return (
    <div className="relative p-4">
      <canvas
        ref={canvasRef}
        width={384}
        height={80}
        className="absolute top-0 left-0 w-full h-full"
      />
      <h1 className="relative z-10 text-4xl font-bold text-white text-center" 
          style={{ 
            fontFamily: "'Racing Sans One', cursive", 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.5)' 
          }}>
        Palette Peek
      </h1>
    </div>
  );
};

export default RetroHeader;