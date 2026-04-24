"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type Node = {
  pos: [number, number, number];
  size: number;
  type: 0 | 1 | 2 | 3;
};

const TYPE_COLORS = ["#7c3aed", "#06b6d4", "#9f7aea", "#22d3ee"];

function generateGraph(): { nodes: Node[]; edges: Array<[number, number]> } {
  const nodes: Node[] = [];
  const edges: Array<[number, number]> = [];

  // Central hub
  nodes.push({ pos: [0, 0, 0], size: 0.45, type: 0 });

  // First ring of "module" nodes
  const ring1 = 8;
  for (let i = 0; i < ring1; i++) {
    const angle = (i / ring1) * Math.PI * 2;
    nodes.push({
      pos: [Math.cos(angle) * 2.4, Math.sin(angle) * 0.4, Math.sin(angle) * 2.4],
      size: 0.25,
      type: ((i % 3) + 1) as 1 | 2 | 3,
    });
    edges.push([0, i + 1]);
  }

  // Second ring of "function" nodes attached to modules
  const offset = ring1 + 1;
  for (let i = 0; i < ring1; i++) {
    const parent = i + 1;
    const branches = 2 + (i % 2);
    const baseAngle = (i / ring1) * Math.PI * 2;
    for (let j = 0; j < branches; j++) {
      const radius = 4.2;
      const angleOffset = (j - (branches - 1) / 2) * 0.22;
      const a = baseAngle + angleOffset;
      const y = Math.sin(a * 1.7) * 0.9 + (j - 1) * 0.4;
      const idx = nodes.length;
      nodes.push({
        pos: [Math.cos(a) * radius, y, Math.sin(a) * radius],
        size: 0.13 + (j === 0 ? 0.05 : 0),
        type: (((i + j) % 3) + 1) as 1 | 2 | 3,
      });
      edges.push([parent, idx]);
      // Some edges between siblings
      if (j > 0) edges.push([idx - 1, idx]);
    }
  }

  return { nodes, edges };
}

function GraphScene({ rotate = true }: { rotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, edges } = useMemo(() => generateGraph(), []);
  const { viewport } = useThree();

  useFrame((_, dt) => {
    if (groupRef.current && rotate) {
      groupRef.current.rotation.y += dt * 0.12;
    }
  });

  // Build geometries once
  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      const na = nodes[a].pos;
      const nb = nodes[b].pos;
      positions.set([na[0], na[1], na[2], nb[0], nb[1], nb[2]], i * 6);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, edges]);

  const scaleFactor = Math.min(1, viewport.width / 9);

  return (
    <group ref={groupRef} scale={scaleFactor}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#7c3aed" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#06b6d4" />

      {/* Edges */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.size, 18, 18]} />
          <meshStandardMaterial
            color={TYPE_COLORS[n.type]}
            emissive={TYPE_COLORS[n.type]}
            emissiveIntensity={0.5}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CodebaseGraph3D() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <GraphScene />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        rotateSpeed={0.45}
        maxPolarAngle={Math.PI * 0.7}
        minPolarAngle={Math.PI * 0.25}
      />
    </Canvas>
  );
}
