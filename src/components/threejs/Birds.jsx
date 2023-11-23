import React, { useRef, useEffect } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

function Birds() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
  const gltf = useLoader(GLTFLoader, "/models/bird.glb", (loader) => {
    loader.setDRACOLoader(dracoLoader);
  });
  const birdsRef = useRef();
  const animateBirds = () => {
    if (!birdsRef.current) return;
    //change position and rotation of birds
    gsap.to(birdsRef.current.position, {
      duration: 20,
      x: -55,
      y: 15.999999999999972,
      z: 55.30000000000003,
      onComplete: () => {
        // Reset the position of the birds
        gsap.set(birdsRef.current?.position, {
          x: 0,
          y: 15.999999999999972,
          z: 25.30000000000003,
        });
        // Restart the animation
        animateBirds();
      },
    });
  };

  useEffect(() => {
    if (birdsRef.current) {
      animateBirds();
    }
  }, []);

  return (
    <group
      ref={birdsRef}
      position={[0, 15.999999999999972, 25.30000000000003]}
      rotation={[0, 5, 0]}
    >
      <primitive object={gltf.scene} dispose={null} scale={0.1} />
    </group>
  );
}

export default Birds;
