"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// A living, iridescent AI orb. Smooth sin-based displacement (bounded, no NaN
// shards) + fresnel rim glow. Slowly rotates and leans toward the cursor.
// If WebGL is unavailable, a CSS aurora fallback shows instead.

const vertex = /* glsl */ `
  uniform float uT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float d = sin(position.x * 2.2 + uT) * sin(position.y * 2.2 + uT * 1.15) * sin(position.z * 2.2 + uT * 0.9);
    vec3 pos = position + normal * d * 0.12;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.0);
    vec3 a = vec3(0.40, 0.24, 0.92);   // violet
    vec3 b = vec3(0.18, 0.48, 1.00);   // blue
    vec3 c = vec3(0.16, 0.86, 0.74);   // teal
    float t = vN.y * 0.5 + 0.5;
    vec3 base = mix(a, b, smoothstep(0.0, 0.6, t));
    base = mix(base, c, smoothstep(0.55, 1.0, t));
    vec3 col = base * 0.5 + vec3(0.82, 0.90, 1.0) * f * 1.25 + vec3(0.95, 0.72, 1.0) * pow(f, 4.0) * 0.55;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Orb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      setFailed(true);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.z = 4.2;

    const uniforms = { uT: { value: 0 } };
    const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
    const geometry = new THREE.IcosahedronGeometry(1.32, 48);
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    function resize() {
      const s = canvas!.clientWidth || 300;
      renderer.setSize(s, s, false);
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0, y: 0 };
    function onMove(e: PointerEvent) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove);

    let raf = 0, t = 0;
    // pre-warm a few frames so the very first paint already looks displaced
    for (let i = 0; i < 10; i++) { t += 0.016; uniforms.uT.value = t; renderer.render(scene, camera); }

    function loop() {
      if (!reduce) t += 0.016;
      uniforms.uT.value = t;
      const targetY = mouse.x * 0.5 + t * 0.12;
      const targetX = mouse.y * 0.4;
      orb.rotation.y += (targetY - orb.rotation.y) * 0.05;
      orb.rotation.x += (targetX - orb.rotation.x) * 0.05;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="orb-holder">
      <div className="orb-glow" />
      <div className="orb-ring r2" />
      {failed ? <div className="orb-fallback" /> : <canvas ref={canvasRef} className="orb-canvas" aria-hidden />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="orb-face" src="/memoji/greeting.jpeg" alt="Bishal Roy" />
      <div className="orb-ring r1" />
    </div>
  );
}
