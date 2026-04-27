"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { BrainPulses } from "./brain-pulses";
import { BrainPostProcessing } from "./shared/post-processing";

useGLTF.preload("/models/human_brain_digital.glb");

type BrainSceneProps = {
  scale?: number;
  autoRotate?: boolean;
  showPulses?: boolean;
  showPostProcessing?: boolean;
  pulseCount?: number;
};

function BrainMesh({
  scale = 1,
  autoRotate = true,
}: {
  scale?: number;
  autoRotate?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const breathRef = useRef(0);
  const { scene } = useGLTF("/models/human_brain_digital.glb") as {
    scene: THREE.Group;
  };

  // Build MeshPhysicalMaterial override on first render
  const overrideMaterial = useRef<THREE.MeshPhysicalMaterial | null>(null);
  if (!overrideMaterial.current) {
    overrideMaterial.current = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0d0420),
      emissive: new THREE.Color(0x8b5cf6),
      emissiveIntensity: 1.6,
      roughness: 0.18,
      metalness: 0.35,
      transmission: 0.22,
      thickness: 1.2,
      transparent: true,
      opacity: 0.95,
      iridescence: 0.4,
      iridescenceIOR: 1.6,
    });
  }

  // Apply material override to every mesh in GLB
  const brainClone = useRef<THREE.Group | null>(null);
  if (!brainClone.current) {
    brainClone.current = scene.clone(true);
    brainClone.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = overrideMaterial.current!;
      }
    });
  }

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    breathRef.current += dt;

    if (autoRotate) {
      groupRef.current.rotation.y += 0.0015;
    }

    // Breath scale: 1.00 ↔ 1.015 sinusoidal, 4s loop
    const breathScale = 1 + Math.sin((breathRef.current * Math.PI * 2) / 4) * 0.0075;
    groupRef.current.scale.setScalar(scale * breathScale);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={brainClone.current} />
    </group>
  );
}

function BrainLighting() {
  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[-5, 6, 3]} intensity={18} color="#8b5cf6" distance={20} />
      <pointLight position={[5, -5, -3]} intensity={12} color="#06b6d4" distance={20} />
      <pointLight position={[0, -6, 5]} intensity={6} color="#7c3aed" distance={15} />
      <directionalLight position={[0, 4, -8]} intensity={2.5} color="#ffffff" />
    </>
  );
}

export function BrainScene({
  scale = 1,
  autoRotate = true,
  showPulses = true,
  showPostProcessing = true,
  pulseCount = 15,
}: BrainSceneProps) {
  return (
    <>
      <BrainLighting />
      <BrainMesh scale={scale} autoRotate={autoRotate} />
      {showPulses && <BrainPulses count={pulseCount} scale={scale} />}
      {showPostProcessing && <BrainPostProcessing />}
    </>
  );
}
