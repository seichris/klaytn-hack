import React, { useRef, useEffect } from "react";
import * as THREE from 'three';
import { useLoader, useFrame } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Helicopter() {
  const helicopterRef = useRef();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  const gltf = useLoader(GLTFLoader, "/models/helicoptero.glb", loader => {
    loader.setDRACOLoader(dracoLoader);
  });

  // Circle parameters
  const circleRadius = 20;
  const circleCenter = new THREE.Vector3(0, 5, 0);
  let angle = 0;

  useFrame(() => {
    // Slow down the movement by reducing the angle increment
    angle += 0.01 / 3;

    // Update position
    helicopterRef.current.position.x = circleCenter.x + circleRadius * Math.cos(angle);
    helicopterRef.current.position.z = circleCenter.z + circleRadius * Math.sin(angle);

    // Update rotation to face the forward direction
    // Adjust the offset based on the model's forward direction
    helicopterRef.current.rotation.y = -angle;

    // Update rotor rotation
    const helice = gltf.scene.getObjectByName("Helice");
    if (helice) {
      helice.rotation.y += 0.5;
    }
  });

  return (
    <group
      ref={helicopterRef}
      position={[circleCenter.x + circleRadius, circleCenter.y, circleCenter.z]}
      rotation={[0, 0, 0]} // Initially facing the direction of movement
    >
      <primitive object={gltf.scene} dispose={null} scale={1} />
    </group>
  );
}

export default Helicopter;
