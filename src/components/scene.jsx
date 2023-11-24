import React, { useRef, Suspense, useState, useEffect } from "react";
import * as dat from 'dat.gui';
import { Canvas } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Sky, Cloud } from "@react-three/drei";
import { Model } from "./threejs/Isometric-cityscape13";
import Loader from "./Loader";
// import { MeshBasicMaterial, SphereGeometry, Mesh } from 'three';
import { Environment } from "@react-three/drei";

function Scene() {
  const [buttonText, setButtonText] = useState(null);
  const modelRef = useRef();
  const sunLightRef = useRef();
  const sunVisualRef = useRef();

  // useEffect(() => {
  //   // Synchronize the position of the visual sun with the directional light
  //   if (sunVisualRef.current && sunLightRef.current) {
  //     sunVisualRef.current.position.copy(sunLightRef.current.position);
  //   }
  // }, []);

  const skySettings = {
    distance: 450000,
    inclination: 0.49, // Adjust for time of day, affects sky color
    azimuth: 0.25, // Adjust for sun position
    turbidity: 3, // Affects the intensity of the sky color
    rayleigh: 2, // Determines the amount and color of scattered light
    mieCoefficient: 0.005, // Affects the concentration of haze particles
    mieDirectionalG: 0.8 // Affects the directionality of haze scattering
  };

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.add(sunLightRef.current);
    }
  }, []);

  useEffect(() => {
    const gui = new dat.GUI();
    const sceneOptions = {
      // Existing options
      rotationSpeed: 0.01,
      // Sky settings
      inclination: skySettings.inclination,
      azimuth: skySettings.azimuth,
      turbidity: skySettings.turbidity,
      // Light properties
      lightIntensity: 6,
      // Fog properties
      fogNear: 1,
      fogFar: 90,
      // Depth of Field
      focalLength: 0.03,
      bokehScale: 8,
    };
  
    gui.add(sceneOptions, 'rotationSpeed', 0, 0.1);
    gui.add(sceneOptions, 'inclination', 0, 1).onChange(value => {
      skySettings.inclination = value;
    });
    gui.add(sceneOptions, 'azimuth', 0, 1);
    gui.add(sceneOptions, 'turbidity', 0, 20);
    gui.add(sceneOptions, 'lightIntensity', 0, 10);
    gui.add(sceneOptions, 'fogNear', 1, 100);
    gui.add(sceneOptions, 'fogFar', 10, 200);
    gui.add(sceneOptions, 'focalLength', 0.01, 0.1);
    gui.add(sceneOptions, 'bokehScale', 1, 10);
  
    // ... add more controls as needed
  
    return () => gui.destroy();
  }, []);

  return (
    <div className='relative w-screen h-screen'>
      <Canvas>
        {/* <group ref={modelRef}> */}
          <Sky
            distance={skySettings.distance}
            // sunPosition={[-0.1, 0, 10]}
            sunPosition={[-0.1, -0.1, 10]}
            // ref={sunLightRef}
            inclination={skySettings.inclination}
            azimuth={skySettings.azimuth}
            turbidity={skySettings.turbidity}
            rayleigh={skySettings.rayleigh}
            mieCoefficient={skySettings.mieCoefficient}
            mieDirectionalG={skySettings.mieDirectionalG}
          />
          {/* <Cloud
            position={[0, 2, 0]} // Adjust cloud position as needed
            speed={0.4} // Speed of cloud movement
            opacity={0.6} // Cloud opacity
            width={10} // Width of the cloud layer
            depth={1.5} // Depth of the cloud layer
            segments={20} // Number of segments in the cloud mesh
          /> */}
          <fog attach='fog' args={["#fff", 1, 90]} />
          {/* <Environment preset='forest' />  */}
          <ambientLight color={0xe8c37b} intensity={2} />
          <directionalLight
            ref={sunLightRef}
            position={[1, 0.6, 10]}
            intensity={6}
            color={0xec8f5e}
          />
          <directionalLight
            color={0xec8f5e}
            position={[-69, 24, 14]}
            intensity={5}
          />
          {/* <mesh ref={sunVisualRef} position={[1, 0.6, 10]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial color={0xffcc00} emissive={0xffcc00} />
          </mesh> */}
          <EffectComposer>
            <DepthOfField
              target={[0, 0, 0]} // Target focus point
              focalLength={0.03} // Focal length
              bokehScale={8} // Strength of the blur effect
              height={480} // Adjust based on your canvas size
            />
          </EffectComposer>
        {/* </group> */}
        <Suspense fallback={<Loader />}>
          <Model
            ref={modelRef}
            setButtonText={setButtonText}
          />
        </Suspense>
      </Canvas>
      {buttonText && (
        <div className='bg-white px-7 rounded-3xl flex py-2 justify-center text-black absolute bottom-10 left-[50%] translate-x-[-50%]'>
          <span className='text-xl uppercase font-semibold'>{buttonText}</span>
        </div>
      )}
    </div>
  );
}

export default Scene;
