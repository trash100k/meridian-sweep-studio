// Meridian Sunset Sweep — low-altitude drone over an infinite St. Augustine
// lawn, lit by a horizon-low golden-hour sun. Vertex sway + warm rim light.
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
  className?: string;
};

export function GrassSweep({ className }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- WebGL availability check ---
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch {
      mount.classList.add("no-webgl");
      return;
    }

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // Fog tints distant grass into the warm horizon haze
    scene.fog = new THREE.Fog(0x4a2418, 6, 22);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.05, 60);
    camera.position.set(0, 0.18, 0); // ~6in above turf
    camera.lookAt(0, 0.12, -8);

    // --- Sky/ground gradient (golden hour) ---
    const skyGeo = new THREE.PlaneGeometry(60, 30);
    const skyMat = new THREE.ShaderMaterial({
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: {},
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          // vUv.y goes 0 (bottom of sky plane = horizon) to 1 (top)
          vec3 horizon = vec3(0.95, 0.45, 0.18);   // ember
          vec3 mid     = vec3(0.55, 0.22, 0.18);   // burnt rose
          vec3 top     = vec3(0.10, 0.08, 0.12);   // deep dusk
          float t = clamp(vUv.y, 0.0, 1.0);
          vec3 col = mix(horizon, mid, smoothstep(0.0, 0.4, t));
          col = mix(col, top, smoothstep(0.4, 1.0, t));
          // Sun bloom near horizon center
          float sun = exp(-pow((vUv.x - 0.5) * 4.0, 2.0)) * exp(-pow((vUv.y - 0.05) * 12.0, 2.0));
          col += vec3(1.0, 0.85, 0.55) * sun * 0.6;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 4, -22);
    sky.renderOrder = -1;
    scene.add(sky);

    // --- Ground plane (warm dark loam) ---
    const groundGeo = new THREE.PlaneGeometry(60, 80, 1, 1);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorld;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorld = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        varying vec3 vWorld;
        void main() {
          float dist = length(vWorld.xz - vec2(0.0, 0.0));
          float fogF = smoothstep(4.0, 22.0, abs(vWorld.z));
          vec3 base = vec3(0.06, 0.04, 0.03);
          vec3 warm = vec3(0.32, 0.14, 0.08);
          vec3 col = mix(base, warm, 1.0 - fogF);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    scene.add(ground);

    // --- Grass: instanced blades ---
    const bladeCount = isMobile ? 9000 : 26000;
    const fieldSize = 14; // x extent
    const fieldDepth = 22;

    // Single blade geometry — a 4-segment quad ribbon
    const bladeGeo = new THREE.PlaneGeometry(0.04, 0.32, 1, 4);
    bladeGeo.translate(0, 0.16, 0);

    const grassMat = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0, 0.15, -1).normalize() },
        uTipColor: { value: new THREE.Color(1.0, 0.72, 0.32) },
        uMidColor: { value: new THREE.Color(0.42, 0.32, 0.12) },
        uRootColor: { value: new THREE.Color(0.05, 0.04, 0.02) },
        uFogColor: { value: new THREE.Color(0.29, 0.14, 0.09) },
      },
      vertexShader: `
        uniform float uTime;
        attribute vec3 iOffset;     // per-instance position xz (y unused)
        attribute float iScale;
        attribute float iAngle;
        attribute float iPhase;
        varying float vHeight;
        varying float vDist;
        varying vec3 vNormalW;

        mat2 rot(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }

        void main() {
          vec3 p = position;
          // Bend stronger near tip (uv.y high) — sin sway driven by time + phase
          float h = clamp(p.y / 0.32, 0.0, 1.0);
          vHeight = h;
          float sway = sin(uTime * 1.6 + iPhase + iOffset.x * 0.6 + iOffset.z * 0.3) * 0.06;
          float gust = sin(uTime * 0.5 + iOffset.z * 0.1) * 0.04;
          p.x += (sway + gust) * h;
          p.y *= iScale;
          // Rotate around Y by per-blade angle
          p.xz = rot(iAngle) * p.xz;
          // Place at instance offset
          vec3 worldPos = p + vec3(iOffset.x, 0.0, iOffset.z);
          // Scroll Z toward camera & wrap (infinite runway)
          worldPos.z = mod(worldPos.z + uTime * 1.2, ${fieldDepth.toFixed(1)}) - ${(fieldDepth / 2).toFixed(1)};

          vDist = -worldPos.z;
          vNormalW = normalize(vec3(rot(iAngle) * vec2(0.0, 1.0), 0.4).xzy);
          gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uSunDir;
        uniform vec3 uTipColor;
        uniform vec3 uMidColor;
        uniform vec3 uRootColor;
        uniform vec3 uFogColor;
        varying float vHeight;
        varying float vDist;
        varying vec3 vNormalW;

        void main() {
          // Vertical gradient: tip warm, mid mossy, root deep shadow
          vec3 col = mix(uRootColor, uMidColor, smoothstep(0.0, 0.55, vHeight));
          col = mix(col, uTipColor, smoothstep(0.6, 1.0, vHeight));
          // Rim light from low sun
          float rim = pow(max(dot(normalize(vNormalW), uSunDir), 0.0), 2.0);
          col += uTipColor * rim * 0.55 * vHeight;
          // Distance fog into horizon haze
          float fogF = smoothstep(4.0, 18.0, vDist);
          col = mix(col, uFogColor, fogF);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const instanced = new THREE.InstancedMesh(bladeGeo, grassMat, bladeCount);
    instanced.frustumCulled = false;

    // Per-instance attributes
    const offsets = new Float32Array(bladeCount * 3);
    const scales = new Float32Array(bladeCount);
    const angles = new Float32Array(bladeCount);
    const phases = new Float32Array(bladeCount);
    for (let i = 0; i < bladeCount; i++) {
      const x = (Math.random() - 0.5) * fieldSize;
      const z = (Math.random() - 0.5) * fieldDepth;
      offsets[i * 3 + 0] = x;
      offsets[i * 3 + 1] = 0;
      offsets[i * 3 + 2] = z;
      scales[i] = 0.7 + Math.random() * 0.7;
      angles[i] = Math.random() * Math.PI * 2;
      phases[i] = Math.random() * Math.PI * 2;
    }
    bladeGeo.setAttribute("iOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    bladeGeo.setAttribute("iScale", new THREE.InstancedBufferAttribute(scales, 1));
    bladeGeo.setAttribute("iAngle", new THREE.InstancedBufferAttribute(angles, 1));
    bladeGeo.setAttribute("iPhase", new THREE.InstancedBufferAttribute(phases, 1));
    scene.add(instanced);

    // --- Render loop ---
    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      const t = clock.getElapsedTime();
      grassMat.uniforms.uTime.value = prefersReduced ? 0 : t;
      groundMat.uniforms.uTime.value = t;
      // Tiny camera bob for life
      camera.position.y = 0.18 + (prefersReduced ? 0 : Math.sin(t * 0.6) * 0.005);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause when tab hidden
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      bladeGeo.dispose();
      grassMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
