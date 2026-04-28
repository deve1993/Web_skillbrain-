"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef, useCallback, useEffect } from "react";
import * as THREE from "three";
import { type GraphNodeData, type GraphEdge, TYPE_META, getConnectedIds } from "./graph-data";

/* ── Label texture ── */

function roundRectPath(
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

function makeLabelTexture(text: string): THREE.CanvasTexture {
  const R = 3; // render at 3× for crisp retina quality
  const W = 128, H = 30;
  const canvas = document.createElement("canvas");
  canvas.width = W * R;
  canvas.height = H * R;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(R, R);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "rgba(10,10,18,0.90)";
  roundRectPath(ctx, 1, 1, W - 2, H - 2, 5);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  roundRectPath(ctx, 1, 1, W - 2, H - 2, 5);
  ctx.stroke();
  ctx.fillStyle = "#eeeef8";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const label = text.length > 15 ? text.slice(0, 14) + "…" : text;
  ctx.fillText(label, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

/* ── Edges ── */

function GraphEdges({
  nodes, edges, connectedIds, hasActive,
}: {
  nodes: GraphNodeData[];
  edges: GraphEdge[];
  connectedIds: Set<number>;
  hasActive: boolean;
}) {
  const { brightGeo, dimGeo } = useMemo(() => {
    const bright: number[] = [];
    const dim: number[] = [];
    edges.forEach(({ from, to }) => {
      const a = nodes[from].pos;
      const b = nodes[to].pos;
      const pts = [a[0], a[1], a[2], b[0], b[1], b[2]];
      if (!hasActive || (connectedIds.has(from) && connectedIds.has(to))) {
        bright.push(...pts);
      } else {
        dim.push(...pts);
      }
    });
    const makeGeo = (arr: number[]) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      return geo;
    };
    return { brightGeo: makeGeo(bright), dimGeo: makeGeo(dim) };
  }, [nodes, edges, connectedIds, hasActive]);

  return (
    <>
      <lineSegments geometry={brightGeo}>
        <lineBasicMaterial
          color={hasActive ? "#22d3ee" : "#7c3aed"}
          transparent
          opacity={hasActive ? 0.6 : 0.25}
          depthWrite={false}
        />
      </lineSegments>
      {hasActive && (
        <lineSegments geometry={dimGeo}>
          <lineBasicMaterial color="#7c3aed" transparent opacity={0.06} depthWrite={false} />
        </lineSegments>
      )}
    </>
  );
}

/* ── Scene — single useFrame, no Html ── */

function GraphScene({
  nodes, edges, hoveredId, selectedId, onHover, onSelect,
}: {
  nodes: GraphNodeData[];
  edges: GraphEdge[];
  hoveredId: number | null;
  selectedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const labelsGroupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { viewport, invalidate } = useThree();

  const activeId = selectedId ?? hoveredId;
  const connectedIds = useMemo(
    () => (activeId !== null ? getConnectedIds(activeId, edges) : new Set<number>()),
    [activeId, edges],
  );
  const hasActive = activeId !== null;

  // One material per node — pre-built, no per-frame allocation
  const materials = useMemo(
    () =>
      nodes.map(
        (node) =>
          new THREE.MeshStandardMaterial({
            color: TYPE_META[node.type].color,
            emissive: TYPE_META[node.type].color,
            emissiveIntensity: 0.5,
            roughness: 0.35,
            metalness: 0.3,
            transparent: true,
            opacity: 1,
          }),
      ),
    [nodes],
  );

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  // Sprite labels — canvas textures, zero DOM overhead
  const sprites = useMemo(
    () =>
      nodes.map((node) => {
        const tex = makeLabelTexture(node.name);
        const mat = new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
          sizeAttenuation: true,
        });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(1.6, 0.36, 1);
        sprite.position.set(
          node.pos[0],
          node.pos[1] + node.size * 1.9 + 0.12,
          node.pos[2],
        );
        return sprite;
      }),
    [nodes],
  );

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

  // Kick off render when switching back to auto-rotate
  useEffect(() => {
    if (!hasActive) invalidate();
  }, [hasActive, invalidate]);

  const scaleFactor = Math.min(1, viewport.width / 9);

  const handleClick = useCallback(
    (id: number) => onSelect(selectedId === id ? null : id),
    [selectedId, onSelect],
  );

  // ── Single useFrame for everything ──
  useFrame((_, dt) => {
    if (!groupRef.current) return;

    // Auto-rotation — calls invalidate() to sustain loop in demand mode
    if (!hasActive) {
      groupRef.current.rotation.y += dt * 0.1;
      invalidate();
    }

    nodes.forEach((node, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      const isSelected = selectedId === node.id;
      const isConn = hasActive && connectedIds.has(node.id);
      const isDimmed = hasActive && !connectedIds.has(node.id);

      // Scale lerp
      const target = (isSelected ? 1.3 : isConn ? 1.15 : isDimmed ? 0.85 : 1) * node.size;
      mesh.scale.x += (target - mesh.scale.x) * 0.12;
      mesh.scale.y += (target - mesh.scale.y) * 0.12;
      mesh.scale.z += (target - mesh.scale.z) * 0.12;

      // Material lerp
      const mat = materials[i];
      mat.opacity += ((isDimmed ? 0.3 : 1) - mat.opacity) * 0.1;
      const targetEmissive = isSelected ? 1.2 : isConn ? 0.8 : isDimmed ? 0.15 : 0.5;
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;

      // Label sprite opacity
      const showLabel = node.type !== "function" || isConn || isSelected;
      const targetLabelOpacity = showLabel ? (isDimmed ? 0.15 : 1) : 0;
      const spriteMat = sprites[i].material as THREE.SpriteMaterial;
      spriteMat.opacity += (targetLabelOpacity - spriteMat.opacity) * 0.12;
    });
  });

  return (
    <group ref={groupRef} scale={scaleFactor}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#7c3aed" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#06b6d4" />

      <GraphEdges nodes={nodes} edges={edges} connectedIds={connectedIds} hasActive={hasActive} />

      {nodes.map((node, i) => (
        <mesh
          key={node.id}
          ref={(m) => { meshRefs.current[i] = m; }}
          position={node.pos}
          scale={node.size}
          material={materials[i]}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            onHover(node.id);
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
            onHover(null);
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleClick(node.id);
          }}
        >
          <sphereGeometry args={[1, 11, 11]} />
        </mesh>
      ))}

      {/* Selection ring */}
      {selectedId !== null && nodes[selectedId] && (
        <mesh position={nodes[selectedId].pos} scale={nodes[selectedId].size * 1.8}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial
            color={TYPE_META[nodes[selectedId].type].color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      <group ref={labelsGroupRef} />
    </group>
  );
}

/* ── Canvas — demand rendering, lower DPR ── */

export function CodebaseGraph3D(props: {
  nodes: GraphNodeData[];
  edges: GraphEdge[];
  hoveredId: number | null;
  selectedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      frameloop="demand"
      onPointerMissed={() => props.onSelect(null)}
    >
      <GraphScene {...props} />
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
