"use client";

/**
 * Constellations — hand-drawn figures in gold leaf.
 *
 * A small set of composed clusters: seeded nodes joined by thin golden lines,
 * as though inked onto the chart. The lines breathe faintly in opacity (frozen
 * under reduced motion). Kept sparse — a few figures, never a web — so the sky
 * feels charted, not cluttered.
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SeededRandom, SEEDS } from "@/lib/seededRandom";
import { palette } from "@/config/colors";

interface ConstellationsProps {
  reducedMotion: boolean;
}

const CLUSTER_COUNT = 5;
const RADIUS = 55;

export function Constellations({ reducedMotion }: ConstellationsProps) {
  const lineMatRef = useRef<THREE.LineBasicMaterial>(null);

  const { lineGeometry, nodeGeometry } = useMemo(() => {
    const rng = new SeededRandom(SEEDS.constellations);
    const linePts: number[] = [];
    const nodePts: number[] = [];

    for (let c = 0; c < CLUSTER_COUNT; c++) {
      // A cluster centre placed on the background shell.
      const theta = rng.range(0, Math.PI * 2);
      const phi = rng.range(Math.PI * 0.25, Math.PI * 0.75);
      const cx = RADIUS * Math.sin(phi) * Math.cos(theta);
      const cy = RADIUS * Math.cos(phi);
      const cz = RADIUS * Math.sin(phi) * Math.sin(theta);

      const nodeCount = rng.int(4, 7);
      const nodes: THREE.Vector3[] = [];
      for (let n = 0; n < nodeCount; n++) {
        const v = new THREE.Vector3(
          cx + rng.signed(9),
          cy + rng.signed(9),
          cz + rng.signed(9),
        );
        nodes.push(v);
        nodePts.push(v.x, v.y, v.z);
      }
      // Connect as a path — one continuous drawn figure.
      for (let n = 0; n < nodes.length - 1; n++) {
        linePts.push(nodes[n].x, nodes[n].y, nodes[n].z);
        linePts.push(nodes[n + 1].x, nodes[n + 1].y, nodes[n + 1].z);
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePts, 3));
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodePts, 3));
    return { lineGeometry: lineGeo, nodeGeometry: nodeGeo };
  }, []);

  useFrame((state) => {
    if (reducedMotion || !lineMatRef.current) return;
    // Faint collective breathing of the ink.
    lineMatRef.current.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
  });

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          ref={lineMatRef}
          color={palette.gold}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={nodeGeometry}>
        <pointsMaterial
          color={palette.goldBright}
          size={0.6}
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
