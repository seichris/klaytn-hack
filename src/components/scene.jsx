import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Model } from "./threejs/Isometric-cityscape13";
import Loader from "./Loader";

function Scene() {
  const [buttonText, setButtonText] = useState(null);
  return (
    <div className=' relative w-screen h-screen'>
      <Canvas>
        <fog attach='fog' args={["#fff", 0, 110]} />
        <Environment preset='forest' />
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
        <div className='bg-white px-7 rounded-3xl flex py-2 justify-center text-black absolute bottom-10 left-[50%] translate-x-[-50%] '>
          <span className='text-xl uppercase font-semibold'>{buttonText}</span>
        </div>
      )}
    </div>
  );
}

export default Scene;
