import React, { useRef, useEffect } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

function Helicopter() {
  const helicopterRef = useRef();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  const gltf = useLoader(GLTFLoader, "/models/helicoptero.glb", (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });

  const animateHelicopter = () => {
    if (!helicopterRef.current) return;
    gsap.to(helicopterRef.current.position, {
      duration: 25,
      x: -25,
      y: 5.4,
      z: -0.6,
      onComplete: () => {
        // Reset the position of the helicopter
        gsap.set(helicopterRef.current?.position, {
          x: -8.2,
          y: 3.4,
          z: -6.6,
        });
        // Restart the animation
        animateHelicopter();
      },
    });
  };

  useEffect(() => {
    if (helicopterRef.current) {
      animateHelicopter();
    }
  }, []);

  const helice = gltf.scene.getObjectByName("Helice");
  useFrame(() => {
    helice.rotation.y += 0.5;
  });

  return (
    <group
      ref={helicopterRef}
      position={[-8.2, 3.4, -6.6]}
      rotation={[0, 5.5, 0]}
    >
      <primitive object={gltf.scene} dispose={null} scale={1} />
    </group>
  );
}

export default Helicopter;
