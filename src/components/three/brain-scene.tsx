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
      color: new THREE.Color(0x1a0a2e),
      emissive: new THREE.Color(0x5b21b6),
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.1,
      transmission: 0.15,
      thickness: 0.5,
      transparent: true,
      opacity: 0.92,
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
      <ambientLight intensity={0.25} />
      <pointLight position={[-4, 5, 3]} intensity={8} color="#7c3aed" distance={15} />
      <pointLight position={[4, -4, -3]} intensity={6} color="#06b6d4" distance={15} />
      <directionalLight position={[0, 3, -6]} intensity={1.5} color="#ffffff" />
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
