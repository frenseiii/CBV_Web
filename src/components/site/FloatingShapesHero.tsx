import { useEffect, useRef } from "react";

/**
 * Glossy rounded squares / pills drifting in brand colors (navy, orange, white).
 * Each shape has a radial gradient + specular highlight + rim light.
 * Shapes lean toward the cursor for a tactile, premium feel.
 */
type ShapeDef = {
  id: string;
  baseX: number;
  baseY: number;
  w: number;
  h: number;
  rot: number;
  rx: number;
  c1: string;
  c2: string;
  c3: string;
  opacity: number;
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  px: number;
  py: number;
  pull: number;
  rotSpeed: number;
};

const SHAPES: ShapeDef[] = [
  {
    id: "sq-navy-1",
    baseX: 0.28, baseY: 0.42,
    w: 360, h: 360, rot: -12, rx: 72,
    c1: "#4a6cb0", c2: "#1c2f5a", c3: "#0a1430", opacity: 0.95,
    ax: 70, ay: 50, sx: 0.00018, sy: 0.00022, px: 0, py: 1.2,
    pull: 0.18, rotSpeed: 0.004,
  },
  {
    id: "sq-orange-1",
    baseX: 0.74, baseY: 0.55,
    w: 420, h: 280, rot: 8, rx: 100,
    c1: "#ffd9a8", c2: "#f5a23d", c3: "#b85a0e", opacity: 0.96,
    ax: 90, ay: 60, sx: 0.00014, sy: 0.00019, px: 1.4, py: 0.3,
    pull: 0.22, rotSpeed: -0.003,
  },
  {
    id: "sq-white",
    baseX: 0.5, baseY: 0.28,
    w: 260, h: 260, rot: 18, rx: 60,
    c1: "#ffffff", c2: "#ffffff", c3: "#dfe6f3", opacity: 0.95,
    ax: 70, ay: 40, sx: 0.00021, sy: 0.00016, px: 2.1, py: 2.6,
    pull: 0.14, rotSpeed: 0.005,
  },
  {
    id: "sq-navy-2",
    baseX: 0.16, baseY: 0.8,
    w: 220, h: 160, rot: -22, rx: 60,
    c1: "#5573b8", c2: "#22386b", c3: "#0e1830", opacity: 0.9,
    ax: 50, ay: 40, sx: 0.00026, sy: 0.00024, px: 3.3, py: 1.8,
    pull: 0.28, rotSpeed: -0.006,
  },
  {
    id: "sq-orange-2",
    baseX: 0.86, baseY: 0.18,
    w: 240, h: 180, rot: 14, rx: 64,
    c1: "#ffe2b8", c2: "#f7b35a", c3: "#a85309", opacity: 0.92,
    ax: 60, ay: 50, sx: 0.00023, sy: 0.00027, px: 0.8, py: 3.2,
    pull: 0.26, rotSpeed: 0.007,
  },
];

export function FloatingShapesHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(SVGGElement | null)[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const start = performance.now();

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        mouse.current.active = false;
        return;
      }
      mouse.current.tx = (e.clientX - r.left) / r.width;
      mouse.current.ty = (e.clientY - r.top) / r.height;
      mouse.current.active = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = (now: number) => {
      const t = now - start;
      const r = wrap.getBoundingClientRect();
      const w = r.width || 1;
      const h = r.height || 1;
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;

      SHAPES.forEach((s, i) => {
        const g = groupRefs.current[i];
        if (!g) return;
        const dx = Math.sin(t * s.sx + s.px) * s.ax;
        const dy = Math.cos(t * s.sy + s.py) * s.ay;
        let cx = s.baseX * w + dx;
        let cy = s.baseY * h + dy;
        if (mouse.current.active) {
          const mx = mouse.current.x * w;
          const my = mouse.current.y * h;
          cx += (mx - cx) * s.pull * 0.35;
          cy += (my - cy) * s.pull * 0.35;
        }
        const rot = s.rot + Math.sin(t * s.rotSpeed * 0.001 + s.px) * 6 + t * s.rotSpeed * 0.02;
        g.setAttribute("transform", `translate(${cx} ${cy}) rotate(${rot})`);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(135deg, #ffffff 0%, #fbf6ee 45%, #f3f6fc 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          {SHAPES.map((s) => (
            <radialGradient key={s.id} id={s.id} cx="32%" cy="28%" r="85%">
              <stop offset="0%" stopColor={s.c1} stopOpacity="1" />
              <stop offset="50%" stopColor={s.c2} stopOpacity="1" />
              <stop offset="100%" stopColor={s.c3} stopOpacity="1" />
            </radialGradient>
          ))}
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" />
            <feOffset dx="0" dy="18" result="off" />
            <feComponentTransfer><feFuncA type="linear" slope="0.28" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {SHAPES.map((s, i) => (
          <g
            key={s.id}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
            filter="url(#softShadow)"
          >
            {/* main body */}
            <rect
              x={-s.w / 2}
              y={-s.h / 2}
              width={s.w}
              height={s.h}
              rx={s.rx}
              ry={s.rx}
              fill={`url(#${s.id})`}
              opacity={s.opacity}
            />
            {/* glossy highlight */}
            <ellipse
              cx={-s.w * 0.18}
              cy={-s.h * 0.28}
              rx={s.w * 0.36}
              ry={s.h * 0.16}
              fill="white"
              opacity={0.55}
              style={{ filter: "blur(10px)", mixBlendMode: "screen" }}
            />
            {/* small specular dot */}
            <ellipse
              cx={-s.w * 0.24}
              cy={-s.h * 0.32}
              rx={s.w * 0.08}
              ry={s.h * 0.05}
              fill="white"
              opacity={0.9}
              style={{ filter: "blur(2px)", mixBlendMode: "screen" }}
            />
            {/* rim light */}
            <rect
              x={-s.w / 2}
              y={-s.h / 2}
              width={s.w}
              height={s.h}
              rx={s.rx}
              ry={s.rx}
              fill="none"
              stroke="white"
              strokeWidth={1.5}
              opacity={0.35}
              style={{ mixBlendMode: "screen" }}
            />
          </g>
        ))}
      </svg>

      {/* readability halo behind headline */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 42%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 80%)",
        }}
      />
      {/* faint command-center grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(20,33,61,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,33,61,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, black 35%, transparent 90%)",
        }}
      />
    </div>
  );
}
