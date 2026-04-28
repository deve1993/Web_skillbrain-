"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PULSE_COUNT = 16;
const ANCHOR_COUNT = 14;
const VIOLET = new THREE.Color(0x7c3aed);
const CYAN = new THREE.Color(0x06b6d4);

const MEMORY_LABELS = [
  "skill:nextjs",  "memory:auth",   "session+",      "bug:fixed",
  "context:sync",  "pattern+",      "memory_add",    "skill_read",
  "247 nodes",     "sync:live",     "agent:code",    "deploy:ok",
  "ctx saved",     "recall+",       "memory+1",      "session:ok",
] as const;

function generateAnchors(count: number, scale: number): THREE.Vector3[] {
  const anchors: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = Math.sin(phi) * Math.cos(theta) * 1.2 * scale;
    const y = Math.cos(phi) * 0.9 * scale;
    const z = Math.sin(phi) * Math.sin(theta) * 1.0 * scale;
    anchors.push(new THREE.Vector3(x, y, z));
  }
  return anchors;
}

function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function makeMemoryTexture(label: string, isCyan: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 140;
  canvas.height = 34;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 140, 34);

  const bg = isCyan ? "rgba(6,182,212,0.65)" : "rgba(124,58,237,0.65)";
  const border = isCyan ? "rgba(34,211,238,0.8)" : "rgba(167,139,250,0.8)";
  const textColor = isCyan ? "#cffafe" : "#ede9fe";

  ctx.fillStyle = bg;
  fillRoundRect(ctx, 1, 1, 138, 32, 7);
  ctx.fill();

  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  fillRoundRect(ctx, 1, 1, 138, 32, 7);
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 70, 17);

  return new THREE.CanvasTexture(canvas);
}

type Pulse = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  control: THREE.Vector3;
  curve: THREE.QuadraticBezierCurve3;
  progress: number;
  speed: number;
  color: THREE.Color;
  delay: number;
};

type BrainPulsesProps = {
  count?: number;
  scale?: number;
};

export function BrainPulses({ count = PULSE_COUNT, scale = 1 }: BrainPulsesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const labelsGroupRef = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const anchors = useMemo(() => generateAnchors(ANCHOR_COUNT, scale), [scale]);

  const pulses = useMemo<Pulse[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const fromIdx = Math.floor(Math.random() * ANCHOR_COUNT);
      let toIdx = Math.floor(Math.random() * ANCHOR_COUNT);
      if (toIdx === fromIdx) toIdx = (fromIdx + 1) % ANCHOR_COUNT;

      const from = anchors[fromIdx].clone();
      const to = anchors[toIdx].clone();
      const control = new THREE.Vector3(
        (from.x + to.x) * 0.5 + (Math.random() - 0.5) * 1.2 * scale,
        (from.y + to.y) * 0.5 + Math.random() * 1.0 * scale,
        (from.z + to.z) * 0.5 + (Math.random() - 0.5) * 0.6 * scale,
      );

      return {
        from, to, control,
        curve: new THREE.QuadraticBezierCurve3(from, control, to),
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        color: i % 2 === 0 ? VIOLET.clone() : CYAN.clone(),
        delay: Math.random() * 3,
      };
    });
  }, [count, anchors, scale]);

  // One sprite per pulse, canvas texture with memory label
  const sprites = useMemo<THREE.Sprite[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const isCyan = i % 2 !== 0;
      const label = MEMORY_LABELS[i % MEMORY_LABELS.length];
      const texture = makeMemoryTexture(label, isCyan);
      const mat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        toneMapped: false,
        sizeAttenuation: true,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.5 * scale, 0.12 * scale, 1);
      return sprite;
    });
  }, [count, scale]);

  useEffect(() => {
    if (!labelsGroupRef.current) return;
    const group = labelsGroupRef.current;
    sprites.forEach((s) => group.add(s));
    return () => {
      sprites.forEach((s) => {
        (s.material as THREE.SpriteMaterial).map?.dispose();
        (s.material as THREE.SpriteMaterial).dispose();
        group.remove(s);
      });
    };
  }, [sprites]);

  const dotMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.9, toneMapped: false }),
    [],
  );

  useEffect(() => () => { dotMaterial.dispose(); }, [dotMaterial]);

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    pulses.forEach((pulse, i) => {
      const sprite = sprites[i];

      if (time < pulse.delay) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        if (sprite) (sprite.material as THREE.SpriteMaterial).opacity = 0;
        return;
      }

      pulse.progress += dt * pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        const fromIdx = Math.floor(Math.random() * ANCHOR_COUNT);
        let toIdx = Math.floor(Math.random() * ANCHOR_COUNT);
        if (toIdx === fromIdx) toIdx = (fromIdx + 1) % ANCHOR_COUNT;
        pulse.from = anchors[fromIdx].clone();
        pulse.to = anchors[toIdx].clone();
        pulse.control = new THREE.Vector3(
          (pulse.from.x + pulse.to.x) * 0.5 + (Math.random() - 0.5) * 1.2 * scale,
          (pulse.from.y + pulse.to.y) * 0.5 + Math.random() * 1.0 * scale,
          (pulse.from.z + pulse.to.z) * 0.5 + (Math.random() - 0.5) * 0.6 * scale,
        );
        pulse.curve = new THREE.QuadraticBezierCurve3(pulse.from, pulse.control, pulse.to);
      }

      const t = pulse.progress;
      const pos = pulse.curve.getPoint(t);
      const visibility = Math.sin(t * Math.PI);

      // Dot
      dummy.position.copy(pos);
      dummy.scale.setScalar(0.025 * scale * visibility);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, pulse.color);

      // Label: fade in t=0.25→0.5, hold, fade out t=0.5→0.75
      if (sprite) {
        const inWindow = t > 0.25 && t < 0.75;
        const labelOpacity = inWindow
          ? Math.sin(((t - 0.25) / 0.5) * Math.PI) * 0.88
          : 0;
        (sprite.material as THREE.SpriteMaterial).opacity = labelOpacity;
        sprite.position.copy(pos);
        sprite.position.y += 0.13 * scale;
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <primitive object={dotMaterial} />
      </instancedMesh>
      <group ref={labelsGroupRef} />
    </>
  );
}
