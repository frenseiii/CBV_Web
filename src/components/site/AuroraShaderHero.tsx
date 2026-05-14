import { useEffect, useRef } from "react";

/**
 * AuroraShaderHero
 * Custom WebGL fragment shader: a volumetric, domain-warped fluid of liquid
 * gold (brand orange) and deep navy drifting across white. The cursor casts
 * a real ripple, concentric shockwaves distort the field outward, with a
 * faint chromatic split for premium depth. Falls back gracefully if WebGL
 * is unavailable.
 */
export function AuroraShaderHero() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl =
      (canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: true }) as WebGL2RenderingContext | null) ||
      (canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true }) as WebGLRenderingContext | null);

    if (!gl) {
      // Soft static fallback
      wrap.style.background =
        "radial-gradient(ellipse at 30% 30%, rgba(232,146,32,0.18), transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(20,33,61,0.12), transparent 60%), #ffffff";
      return;
    }

    const isGL2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;

    const vertSrc = isGL2
      ? `#version 300 es
         in vec2 a_pos;
         out vec2 v_uv;
         void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos,0.0,1.0); }`
      : `attribute vec2 a_pos;
         varying vec2 v_uv;
         void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos,0.0,1.0); }`;

    const fragHead = isGL2
      ? `#version 300 es
         precision highp float;
         in vec2 v_uv;
         out vec4 outColor;
         #define FRAG_OUT outColor
         #define VAR_IN in`
      : `precision highp float;
         varying vec2 v_uv;
         #define FRAG_OUT gl_FragColor
         #define VAR_IN varying`;

    const fragSrc = `${fragHead}
      uniform vec2  u_res;
      uniform vec2  u_mouse;     // pixels, top-left origin
      uniform float u_mouseAct;  // 0..1 active
      uniform float u_time;
      uniform float u_ripple;    // age of last ripple
      uniform vec2  u_rippleP;   // position of last ripple (pixels)

      // brand palette
      const vec3 ORANGE   = vec3(0.910, 0.573, 0.125); // #E89220
      const vec3 ORANGE_H = vec3(0.984, 0.776, 0.404); // warm highlight
      const vec3 NAVY     = vec3(0.078, 0.129, 0.239); // #14213D
      const vec3 PAPER    = vec3(1.000, 1.000, 1.000);

      // ---- noise (Inigo Quilez-style value noise + fbm) ----
      float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i), b = hash(i+vec2(1.0,0.0));
        float c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float fbm(vec2 p){
        float v=0.0, a=0.5;
        mat2 R = mat2(0.8,-0.6,0.6,0.8);
        for(int i=0;i<6;i++){ v += a*vnoise(p); p = R*p*2.02; a *= 0.5; }
        return v;
      }

      void main(){
        vec2 res = u_res;
        vec2 frag = v_uv * res;
        // Aspect-corrected normalized coords centered
        vec2 uv = (frag - 0.5*res) / min(res.x, res.y);

        // Mouse in same space
        vec2 m  = (u_mouse - 0.5*res) / min(res.x, res.y);
        vec2 rp = (u_rippleP - 0.5*res) / min(res.x, res.y);

        float t = u_time;

        // ----- Cursor ripple (real shockwave) -----
        float dR = distance(uv, rp);
        float age = u_ripple;
        float wave = sin(dR*22.0 - age*5.5) * exp(-dR*4.5) * exp(-age*1.6);
        // Pull direction outward from ripple origin
        vec2 dir = normalize(uv - rp + 1e-5);
        vec2 warpRipple = dir * wave * 0.06;

        // ----- Magnetic pull toward live cursor -----
        vec2 toM = m - uv;
        float dM = length(toM);
        float pull = u_mouseAct * exp(-dM*3.2) * 0.10;
        vec2 warpPull = normalize(toM + 1e-5) * pull;

        // ----- Domain-warped FBM (the silk) -----
        vec2 p = uv * 1.6;
        vec2 q = vec2(fbm(p + vec2(0.0, t*0.12)), fbm(p + vec2(5.2, -t*0.10)));
        vec2 r = vec2(
          fbm(p + 2.4*q + vec2(1.7 + t*0.08, 9.2)),
          fbm(p + 2.4*q + vec2(8.3, 2.8 - t*0.07))
        );
        vec2 warped = p + 1.8*r + warpRipple + warpPull;
        float f  = fbm(warped);
        float f2 = fbm(warped*1.7 + 3.1);

        // Three masks, brand-only
        float mOrange = smoothstep(0.42, 0.78, f);
        float mNavy   = smoothstep(0.55, 0.92, f2 * (1.0 - mOrange*0.5));
        float mGlow   = smoothstep(0.62, 0.95, f);

        // Compose: white paper base, orange ink, navy depth, warm highlights
        vec3 col = PAPER;
        col = mix(col, ORANGE, mOrange*0.55);
        col = mix(col, NAVY,   mNavy*0.28);
        col = mix(col, ORANGE_H, mGlow*0.30);

        // Subtle chromatic split near cursor (premium feel)
        float ca = u_mouseAct * exp(-dM*3.5) * 0.012;
        float fr = fbm(warped + vec2(ca, 0.0));
        float fb = fbm(warped - vec2(ca, 0.0));
        col.r = mix(col.r, mix(col.r, ORANGE.r, smoothstep(0.45,0.85,fr)*0.4), u_mouseAct*0.6);
        col.b = mix(col.b, mix(col.b, NAVY.b,   smoothstep(0.55,0.90,fb)*0.4), u_mouseAct*0.6);

        // Ripple highlight crest (gold rim along the wave front)
        float crest = smoothstep(0.35, 0.0, abs(wave) - 0.18) * exp(-age*1.6);
        col += ORANGE_H * crest * 0.35;

        // Vignette → white so headline stays crisp
        float vd = length(uv * vec2(1.0, 1.15));
        float vig = smoothstep(0.30, 1.05, vd);
        col = mix(col, PAPER, vig*0.85);

        // Fine grain (kills banding)
        float grain = (hash(frag + t) - 0.5) * 0.012;
        col += grain;

        FRAG_OUT = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("shader error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uMouseAct = gl.getUniformLocation(prog, "u_mouseAct");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRipple = gl.getUniformLocation(prog, "u_ripple");
    const uRippleP = gl.getUniformLocation(prog, "u_rippleP");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = {
      W: 0,
      H: 0,
      mx: -9999,
      my: -9999,
      tmx: -9999,
      tmy: -9999,
      act: 0,
      tact: 0,
      rippleAge: 99,
      rpx: 0,
      rpy: 0,
      lastMove: 0,
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = wrap.getBoundingClientRect();
      state.W = Math.max(1, Math.floor(r.width));
      state.H = Math.max(1, Math.floor(r.height));
      canvas.width = Math.floor(state.W * dpr);
      canvas.height = Math.floor(state.H * dpr);
      canvas.style.width = state.W + "px";
      canvas.style.height = state.H + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      state.tmx = (e.clientX - r.left) * dpr();
      state.tmy = (r.height - (e.clientY - r.top)) * dpr(); // flip y for GL
      state.tact = 1;
      state.lastMove = performance.now();
    };
    const onLeave = () => {
      state.tact = 0;
    };
    const onClick = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      state.rpx = (e.clientX - r.left) * dpr();
      state.rpy = (r.height - (e.clientY - r.top)) * dpr();
      state.rippleAge = 0;
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onClick);

    // Auto-emit a gentle ripple at the cursor every ~2.5s while idle, for ambient life
    let lastAuto = 0;

    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      const now = performance.now();
      const t = (now - t0) / 1000;
      const dt = reduceMotion ? 0.4 : 1.0;

      // smooth cursor + activity
      state.mx += (state.tmx - state.mx) * 0.2;
      state.my += (state.tmy - state.my) * 0.2;
      state.act += (state.tact - state.act) * 0.08;
      state.rippleAge += 0.016 * dt;

      // ambient auto-ripple if user moved recently or once every 3.5s
      if (now - lastAuto > 3500) {
        lastAuto = now;
        if (state.act > 0.05) {
          state.rpx = state.mx;
          state.rpy = state.my;
        } else {
          state.rpx = canvas.width * (0.3 + Math.random() * 0.4);
          state.rpy = canvas.height * (0.3 + Math.random() * 0.4);
        }
        state.rippleAge = 0;
      }

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, state.mx, state.my);
      gl.uniform1f(uMouseAct, state.act);
      gl.uniform1f(uTime, t * dt);
      gl.uniform1f(uRipple, state.rippleAge);
      gl.uniform2f(uRippleP, state.rpx, state.rpy);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default AuroraShaderHero;
