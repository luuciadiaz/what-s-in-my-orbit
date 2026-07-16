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
import { useIntroPhase } from "@/state/introStore";
import { duration as DUR, easing } from "@/config/motion";

const HOME_POS = new THREE.Vector3(0, 6, 30);
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const EASE = `cubic-bezier(${easing.gravity.join(",")})`;

const CONFIG = Object.fromEntries(PLANETS.map((p) => [p.slug, p]));
const UP = new THREE.Vector3(0, 1, 0);

/**
 * Compute a cinematic shot for a world: where the camera flies to (`approach`)
 * and where it looks (`look`). The look point is nudged so the planet settles
 * into the right third of frame — editorial rule-of-thirds — leaving clean space
 * on the left for the revealed text.
 */
function framingFor(slug: string, from: THREE.Vector3) {
  const obj = getPlanetObject(slug);
  const cfg = CONFIG[slug];
  if (!obj || !cfg) return null;

  const p = obj.getWorldPosition(new THREE.Vector3());
  const effR = cfg.isCenter ? cfg.radius * 2 : cfg.radius;
  const dist = Math.max(effR * 2.7, 4.2);
  const dir = new THREE.Vector3().subVectors(from, p).normalize();
  const approach = new THREE.Vector3().copy(p).addScaledVector(dir, dist);

  // Shift the look point so the world drifts to screen-right and rises a touch.
  const viewDir = new THREE.Vector3().subVectors(p, approach).normalize();
  const right = new THREE.Vector3().crossVectors(viewDir, UP).normalize();
  const look = new THREE.Vector3()
    .copy(p)
    .addScaledVector(right, -effR * 0.8)
    .addScaledVector(UP, -effR * 0.28);

  return { approach, look };
}

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
  const introPhase = useIntroPhase();
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!controls) return;
    // The intro camera owns the camera until the curtain is fully open.
    if (introPhase !== "open") return;
    tl.current?.kill();

    const dur = reducedMotion ? DUR.fast : DUR.cinematic;
    const target = new THREE.Vector3().copy(controls.target);
    const onUpdate = () => {
      camera.lookAt(target);
      controls.target.copy(target);
      invalidate();
    };

    if (phase === "entering" && activePlanet) {
      const shot = framingFor(activePlanet, camera.position);
      if (!shot) return;

      controls.enabled = false;
      controls.enableDamping = false;
      controls.autoRotate = false;

      tl.current = gsap
        .timeline({ onComplete: markArrived })
        .to(camera.position, { x: shot.approach.x, y: shot.approach.y, z: shot.approach.z, duration: dur, ease: EASE, onUpdate }, 0)
        .to(target, { x: shot.look.x, y: shot.look.y, z: shot.look.z, duration: dur, ease: EASE }, 0);
    } else if (phase === "active" && activePlanet) {
      // Re-engage controls on the framed look point (planet sits off-centre).
      const shot = framingFor(activePlanet, camera.position);
      if (shot) controls.target.copy(shot.look);
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
  }, [phase, activePlanet, controls, camera, invalidate, reducedMotion, introPhase]);

  return null;
}
