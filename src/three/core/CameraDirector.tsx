"use client";

/**
 * CameraDirector — the camera as the main character.
 *
 * Watches the atlas store and flies the camera cinematically into the selected
 * world and back out, driving a GSAP timeline over the camera position and the
 * orbit target together. During a flight the OrbitControls are handed off (their
 * damping/auto-rotate disabled so they don't fight the tween); on arrival they
 * are re-engaged focused on the world, so the visitor can still look around it.
 *
 * Under reduced motion the flight collapses to a brief, calm cross-move.
 */
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { PLANETS } from "@/config/planets";
import { useAtlas, getPlanetObject, markArrived, markReturned } from "@/state/atlasStore";
import { duration as DUR, easing } from "@/config/motion";

const HOME_POS = new THREE.Vector3(0, 6, 30);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const EASE = `cubic-bezier(${easing.gravity.join(",")})`;

const CONFIG = Object.fromEntries(PLANETS.map((p) => [p.slug, p]));

interface DirectorProps {
  reducedMotion: boolean;
}

export function CameraDirector({ reducedMotion }: DirectorProps) {
  const camera = useThree((s) => s.camera);
  // OrbitControls registers itself here via makeDefault.
  const controls = useThree((s) => s.controls) as
    | (THREE.EventDispatcher & {
        target: THREE.Vector3;
        enabled: boolean;
        enableDamping: boolean;
        autoRotate: boolean;
        update: () => void;
      })
    | null;
  const invalidate = useThree((s) => s.invalidate);
  const { phase, activePlanet } = useAtlas();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!controls) return;
    tl.current?.kill();

    const dur = reducedMotion ? DUR.fast : DUR.cinematic;
    const target = new THREE.Vector3().copy(controls.target);
    const onUpdate = () => {
      camera.lookAt(target);
      controls.target.copy(target);
      invalidate();
    };

    if (phase === "entering" && activePlanet) {
      const obj = getPlanetObject(activePlanet);
      const cfg = CONFIG[activePlanet];
      if (!obj || !cfg) return;

      const p = obj.getWorldPosition(new THREE.Vector3());
      const effR = cfg.isCenter ? cfg.radius * 2 : cfg.radius;
      const dist = Math.max(effR * 3.0, 4.5);
      const dir = new THREE.Vector3().subVectors(camera.position, p).normalize();
      const approach = new THREE.Vector3().copy(p).addScaledVector(dir, dist);
      approach.y += effR * 0.4; // a touch of elevation for framing

      controls.enabled = false;
      controls.enableDamping = false;
      controls.autoRotate = false;

      tl.current = gsap
        .timeline({ onComplete: markArrived })
        .to(camera.position, { x: approach.x, y: approach.y, z: approach.z, duration: dur, ease: EASE, onUpdate }, 0)
        .to(target, { x: p.x, y: p.y, z: p.z, duration: dur, ease: EASE }, 0);
    } else if (phase === "active" && activePlanet) {
      // Re-engage controls focused on the arrived world.
      const obj = getPlanetObject(activePlanet);
      if (obj) controls.target.copy(obj.getWorldPosition(new THREE.Vector3()));
      controls.enabled = true;
      controls.enableDamping = true;
      controls.autoRotate = false;
      controls.update();
    } else if (phase === "leaving") {
      controls.enabled = false;
      controls.enableDamping = false;
      controls.autoRotate = false;

      tl.current = gsap
        .timeline({ onComplete: markReturned })
        .to(camera.position, { x: HOME_POS.x, y: HOME_POS.y, z: HOME_POS.z, duration: dur, ease: EASE, onUpdate }, 0)
        .to(target, { x: HOME_TARGET.x, y: HOME_TARGET.y, z: HOME_TARGET.z, duration: dur, ease: EASE }, 0);
    } else if (phase === "idle") {
      // Restore free exploration.
      controls.target.copy(HOME_TARGET);
      controls.enabled = true;
      controls.enableDamping = true;
      controls.autoRotate = !reducedMotion;
      controls.update();
    }

    return () => {
      tl.current?.kill();
    };
  }, [phase, activePlanet, controls, camera, invalidate, reducedMotion]);

  return null;
}
