import { useEffect, useRef } from "react";

/**
 * Nanotech pillar field, thousands of tiny soft pillars beneath a white skin
 * that rise and bend toward the cursor with spring physics. Designed to feel
 * "physically connected", not random.
 */
export function SilkMeshHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // pointer state in CSS pixels, lerped for buttery feel
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    // grid of pillars, denser on bigger screens
    type Pillar = {
      bx: number;        // base x
      by: number;        // base y
      vx: number;        // tip velocity x
      vy: number;        // tip velocity y
      dx: number;        // tip offset x
      dy: number;        // tip offset y
      jitter: number;    // per-pillar phase
    };
    let pillars: Pillar[] = [];
    let cssW = 0, cssH = 0;

    const SPACING = 30;          // px between pillars (thicker weave)
    const RADIUS = 230;          // influence radius
    const LIFT = 38;             // max bend distance
    const STIFF = 0.075;         // spring stiffness back to base
    const DAMP = 0.84;           // velocity damping
    const PUSH = 0.7;            // how strongly cursor displaces tip

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      pillars = [];
      const cols = Math.ceil(cssW / SPACING) + 2;
      const rows = Math.ceil(cssH / SPACING) + 2;
      // stagger every other row for a more organic, woven feel
      for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (SPACING / 2);
        for (let c = 0; c < cols; c++) {
          pillars.push({
            bx: c * SPACING + offset - SPACING,
            by: r * SPACING - SPACING,
            vx: 0,
            vy: 0,
            dx: 0,
            dy: 0,
            jitter: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const onResize = () => build();
    build();
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let t0 = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - t0) / 16.6667; // normalized to 60fps frame
      t0 = now;

      // ease pointer toward target, smooths jagged input
      pointer.x += (pointer.tx - pointer.x) * 0.18 * dt;
      pointer.y += (pointer.ty - pointer.y) * 0.18 * dt;

      ctx.clearRect(0, 0, cssW, cssH);

      const r2 = RADIUS * RADIUS;
      const time = now * 0.001;

      for (let i = 0; i < pillars.length; i++) {
        const p = pillars[i];

        // distance from base to cursor
        const ddx = pointer.x - p.bx;
        const ddy = pointer.y - p.by;
        const d2 = ddx * ddx + ddy * ddy;

        // target tip offset
        let tx = 0, ty = 0;
        if (pointer.active && d2 < r2) {
          const d = Math.sqrt(d2) || 0.0001;
          // smooth falloff (cosine-like)
          const f = 1 - d / RADIUS;
          const fall = f * f * (3 - 2 * f); // smoothstep
          // bend AWAY from cursor like grass pushed by a hand,
          // then settle, but we want magnetic feel: pull TOWARD cursor.
          const dirx = ddx / d;
          const diry = ddy / d;
          tx = dirx * LIFT * fall * PUSH;
          ty = diry * LIFT * fall * PUSH;
          // tiny breathing wobble that scales with influence
          tx += Math.cos(time * 1.6 + p.jitter) * 0.7 * fall;
          ty += Math.sin(time * 1.6 + p.jitter) * 0.7 * fall;
        }

        // spring toward target tip offset
        const ax = (tx - p.dx) * STIFF;
        const ay = (ty - p.dy) * STIFF;
        p.vx = (p.vx + ax) * DAMP;
        p.vy = (p.vy + ay) * DAMP;
        p.dx += p.vx * dt;
        p.dy += p.vy * dt;

        const tipx = p.bx + p.dx;
        const tipy = p.by + p.dy;

        // bend magnitude drives color & thickness, connected feel
        const mag = Math.hypot(p.dx, p.dy);
        const energy = Math.min(1, mag / LIFT);

        // brand gradient: navy (resting) → orange (activated)
        // navy #14213D rgb(20,33,61), orange #E89220 rgb(232,146,32)
        // horizontal position adds a subtle blue→orange wash so the whole
        // surface reads as a brand fabric even when idle
        const wash = p.bx / Math.max(1, cssW); // 0 left → 1 right
        const baseR = Math.round(20 + (232 - 20) * wash * 0.55);
        const baseG = Math.round(33 + (146 - 33) * wash * 0.55);
        const baseB = Math.round(61 + (32 - 61) * wash * 0.55);
        // when energized, pull strongly toward orange
        const r = Math.round(baseR + (232 - baseR) * energy);
        const g = Math.round(baseG + (146 - baseG) * energy);
        const b = Math.round(baseB + (32 - baseB) * energy);

        const baseAlpha = 0.18 + energy * 0.55;

        ctx.lineWidth = 2.4 + energy * 3.2;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${r},${g},${b},${baseAlpha})`;

        // quadratic curve gives the pillar an organic bend
        const midx = p.bx + p.dx * 0.45;
        const midy = p.by + p.dy * 0.45 - 2.5;
        ctx.beginPath();
        ctx.moveTo(p.bx, p.by);
        ctx.quadraticCurveTo(midx, midy, tipx, tipy);
        ctx.stroke();

        // tip dot (the "pin head"), fabric weave node
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${0.35 + energy * 0.5})`;
        ctx.arc(tipx, tipy, 1.6 + energy * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-white" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* white "skin", soft radial vignette so pillars fade at the edges,
          giving the illusion of fabric stretched over the surface */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 45%, rgba(255,255,255,0) 30%, rgba(255,255,255,0.78) 88%, #fff 100%)",
        }}
      />
    </div>
  );
}
