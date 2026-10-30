/**
 * Procedural render of the Madrid Cutz ceiling: a honeycomb of white LED tubes
 * (with the dark connectors at every joint) inside a rectangular border tube,
 * reflected in a polished stone floor. Everything is analytic, so it stays
 * razor sharp at any resolution and costs a few KB instead of a hero video.
 */

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform float uPower;     // seconds since the lights were switched on
uniform vec3 uCam;        // pitch, yaw, roll (radians)
uniform float uFocal;     // focal length in screen-height units
uniform float uTravel;    // dolly offset along the room (meters)
uniform float uHalfW;     // half width of the lit ceiling frame (meters)
uniform float uFloor;     // 0..1 floor reflection amount
uniform float uExposure;
uniform float uVignette;

const float CEILING = 3.1;
const float EYE = 1.45;
const float CELL = 1.08;   // flat-to-flat size of one hexagon (meters)
const float TUBE = 0.019;  // tube half width (cell units)
const float JOINT = 0.052; // radius of the dark connector at each vertex

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
             mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// x: distance to the nearest hexagon edge, y: distance to the nearest vertex.
// Pointy-top hexagons with an inradius of 0.5 (cell units).
vec2 hexField(vec2 uv) {
  const vec2 s = vec2(1.0, 1.7320508);
  vec4 hc = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 h = vec4(uv - hc.xy * s, uv - (hc.zw + 0.5) * s);
  vec2 p = dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
  vec2 a = abs(p);
  float edge = 0.5 - max(dot(a, vec2(0.5, 0.8660254)), a.x);
  float vtx = min(length(a - vec2(0.0, 0.5773503)), length(a - vec2(0.5, 0.2886751)));
  return vec2(edge, vtx);
}

// Brightness of a tube at distance d, anti-aliased against pixel footprint fw.
float tube(float d, float w, float fw) {
  float we = max(w, fw);
  return (1.0 - smoothstep(we - fw * 0.5, we + fw * 0.5, d)) * (w / we);
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;

  // Camera ray.
  vec3 rd = normalize(vec3(uv, -uFocal));
  rd.xy = rot(uCam.z) * rd.xy;
  rd.yz = rot(-uCam.x) * rd.yz;
  rd.xz = rot(uCam.y) * rd.xz;

  bool up = rd.y > 0.0;
  float ay = max(abs(rd.y), 1e-4);

  // Floor rays see the ceiling mirrored: same as looking up from -EYE.
  float t = (up ? CEILING - EYE : CEILING + EYE) / ay;
  t = min(t, 400.0);
  vec2 p = rd.xz * t;
  float floorT = EYE / ay;
  vec2 fp = rd.xz * floorT;

  // Polished stone: soft clouding plus thin veins, perturbing the reflection.
  float cloud = fbm(fp * 0.55 + 3.0);
  float vein = pow(1.0 - abs(sin(fp.x * 0.9 + fp.y * 0.35 + cloud * 7.0)), 18.0);
  vec2 wobble = (vec2(fbm(fp * 1.3), fbm(fp * 1.3 + 11.0)) - 0.5) * (0.12 + min(floorT, 14.0) * 0.035);
  p += up ? vec2(0.0) : wobble;

  float blur = up ? 1.0 : 3.2 + floorT * 0.11;

  vec2 cuv = vec2(p.x, p.y - uTravel) / CELL;
  vec2 hf = hexField(cuv);
  float fw = (fwidth(cuv.x) + fwidth(cuv.y)) * 0.6 * blur;
  fw = max(fw, 1e-4);

  float w = TUBE * blur;
  float inside = 1.0 - smoothstep(uHalfW - 0.04, uHalfW, abs(p.x));

  float joint = smoothstep(JOINT - fw, JOINT + fw, hf.y);
  joint = mix(1.0, joint, clamp(TUBE / max(fw, TUBE), 0.0, 1.0));
  float hexCore = tube(hf.x, w, fw) * joint * inside;

  float bd = abs(abs(p.x) - uHalfW) / CELL;
  float borderCore = tube(bd, w * 1.15, fw);

  // Brighter at the centre of the tube so it reads as a lit diffuser, not a flat bar.
  float profile = 1.0 - 0.45 * clamp(min(hf.x, bd) / max(w, fw), 0.0, 1.0);
  float core = max(hexCore, borderCore) * profile;
  float halo = (exp(-hf.x * 34.0 / blur) * inside + exp(-bd * 30.0 / blur)) * 0.24;
  float bloom = (exp(-hf.x * 7.5) * inside + exp(-bd * 6.0)) * 0.06;

  // Power-on: a fluorescent stutter, then a sweep running away from camera.
  float u = uPower;
  float stutter = (step(0.10, u) - step(0.16, u)) * 0.75 + (step(0.27, u) - step(0.31, u)) * 0.45;
  float sweep = smoothstep(0.0, 0.22, u - 0.45 - max(-p.y, 0.0) * 0.032);
  float power = max(stutter, sweep);

  float fog = exp(-t * 0.042);
  float horizonFade = smoothstep(0.0, 0.06, ay);
  float light = (core * 3.2 + halo + bloom) * power * fog * horizonFade;

  vec3 lampColor = vec3(0.93, 0.96, 1.0);
  vec3 col = vec3(0.0);

  if (up) {
    // Faint ceiling surface lift between the tubes.
    float ceilingAmb = 0.012 * inside * fog * power;
    col = lampColor * light + vec3(ceilingAmb);
  } else {
    float fres = 0.05 + 0.95 * pow(1.0 - ay, 5.0);
    float refl = mix(0.09, 0.42, fres) * (0.25 + 1.1 * cloud * cloud) * uFloor;
    // Blue-grey marble, as in the shop.
    vec3 stone = vec3(0.012, 0.016, 0.021) * (0.6 + cloud) + vein * vec3(0.03, 0.033, 0.037);
    float pool = exp(-floorT * 0.055) * (1.0 - smoothstep(uHalfW * 0.5, uHalfW * 1.8, abs(fp.x)));
    vec3 diffuse = stone * (0.5 + 3.0 * pool * power);
    vec3 tint = vec3(1.0, 0.965, 0.9);
    col = diffuse * uFloor + tint * lampColor * light * refl;
    col *= horizonFade;
  }

  // Haze where the room disappears into the distance.
  float haze = exp(-ay * 22.0) * exp(-abs(rd.x / max(-rd.z, 0.05)) * 2.2) * 0.07 * power;
  col += vec3(0.85, 0.88, 0.95) * haze * step(rd.z, 0.0);

  col = vec3(1.0) - exp(-col * uExposure);

  float v = length(uv * vec2(0.85, 1.15));
  col *= 1.0 - uVignette * smoothstep(0.25, 1.05, v);

  float grain = hash21(frag + fract(uTime * 7.31) * 113.0) - 0.5;
  col += grain * 0.018;

  outColor = vec4(max(col, 0.0), 1.0);
}
`
