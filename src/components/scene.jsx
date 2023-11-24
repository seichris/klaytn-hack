import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Cloud } from "@react-three/drei";
import { Model } from "./threejs/Isometric-cityscape13";
import Loader from "./Loader";
import { Environment } from "@react-three/drei";

function Scene() {
  const [buttonText, setButtonText] = useState(null);
  const skySettings = {
    distance: 450000,
    inclination: 0, // Adjust for time of day, affects sky color
    azimuth: 0.25, // Adjust for sun position
    turbidity: 0.5, // Affects the intensity of the sky color
    rayleigh: 3, // Determines the amount and color of scattered light
    mieCoefficient: 0.005, // Affects the concentration of haze particles
    mieDirectionalG: 0.8 // Affects the directionality of haze scattering
  };

  return (
    <div className='relative w-screen h-screen'>
      <Canvas>
        <Sky
          distance={skySettings.distance}
          sunPosition={[0, 1, 0]}
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
        <fog attach='fog' args={["#fff", 0, 110]} />
        {/* <Environment preset='forest' />  */}
        <ambientLight color={0xe8c37b} intensity={2} />
        <directionalLight
          position={[-10, 10, 10]}
          intensity={6}
          color={0xec8f5e}
        />
        <directionalLight
          color={0xec8f5e}
          position={[-69, 24, 14]}
          intensity={5}
        />
        <Suspense fallback={<Loader />}>
          <Model setButtonText={setButtonText} />
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
