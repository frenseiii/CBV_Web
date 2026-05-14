import { useEffect, useRef } from "react";

/**
 * Cursor-reactive gradient spotlight on a slowly-morphing mesh.
 * - Base canvas: near-white with very soft navy + orange mesh blobs drifting.
 * - Cursor: a luminous orange/navy spotlight follows the pointer.
 * - Bottom edge fades to pure white for a seamless transition into the next section.
 *
 * No WebGL. Pure DOM + CSS gradients animated via rAF for a calm, premium feel.
 */
export function SpotlightMeshHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.4 });
  const current = useRef({ x: 0.5, y: 0.4 });
  const hovering = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const spot = spotRef.current;
    const mesh = meshRef.current;
    if (!root || !spot || !mesh) return;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      target.current.x = (e.clientX - r.left) / r.width;
      target.current.y = (e.clientY - r.top) / r.height;
      hovering.current = true;
    };
    const onLeave = () => {
      hovering.current = false;
      target.current.x = 0.5;
      target.current.y = 0.4;
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      // Ease cursor follow
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const px = (current.current.x * 100).toFixed(2);
      const py = (current.current.y * 100).toFixed(2);
      const intensity = hovering.current ? 1 : 0.55;
      spot.style.background = `radial-gradient(circle at ${px}% ${py}%, color-mix(in oklab, var(--brand-orange) ${
        28 * intensity
      }%, transparent) 0%, color-mix(in oklab, var(--brand-orange) ${
        14 * intensity
      }%, transparent) 18%, transparent 42%), radial-gradient(circle at ${px}% ${py}%, color-mix(in oklab, var(--brand-navy) ${
        18 * intensity
      }%, transparent) 0%, transparent 55%)`;

      // Slow ambient drift of the mesh
      const t = (now - start) / 1000;
      const a = 50 + Math.sin(t * 0.12) * 10;
      const b = 50 + Math.cos(t * 0.10) * 12;
      const c = 30 + Math.sin(t * 0.09 + 1.2) * 8;
      const d = 70 + Math.cos(t * 0.11 + 0.6) * 9;
      mesh.style.background = `
        radial-gradient(60% 55% at ${a}% ${c}%, color-mix(in oklab, var(--brand-orange) 14%, transparent) 0%, transparent 60%),
        radial-gradient(55% 50% at ${b}% ${d}%, color-mix(in oklab, var(--brand-navy) 18%, transparent) 0%, transparent 65%),
        radial-gradient(70% 60% at ${100 - a}% ${100 - c}%, color-mix(in oklab, var(--brand-navy) 10%, transparent) 0%, transparent 70%)
      `;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden bg-background"
      aria-hidden
    >
      {/* Soft drifting mesh */}
      <div ref={meshRef} className="absolute inset-0" />
      {/* Cursor spotlight */}
      <div ref={spotRef} className="absolute inset-0 transition-opacity duration-500" />
      {/* Faint grid for "command-center" texture */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--brand-navy) 1px, transparent 1px), linear-gradient(to bottom, var(--brand-navy) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      {/* Bottom fade to white for seamless section transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
