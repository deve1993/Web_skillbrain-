"use client";

import { useEffect, useRef } from "react";
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
  onLoaded?: () => void;
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

  // Solid material — tuned for env map
  const solidMaterial = useRef<THREE.MeshPhysicalMaterial | null>(null);
  if (!solidMaterial.current) {
    solidMaterial.current = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x150830),
      emissive: new THREE.Color(0x8b5cf6),
      emissiveIntensity: 2.2,
      roughness: 0.15,
      metalness: 0.5,
      transmission: 0.18,
      thickness: 1.2,
      transparent: true,
      opacity: 0.97,
      iridescence: 0.8,
      iridescenceIOR: 1.8,
    });
  }

  // Wireframe overlay — digital neural net look
  const wireMaterial = useRef<THREE.MeshBasicMaterial | null>(null);
  if (!wireMaterial.current) {
    wireMaterial.current = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xa78bfa),
      wireframe: true,
      transparent: true,
      opacity: 0.1,
      toneMapped: false,
    });
  }

  const solidClone = useRef<THREE.Group | null>(null);
  const wireClone = useRef<THREE.Group | null>(null);

  if (!solidClone.current) {
    solidClone.current = scene.clone(true);
    solidClone.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = solidMaterial.current!;
      }
    });
  }

  if (!wireClone.current) {
    wireClone.current = scene.clone(true);
    wireClone.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = wireMaterial.current!;
      }
    });
  }

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    breathRef.current += dt;

    if (autoRotate) {
      groupRef.current.rotation.y += 0.0015;
    }

    const breathScale = 1 + Math.sin((breathRef.current * Math.PI * 2) / 4) * 0.0075;
    groupRef.current.scale.setScalar(scale * breathScale);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={solidClone.current} />
      <primitive object={wireClone.current} />
    </group>
  );
}

function BrainLighting() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[-5, 6, 3]} intensity={40} color="#8b5cf6" distance={20} />
      <pointLight position={[5, -5, -3]} intensity={25} color="#06b6d4" distance={20} />
      <pointLight position={[0, -6, 5]} intensity={9} color="#7c3aed" distance={15} />
      <directionalLight position={[0, 4, -8]} intensity={3.5} color="#ffffff" />
    </>
  );
}

export function BrainScene({
  scale = 1,
  autoRotate = true,
  showPulses = true,
  showPostProcessing = true,
  pulseCount = 15,
  onLoaded,
}: BrainSceneProps) {
  useEffect(() => {
    onLoaded?.();
  }, [onLoaded]);

  return (
    <>
      <BrainLighting />
      <BrainMesh scale={scale} autoRotate={autoRotate} />
      {showPulses && <BrainPulses count={pulseCount} scale={scale} />}
      {showPostProcessing && <BrainPostProcessing />}
    </>
  );
}
