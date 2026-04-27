"use client";

import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { Vector2 } from "three";

const ABERRATION_OFFSET = new Vector2(0.0008, 0.0008);

export function BrainPostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.7} luminanceThreshold={0.4} luminanceSmoothing={0.9} />
      <ChromaticAberration offset={ABERRATION_OFFSET} />
    </EffectComposer>
  );
}
