"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// 3 thread target positions (world space, below brain)
const THREAD_TARGETS = [
  new THREE.Vector3(-3.2, -2.8, 0),
  new THREE.Vector3(0, -2.8, 0),
  new THREE.Vector3(3.2, -2.8, 0),
];

// Brain surface anchor points for agent emission
const BRAIN_ANCHORS = [
  new THREE.Vector3(-0.5, 0.4, 0.3),
  new THREE.Vector3(0.5, 0.4, 0.3),
  new THREE.Vector3(0, 0.6, 0),
  new THREE.Vector3(-0.4, 0, 0.5),
  new THREE.Vector3(0.4, 0, 0.5),
];

type Agent = {
  threadIndex: number;
  progress: number;
  speed: number;
  curve: THREE.QuadraticBezierCurve3;
  active: boolean;
  nextEmitAt: number;
  shape: number; // 0=tetra, 1=box, 2=octa
};

const AGENT_COLORS = [
  new THREE.Color(0x7c3aed), // violet — code
  new THREE.Color(0x06b6d4), // cyan — research
  new THREE.Color(0x9f7aea), // soft violet — deploy
];

// Bezier path line points (pre-computed per thread)
type BezierLine = {
  points: THREE.Vector3[];
  color: string;
};

export type AgentEmissionEvent = {
  threadIndex: number;
  time: number;
};

type AgentEmanationProps = {
  scale?: number;
  onAgentLand?: (threadIndex: number) => void;
};

export function AgentEmanation({ scale = 1, onAgentLand }: AgentEmanationProps) {
  const tetraRef = useRef<THREE.InstancedMesh>(null);
  const boxRef = useRef<THREE.InstancedMesh>(null);
  const octaRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const agents = useRef<Agent[]>([
    { threadIndex: 0, progress: 0.05, speed: 0.18, curve: makeCurve(0, scale), active: false, nextEmitAt: 1.2, shape: 0 },
    { threadIndex: 1, progress: 0, speed: 0.16, curve: makeCurve(1, scale), active: false, nextEmitAt: 4.0, shape: 1 },
    { threadIndex: 2, progress: 0, speed: 0.20, curve: makeCurve(2, scale), active: false, nextEmitAt: 7.0, shape: 2 },
  ]);

  function makeCurve(threadIndex: number, s: number) {
    const anchor = BRAIN_ANCHORS[threadIndex % BRAIN_ANCHORS.length];
    const from = anchor.clone().multiplyScalar(s);
    const to = THREAD_TARGETS[threadIndex].clone().multiplyScalar(s * 0.6);
    const control = new THREE.Vector3(
      (from.x + to.x) * 0.5 + (Math.random() - 0.5) * 1.5 * s,
      from.y + 0.5 * s,
      (from.z + to.z) * 0.5,
    );
    return new THREE.QuadraticBezierCurve3(from, control, to);
  }

  const refs = [tetraRef, boxRef, octaRef];

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Loop at 8s
    const loopTime = time % 8;

    agents.current.forEach((agent, i) => {
      // Activate at scheduled time
      if (!agent.active && loopTime >= agent.nextEmitAt) {
        agent.active = true;
        agent.progress = 0;
        agent.curve = makeCurve(agent.threadIndex, scale);
      }

      // Reset on loop boundary
      if (loopTime < 0.1 && agent.progress > 0.5) {
        agent.active = false;
        agent.progress = 0;
        agent.nextEmitAt = [1.2, 4.0, 7.0][i];
      }

      const meshRef = refs[agent.shape];
      if (!meshRef.current) return;

      if (!agent.active) {
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(0, dummy.matrix);
        meshRef.current.instanceMatrix.needsUpdate = true;
        return;
      }

      agent.progress = Math.min(agent.progress + 0.008, 1);

      if (agent.progress >= 1) {
        agent.active = false;
        onAgentLand?.(agent.threadIndex);
        // Schedule next emission after 8s - current offset
        agent.nextEmitAt = ([1.2, 4.0, 7.0][i] + 8) % 8;
        dummy.scale.setScalar(0);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(0, dummy.matrix);
        meshRef.current.instanceMatrix.needsUpdate = true;
        return;
      }

      const pos = agent.curve.getPoint(agent.progress);
      dummy.position.copy(pos);
      const t = agent.progress;
      const vis = Math.sin(t * Math.PI);
      dummy.scale.setScalar(0.08 * scale * vis);
      dummy.rotation.y = time * 2 + i * 2.1;
      dummy.rotation.x = time * 1.3 + i;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(0, dummy.matrix);
      meshRef.current.instanceMatrix.needsUpdate = true;
    });
  });

  // Bezier curve lines (decorative, always visible)
  const bezierLines = useMemo<BezierLine[]>(() => {
    return THREAD_TARGETS.map((target, i) => {
      const anchor = BRAIN_ANCHORS[i % BRAIN_ANCHORS.length];
      const from = anchor.clone().multiplyScalar(scale);
      const to = target.clone().multiplyScalar(scale * 0.6);
      const control = new THREE.Vector3(
        (from.x + to.x) * 0.5,
        from.y + 0.3 * scale,
        0,
      );
      const curve = new THREE.QuadraticBezierCurve3(from, control, to);
      const points = curve.getPoints(30);
      return {
        points,
        color: i === 0 ? "#7c3aed" : i === 1 ? "#06b6d4" : "#9f7aea",
      };
    });
  }, [scale]);

  return (
    <>
      {/* Bezier path lines */}
      {bezierLines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={0.5}
          transparent
          opacity={0.25}
        />
      ))}

      {/* Agent shapes — each InstancedMesh with 1 instance */}
      <instancedMesh ref={tetraRef} args={[undefined, undefined, 1]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={AGENT_COLORS[0]}
          emissive={AGENT_COLORS[0]}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={boxRef} args={[undefined, undefined, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={AGENT_COLORS[1]}
          emissive={AGENT_COLORS[1]}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={octaRef} args={[undefined, undefined, 1]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={AGENT_COLORS[2]}
          emissive={AGENT_COLORS[2]}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  );
}
