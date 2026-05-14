import { useEffect, useRef } from "react";

/**
 * PaintSplashHero
 * Vivid brand-color paint splashes on white paper. The cursor is a wet brush
 * dragging thick orange and navy ink across the canvas, momentum, splatter
 * droplets, and click-to-splat bursts. Trails persist briefly via low-alpha
 * fade. Pure 2D canvas, no deps.
 */

type Splat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  color: string;
};

const ORANGE = "rgba(232, 146, 32,"; // #E89220
const ORANGE_HOT = "rgba(249, 168, 38,";
const NAVY = "rgba(20, 33, 61,";
const NAVY_DEEP = "rgba(7, 16, 63,";

const PALETTE = [ORANGE, ORANGE_HOT, NAVY, NAVY_DEEP, ORANGE, NAVY];

export function PaintSplashHero() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // wash to white on resize
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const splats: Splat[] = [];
    const mouse = { x: W / 2, y: H / 2, px: W / 2, py: H / 2, down: false, inside: false };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

    const spawnTrail = (x: number, y: number, vx: number, vy: number) => {
      const speed = Math.hypot(vx, vy);
      const count = Math.min(8, 1 + Math.floor(speed * 0.25));
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = rand(0.2, 1.6);
        splats.push({
          x: x + rand(-6, 6),
          y: y + rand(-6, 6),
          vx: vx * 0.25 + Math.cos(a) * s,
          vy: vy * 0.25 + Math.sin(a) * s,
          r: rand(14, 38) + speed * 0.4,
          life: 0,
          maxLife: rand(60, 130),
          color: pick(PALETTE),
        });
      }
    };

    const spawnSplat = (x: number, y: number, big = false) => {
      const drops = big ? 26 : 12;
      // central blob
      splats.push({
        x, y, vx: 0, vy: 0,
        r: big ? rand(80, 130) : rand(40, 70),
        life: 0,
        maxLife: rand(180, 260),
        color: pick(PALETTE),
      });
      for (let i = 0; i < drops; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = rand(2, big ? 11 : 6);
        splats.push({
          x, y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          r: rand(8, big ? 36 : 22),
          life: 0,
          maxLife: rand(90, 200),
          color: pick(PALETTE),
        });
      }
    };

    // Seed a few ambient blobs so it doesn't look empty
    for (let i = 0; i < 5; i++) {
      splats.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
        r: rand(60, 140), life: 0, maxLife: rand(400, 700),
        color: pick(PALETTE),
      });
    }

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.inside = true;
      const vx = mouse.x - mouse.px;
      const vy = mouse.y - mouse.py;
      spawnTrail(mouse.x, mouse.y, vx, vy);
    };
    const onLeave = () => { mouse.inside = false; };
    const onDown = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.down = true;
      spawnSplat(e.clientX - r.left, e.clientY - r.top, true);
    };
    const onUp = () => { mouse.down = false; };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerup", onUp);

    // Ambient auto-splats so it lives without input
    let lastAuto = performance.now();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const frame = () => {
      // Soft white wash for trails (paper soaks up over time)
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(0, 0, W, H);

      // Update + draw splats with multiply for rich ink overlap
      ctx.globalCompositeOperation = "multiply";

      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i];
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;

        const t = s.life / s.maxLife;
        if (t >= 1) { splats.splice(i, 1); continue; }
        // Alpha curve: fade in fast, hold, fade out
        const a = Math.sin(Math.min(1, t * 1.4) * Math.PI) * 0.55;
        const r = s.r * (1 + t * 0.35);

        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        grad.addColorStop(0, s.color + a + ")");
        grad.addColorStop(0.6, s.color + a * 0.55 + ")");
        grad.addColorStop(1, s.color + "0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Ambient auto-splat every ~2.2s if not interacting
      const now = performance.now();
      if (!reduceMotion && now - lastAuto > 2200) {
        lastAuto = now;
        spawnSplat(rand(W * 0.15, W * 0.85), rand(H * 0.2, H * 0.8), false);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto absolute inset-0 -z-10 overflow-hidden bg-white"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Soft white vignette so the headline stays crisp */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 80%)",
        }}
      />
    </div>
  );
}

export default PaintSplashHero;
