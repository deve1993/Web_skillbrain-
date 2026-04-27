"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PULSE_COUNT = 16;
const ANCHOR_COUNT = 14;
const VIOLET = new THREE.Color(0x7c3aed);
const CYAN = new THREE.Color(0x06b6d4);

// Generate random anchor points on a brain-shaped ellipsoid surface
function generateAnchors(count: number, scale: number): THREE.Vector3[] {
  const anchors: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    // Fibonacci sphere distribution for even surface coverage
    const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const x = Math.sin(phi) * Math.cos(theta) * 1.2 * scale;
    const y = Math.cos(phi) * 0.9 * scale;
    const z = Math.sin(phi) * Math.sin(theta) * 1.0 * scale;
    anchors.push(new THREE.Vector3(x, y, z));
  }
  return anchors;
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
  active: boolean;
};

type BrainPulsesProps = {
  count?: number;
  scale?: number;
};

export function BrainPulses({ count = PULSE_COUNT, scale = 1 }: BrainPulsesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
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
      const curve = new THREE.QuadraticBezierCurve3(from, control, to);

      return {
        from,
        to,
        control,
        curve,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        color: i % 2 === 0 ? VIOLET.clone() : CYAN.clone(),
        delay: Math.random() * 3,
        active: true,
      };
    });
  }, [count, anchors, scale]);

  // Material with vertex colors
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: VIOLET,
        transparent: true,
        opacity: 0.9,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    pulses.forEach((pulse, i) => {
      // Delay-based stagger
      if (time < pulse.delay) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
        return;
      }

      pulse.progress += dt * pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        // Pick new random anchor pair on loop
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

      const pos = pulse.curve.getPoint(pulse.progress);
      dummy.position.copy(pos);
      // Ease in/out opacity via scale
      const t = pulse.progress;
      const visibility = Math.sin(t * Math.PI);
      dummy.scale.setScalar(0.02 * scale * visibility);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, pulse.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <primitive object={material} />
    </instancedMesh>
  );
}
