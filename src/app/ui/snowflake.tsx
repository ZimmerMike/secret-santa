import { useEffect, useRef } from 'react';
interface Snowflake {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    o: number;
    reset(): void;
  }
const SnowEffect = () => {
  const mastheadRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let COUNT = 300;
  let ctx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;
  let i = 0;
  let active = false;

  function onResize() {
    if (mastheadRef.current && canvasRef.current) {
      width = mastheadRef.current.clientWidth;
      height = mastheadRef.current.clientHeight;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      if (ctx) {
        ctx.fillStyle = '#FFF';
      }

      const wasActive = active;
      active = width > 600;

      if (!wasActive && active) {
        requestAnimFrame(update);
      }
    }
  }

  function Snowflake(this: { x: number; y: number; vx: number; vy: number; r: number; o: number }) {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.vx = 0;
    this.r = 0;

    this.reset();
  }

  Snowflake.prototype.reset = function () {
    this.x = Math.random() * width;
    this.y = Math.random() * -height;
    this.vy = 1 + Math.random() * 3;
    this.vx = 0.5 - Math.random();
    this.r = 1 + Math.random() * 2;
    this.o = 0.5 + Math.random() * 0.5;
  };

  const snowflakes: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];

  function update() {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      if (!active) return;

      for (i = 0; i < COUNT; i++) {
        const snowflake = snowflakes[i];
        snowflake.y += snowflake.vy;
        snowflake.x += snowflake.vx;

        if (ctx) {
          ctx.globalAlpha = snowflake.o;
          ctx.beginPath();
          ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
          ctx.closePath();
          ctx.fill();
        }

        if (snowflake.y > height) {
          snowflake.reset();
        }
      }

      requestAnimFrame(update);
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.style.position = 'absolute';
        canvasRef.current.style.left = canvasRef.current.style.top = '0';

        for (i = 0; i < COUNT; i++) {
          const snowflake = new Snowflake();
          snowflake.reset();
          snowflakes.push(snowflake);
        }

        onResize();
        window.addEventListener('resize', onResize, false);

        if (mastheadRef.current) {
          mastheadRef.current.appendChild(canvasRef.current);
        }
      }
    }

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // shim layer with setTimeout fallback
  function requestAnimFrame(callback: FrameRequestCallback) {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    )(callback);
  }

  return <div className="sky" ref={mastheadRef}></div>;
};

export default SnowEffect;
