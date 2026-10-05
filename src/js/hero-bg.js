// =====================================================================
// HERO-BAKGRUND: en lätt WebGL-shader (flytande kobolt-"ljus" i mörker).
// - Renderas i låg upplösning och skalas upp (blobbar tål det) = billigt.
// - Pausas när hero inte syns eller fliken är dold.
// - 30 fps på mobil/svaga enheter, en enda stillbild vid reducerad rörelse.
// - Saknas WebGL syns CSS-gradienten i .hero__bg istället.
// =====================================================================
import { reduceMotion, lowPower, finePointer } from './env.js';

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float t = uTime * 0.06;

  // domain warping = mjuka, organiska former
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 3.1));
  vec2 m = (uMouse - 0.5) * 0.35;
  float f = fbm(p * 1.1 + q * 1.6 + m + vec2(t * 0.7, -t * 0.4));

  vec3 ink = vec3(0.039, 0.039, 0.043);
  vec3 cobalt = vec3(0.184, 0.294, 1.0);
  vec3 ice = vec3(0.75, 0.80, 1.0);

  float glow = smoothstep(0.42, 0.85, f);
  float vign = smoothstep(1.25, 0.15, length(p - vec2(0.35, 0.15)));
  vec3 col = mix(ink, cobalt * 0.85, glow * vign);
  col = mix(col, ice, pow(glow, 5.0) * 0.35 * vign);

  // tunna "konturlinjer" i ljuset ger ett tekniskt, tecknat uttryck
  float bands = abs(fract(f * 9.0) - 0.5);
  col += cobalt * smoothstep(0.06, 0.0, bands) * 0.12 * glow;

  // tona mot svart nertill så texten alltid är läsbar
  col = mix(col, ink, smoothstep(0.55, 0.0, uv.y) * 0.65);

  // lätt korn mot banding
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function initHeroBg(canvas, gsap) {
  if (!canvas) return;
  let gl;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch (e) {
    gl = null;
  }
  if (!gl) return; // CSS-reserv syns

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');

  // Upplösningsskala: färre pixlar = mycket billigare. Blobbarna är mjuka ändå.
  const scale = lowPower ? 0.28 : 0.5;
  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    }
  };

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  if (finePointer && !reduceMotion) {
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.tx = e.clientX / window.innerWidth;
        mouse.ty = 1 - e.clientY / window.innerHeight;
      },
      { passive: true }
    );
  }

  const draw = (time) => {
    resize();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  canvas.classList.add('is-ready');

  if (reduceMotion) {
    draw(12.0);
    window.addEventListener('resize', () => draw(12.0));
    return;
  }

  // Animation via GSAP:s ticker (samma klocka som allt annat)
  let visible = true;
  let last = 0;
  const minDelta = lowPower ? 1 / 30 : 0; // 30 fps på svagare enheter
  const tick = (time) => {
    if (!visible || document.hidden) return;
    if (time - last < minDelta) return;
    last = time;
    draw(time + 4.0);
  };
  gsap.ticker.add(tick);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(canvas);
}
