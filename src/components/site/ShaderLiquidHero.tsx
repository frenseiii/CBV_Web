import { useEffect, useRef } from "react";

/**
 * Premium liquid-ink shader background.
 * Orange + cream "ink" swirling forever in navy "water" via domain-warped fBm noise.
 * The cursor pushes the field (fake fluid distortion).
 * Pure WebGL2 fragment shader, single fullscreen triangle, no deps.
 */

const VERT = /* glsl */ `#version 300 es
out vec2 vUv;
void main() {
  // fullscreen triangle
  vec2 p = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0);
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;     // 0..1 in viewport
uniform float uMouseAct;  // 0..1 fade

// Brand palette, ink on white paper
const vec3 PAPER       = vec3(1.000, 1.000, 1.000);
const vec3 PAPER_WARM  = vec3(0.992, 0.969, 0.929);
const vec3 NAVY_DEEP   = vec3(0.027, 0.058, 0.149);
const vec3 NAVY_MID    = vec3(0.078, 0.129, 0.239);
const vec3 NAVY_SOFT   = vec3(0.282, 0.380, 0.580);
const vec3 ORANGE_HOT  = vec3(0.969, 0.580, 0.118);
const vec3 ORANGE_DEEP = vec3(0.760, 0.337, 0.039);
const vec3 ORANGE_SOFT = vec3(0.992, 0.776, 0.494);

// --- hash / noise / fbm ---
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

// Domain-warped fBm, the swirl
float warpedFbm(vec2 p, float t, vec2 mouseOff) {
  // first warp
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.08),
    fbm(p + vec2(5.2, 1.3) - t * 0.06)
  );
  // second warp pushed by mouse
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.12 + mouseOff),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.10 + mouseOff)
  );
  return fbm(p + 4.0 * r);
}

void main() {
  // aspect-correct uv around the centre
  vec2 uv = (vUv * uRes - 0.5 * uRes) / min(uRes.x, uRes.y);

  // Mouse offset in shader space
  vec2 m = (uMouse * uRes - 0.5 * uRes) / min(uRes.x, uRes.y);
  vec2 toMouse = uv - m;
  float md = length(toMouse);
  // Radial push: drag the field outward from cursor like a finger in water
  float push = uMouseAct * exp(-md * 3.0) * 0.35;
  vec2 mouseOff = -toMouse * push * 4.0;

  // Sample warped field
  float t = uTime * 0.25;
  // Two independent ink fields, navy and orange swirl differently
  float nOrange = warpedFbm(uv * 1.3 + vec2(0.0, t * 0.20), t, mouseOff);
  float nNavy   = warpedFbm(uv * 1.5 - vec2(t * 0.18, 0.0), t * 1.1, mouseOff * 0.8);

  // Paper base, soft warm gradient
  float depth = smoothstep(0.0, 1.2, length(uv));
  vec3 col = mix(PAPER, PAPER_WARM, depth * 0.5);

  // Navy ink, translucent layered
  float navyMask  = smoothstep(0.50, 0.78, nNavy);
  float navyDeep  = smoothstep(0.62, 0.85, nNavy);
  col = mix(col, NAVY_SOFT, navyMask * 0.55);
  col = mix(col, NAVY_MID,  navyDeep * 0.65);
  col = mix(col, NAVY_DEEP, smoothstep(0.78, 0.92, nNavy) * 0.5);

  // Orange ink, sits on top, brighter
  float orgMask = smoothstep(0.52, 0.78, nOrange);
  float orgHot  = smoothstep(0.65, 0.86, nOrange);
  col = mix(col, ORANGE_SOFT, orgMask * 0.55);
  col = mix(col, ORANGE_HOT,  orgHot * 0.75);
  col = mix(col, ORANGE_DEEP, smoothstep(0.80, 0.94, nOrange) * 0.4);

  // Where orange and navy overlap, burnt edge
  float edge = orgMask * navyMask;
  col = mix(col, ORANGE_DEEP, edge * 0.35);

  // Cursor warm bloom
  float mGlow = uMouseAct * exp(-md * 2.2) * 0.5;
  col += ORANGE_HOT * mGlow * 0.18;

  // Soft outer fade back to paper
  float vig = smoothstep(1.4, 0.3, length(uv));
  col = mix(PAPER, col, mix(0.65, 1.0, vig));

  // Subtle paper grain
  float g = (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;
  col += g;

  outColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
  }
  return sh;
}

export function ShaderLiquidHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      // Graceful fallback, show a static gradient
      canvas.style.background =
        "radial-gradient(ellipse at 30% 40%, #14213d 0%, #07103f 70%), radial-gradient(circle at 70% 60%, rgba(241,161,50,0.4), transparent 60%)";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseAct = gl.getUniformLocation(prog, "uMouseAct");

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(r.width * dpr));
      const h = Math.max(1, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Mouse, eased toward target
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, act: 0, tact: 0 };
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        mouse.tact = 0;
        return;
      }
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1.0 - (e.clientY - r.top) / r.height; // flip Y for GL
      mouse.tact = 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;
      mouse.act += (mouse.tact - mouse.act) * 0.05;

      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseAct, mouse.act);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* readability disc behind headline, soft white halo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 42%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 80%)",
        }}
      />
      {/* outer fade to white */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(255,255,255,0.85) 100%)",
        }}
      />
    </div>
  );
}
