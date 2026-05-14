import { useEffect, useRef } from "react";

/**
 * Liquid metaball blobs in brand colours (navy, orange, cream).
 * Blobs drift on sine paths, merge via SVG gooey filter, and lean toward the cursor.
 * Each blob has a radial gradient + specular highlight for a glossy, premium feel.
 */
type BlobDef = {
  id: string;
  baseX: number;
  baseY: number;
  r: number;
  // gradient stops
  c1: string; // bright highlight
  c2: string; // mid
  c3: string; // deep edge
  opacity: number;
  // motion
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  px: number;
  py: number;
  // mouse pull weight
  pull: number;
};

// Positions: orange & navy SWAPPED from previous version
const BLOBS: BlobDef[] = [
  // Big NAVY now on the left (was orange)
  {
    id: "g-navy-1",
    baseX: 0.28,
    baseY: 0.42,
    r: 270,
    c1: "#3a5a9c",
    c2: "#1c2f5a",
    c3: "#0e1830",
    opacity: 0.92,
    ax: 95,
    ay: 60,
    sx: 0.00018,
    sy: 0.00022,
    px: 0,
    py: 1.2,
    pull: 0.18,
  },
  // Big ORANGE now on the right (was navy)
  {
    id: "g-orange-1",
    baseX: 0.72,
    baseY: 0.55,
    r: 290,
    c1: "#ffd9a8",
    c2: "#f5a23d",
    c3: "#c2680f",
    opacity: 0.95,
    ax: 110,
    ay: 70,
    sx: 0.00014,
    sy: 0.00019,
    px: 1.4,
    py: 0.3,
    pull: 0.22,
  },
  // Pure WHITE highlight orb
  {
    id: "g-cream",
    baseX: 0.5,
    baseY: 0.3,
    r: 210,
    c1: "#ffffff",
    c2: "#ffffff",
    c3: "#eef2fa",
    opacity: 0.95,
    ax: 80,
    ay: 50,
    sx: 0.00021,
    sy: 0.00016,
    px: 2.1,
    py: 2.6,
    pull: 0.12,
  },
  // Small NAVY accent (was orange)
  {
    id: "g-navy-2",
    baseX: 0.18,
    baseY: 0.78,
    r: 150,
    c1: "#5573b8",
    c2: "#22386b",
    c3: "#0e1830",
    opacity: 0.85,
    ax: 60,
    ay: 50,
    sx: 0.00026,
    sy: 0.00024,
    px: 3.3,
    py: 1.8,
    pull: 0.28,
  },
  // Small ORANGE accent (was navy)
  {
    id: "g-orange-2",
    baseX: 0.85,
    baseY: 0.18,
    r: 170,
    c1: "#ffe2b8",
    c2: "#f7b35a",
    c3: "#b85a0e",
    opacity: 0.9,
    ax: 70,
    ay: 55,
    sx: 0.00023,
    sy: 0.00027,
    px: 0.8,
    py: 3.2,
    pull: 0.26,
  },
];

export function MetaballsHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const shineRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const rimRefs = useRef<(SVGCircleElement | null)[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false });

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let raf = 0;
    const start = performance.now();

    // Listen on window so cursor is tracked even when content overlays the bg
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
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

      // ease cursor toward target
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.08;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.08;

      BLOBS.forEach((b, i) => {
        const node = circleRefs.current[i];
        if (!node) return;
        const dx = Math.sin(t * b.sx + b.px) * b.ax;
        const dy = Math.cos(t * b.sy + b.py) * b.ay;
        let cx = b.baseX * w + dx;
        let cy = b.baseY * h + dy;

        if (mouse.current.active) {
          const mx = mouse.current.x * w;
          const my = mouse.current.y * h;
          cx += (mx - cx) * b.pull * 0.35;
          cy += (my - cy) * b.pull * 0.35;
        }

        node.setAttribute("cx", String(cx));
        node.setAttribute("cy", String(cy));
        const shine = shineRefs.current[i];
        if (shine) {
          shine.setAttribute("cx", String(cx - b.r * 0.28));
          shine.setAttribute("cy", String(cy - b.r * 0.38));
        }
        const rim = rimRefs.current[i];
        if (rim) {
          rim.setAttribute("cx", String(cx));
          rim.setAttribute("cy", String(cy));
        }
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
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #ffffff 0%, #fbf6ee 40%, #f3f6fc 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          {BLOBS.map((b) => (
            <radialGradient key={b.id} id={b.id} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor={b.c1} stopOpacity="1" />
              <stop offset="45%" stopColor={b.c2} stopOpacity="1" />
              <stop offset="100%" stopColor={b.c3} stopOpacity="1" />
            </radialGradient>
          ))}
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="26" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 22 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
        <g filter="url(#gooey)">
          {BLOBS.map((b, i) => (
            <circle
              key={b.id}
              ref={(el) => {
                circleRefs.current[i] = el;
              }}
              r={b.r}
              fill={`url(#${b.id})`}
              opacity={b.opacity}
            />
          ))}
        </g>
        {/* Glossy specular highlights, sit ON TOP of gooey blobs */}
        <g style={{ mixBlendMode: "screen" }}>
          {BLOBS.map((b, i) => (
            <ellipse
              key={`s-${b.id}`}
              ref={(el) => {
                shineRefs.current[i] = el;
              }}
              rx={b.r * 0.42}
              ry={b.r * 0.22}
              fill="white"
              opacity={0.55}
              style={{ filter: "blur(14px)" }}
              transform-origin="center"
              transform="rotate(-25)"
            />
          ))}
        </g>
        {/* Rim light, thin bright crescent that catches the eye */}
        <g style={{ mixBlendMode: "screen" }}>
          {BLOBS.map((b, i) => (
            <circle
              key={`r-${b.id}`}
              ref={(el) => {
                rimRefs.current[i] = el;
              }}
              r={b.r * 0.95}
              fill="none"
              stroke="white"
              strokeWidth={2}
              opacity={0.35}
              style={{ filter: "blur(3px)" }}
            />
          ))}
        </g>
      </svg>
      {/* inner light disc, strong behind the headline for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 42%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 75%), radial-gradient(ellipse at center, transparent 55%, rgba(255,255,255,0.7) 100%)",
        }}
      />
      {/* faint command-center grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
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
