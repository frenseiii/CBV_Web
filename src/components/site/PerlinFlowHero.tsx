import { useEffect, useRef } from "react";

/**
 * PerlinFlowHero
 * A generative flow-field visualization: thousands of silky particles drift along
 * a Perlin-noise vector field, leaving long fading trails. The field is warped
 * by the cursor, particles bend toward (or curl around) the pointer like iron
 * filings around a magnet. Brand-only palette (navy + orange) on white.
 */

// ---- Tiny 2D simplex-ish noise (Perlin variant, fast & self-contained) ----
function makeNoise(seed = 1337) {
  const p = new Uint8Array(512);
  const perm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) perm[i] = i;
  // xorshift32 shuffle
  let s = seed | 0;
  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = perm[i];
    perm[i] = perm[j];
    perm[j] = t;
  }
  for (let i = 0; i < 512; i++) p[i] = perm[i & 255];
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (h: number, x: number, y: number) => {
    const v = h & 3;
    if (v === 0) return x + y;
    if (v === 1) return -x + y;
    if (v === 2) return x - y;
    return -x - y;
  };
  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const A = p[X] + Y;
    const B = p[X + 1] + Y;
    return lerp(
      lerp(grad(p[A], x, y), grad(p[B], x - 1, y), u),
      lerp(grad(p[A + 1], x, y - 1), grad(p[B + 1], x - 1, y - 1), u),
      v,
    );
  };
}

export function PerlinFlowHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    // Cursor state (smoothed)
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      max: number;
      hue: 0 | 1; // 0 = orange, 1 = navy
      w: number;
    };

    let particles: P[] = [];
    const noise = makeNoise(91);
    const NOISE_SCALE = 0.0019;
    let t = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // White base
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);
      seedParticles();
    };

    const seedParticles = () => {
      // Density scales with viewport area, capped for perf
      const target = Math.min(2200, Math.floor((W * H) / 900));
      particles = new Array(target).fill(0).map(() => spawn());
    };

    const spawn = (): P => {
      const max = 140 + Math.random() * 220;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0,
        vy: 0,
        life: Math.random() * max,
        max,
        hue: Math.random() < 0.62 ? 0 : 1,
        w: 0.45 + Math.random() * 0.85,
      };
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.tx = -9999;
      mouse.ty = -9999;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let raf = 0;
    const loop = () => {
      t += reduceMotion ? 0.0008 : 0.0022;

      // Smooth cursor
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;

      // Translucent white wash for trails (longer trails = lower alpha)
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.fillRect(0, 0, W, H);

      const cursorR = 220;
      const cursorR2 = cursorR * cursorR;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Flow field angle from perlin noise, slowly evolving in time
        const n = noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE + t);
        let angle = n * Math.PI * 2.4;

        // Cursor influence, magnetic curl
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < cursorR2) {
            const d = Math.sqrt(d2) || 1;
            const falloff = 1 - d / cursorR; // 0..1
            // Curl: rotate vector from cursor by 90deg → orbit/swirl
            const ax = -dy / d;
            const ay = dx / d;
            const targetAngle = Math.atan2(ay, ax);
            // Blend toward swirl direction
            angle = angle * (1 - falloff * 0.85) + targetAngle * (falloff * 0.85);
          }
        }

        const speed = 0.85 + Math.sin(t * 4 + i) * 0.08;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        const px = p.x;
        const py = p.y;
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Respawn when out of bounds or expired
        if (
          p.life > p.max ||
          p.x < -10 ||
          p.x > W + 10 ||
          p.y < -10 ||
          p.y > H + 10
        ) {
          const fresh = spawn();
          p.x = fresh.x;
          p.y = fresh.y;
          p.life = 0;
          p.max = fresh.max;
          p.hue = fresh.hue;
          p.w = fresh.w;
          continue;
        }

        // Fade in/out across lifetime
        const lifeT = p.life / p.max;
        const alpha = Math.sin(lifeT * Math.PI) * 0.55;

        // Brand palette, orange (#E89220) primary, navy (#14213D) accent
        const stroke =
          p.hue === 0
            ? `rgba(232,146,32,${alpha.toFixed(3)})`
            : `rgba(20,33,61,${(alpha * 0.85).toFixed(3)})`;

        ctx.strokeStyle = stroke;
        ctx.lineWidth = p.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Soft vignette so headline stays crisp */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 65%, rgba(255,255,255,0.92) 100%)",
        }}
      />
    </div>
  );
}

export default PerlinFlowHero;
