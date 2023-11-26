import React, { useRef, Suspense, useState, useEffect } from "react";
import * as dat from 'dat.gui';
import { Canvas } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Sky, Cloud } from "@react-three/drei";
import { Model } from "./threejs/Isometric-cityscape13";
import { ControlPanel } from "./Panel";
import Loader from "./Loader";
// import { MeshBasicMaterial, SphereGeometry, Mesh } from 'three';
import { Environment } from "@react-three/drei";

function Scene() {
  const [buttonText, setButtonText] = useState(null);
  const modelRef = useRef();
  const sunLightRef = useRef();
  const sunVisualRef = useRef();
  const [lightsOn, setLightsOn] = useState(true);
  const [ferrisWheelSpeed, setFerrisWheelSpeed] = useState(0.007);
  const [windFanSpeed, setWindFanSpeed] = useState(0.1);

  const stopFerrisWheel = () => {
    const duration = 5; // Duration in seconds for the wheel to stop
    const frameRate = 60; // Assuming 60 frames per second
    let framesCount = duration * frameRate;
    let initialSpeed = ferrisWheelSpeed;
  
    const interval = setInterval(() => {
      setFerrisWheelSpeed((prevSpeed) => {
        framesCount--;
        if (framesCount <= 0 || prevSpeed <= 0) {
          clearInterval(interval);
          return 0;
        }
        // Linearly decrease the speed
        return initialSpeed * (framesCount / (duration * frameRate));
      });
    }, 1000 / frameRate); // Update speed every frame
  };

  const stopWindFans = () => {
    const duration = 5; // Duration in seconds for the fans to stop
    const frameRate = 60; // Assuming 60 frames per second
    let framesCount = duration * frameRate;
    let initialSpeed = windFanSpeed;
  
    const interval = setInterval(() => {
      setWindFanSpeed((prevSpeed) => {
        framesCount--;
        if (framesCount <= 0 || prevSpeed <= 0) {
          clearInterval(interval);
          return 0;
        }
        return initialSpeed * (framesCount / (duration * frameRate));
      });
    }, 1000 / frameRate); // Update speed every frame
  };  

  const toggleLights = () => {
    if (lightsOn) {
      stopFerrisWheel();
      stopWindFans(); // Add this line
    } else {
      setFerrisWheelSpeed(0.03);
      setWindFanSpeed(0.1); // Reset wind fan speed
    }
    setLightsOn(!lightsOn);
  };

  const toggleEnergy = (energyStatus) => {
    if (energyStatus) {
      // Starting energy production
      setWindFanSpeed(0.1);
    } else {
      // Stopping energy production
      stopWindFans();
    }
  };
  

  // useEffect(() => {
  //   // Synchronize the position of the visual sun with the directional light
  //   if (sunVisualRef.current && sunLightRef.current) {
  //     sunVisualRef.current.position.copy(sunLightRef.current.position);
  //   }
  // }, []);

  // const skySettings = {
  //   distance: 450000,
  //   inclination: 0.49, // Adjust for time of day, affects sky color
  //   azimuth: 0.25, // Adjust for sun position
  //   turbidity: 3, // Affects the intensity of the sky color
  //   rayleigh: 2, // Determines the amount and color of scattered light
  //   mieCoefficient: 0.005, // Affects the concentration of haze particles
  //   mieDirectionalG: 0.8 // Affects the directionality of haze scattering
  // };

  const [skySettings, setSkySettings] = useState({
    inclination: 0.5,
    azimuth: 0.44,
    turbidity: 5.5,
    rayleigh: 4.9,
    mieCoefficient: 0.0124,
    mieDirectionalG: 0.38,
    lightIntensity: 6.3,
  });

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.add(sunLightRef.current);
    }
  }, []);

  // useEffect(() => {
  //   const gui = new dat.GUI();
  //   gui.add(skySettings, 'inclination', 0, 1).onChange(value => setSkySettings(s => ({ ...s, inclination: value })));
  //   gui.add(skySettings, 'azimuth', 0, 1).onChange(value => setSkySettings(s => ({ ...s, azimuth: value })));
  //   gui.add(skySettings, 'turbidity', 0, 20).onChange(value => setSkySettings(s => ({ ...s, turbidity: value })));
  //   gui.add(skySettings, 'rayleigh', 0, 10).onChange(value => setSkySettings(s => ({ ...s, rayleigh: value })));
  //   gui.add(skySettings, 'mieCoefficient', 0, 0.1).onChange(value => setSkySettings(s => ({ ...s, mieCoefficient: value })));
  //   gui.add(skySettings, 'mieDirectionalG', 0, 1).onChange(value => setSkySettings(s => ({ ...s, mieDirectionalG: value })));
  //   gui.add(skySettings, 'lightIntensity', 0, 10).onChange(value => setSkySettings(s => ({ ...s, lightIntensity: value })));

  //   return () => gui.destroy();
  // }, []);
  
  return (
    <div className='relative w-screen h-screen'>
      <Canvas>
        {/* <group ref={modelRef}> */}
          <Sky
            distance={skySettings.distance}
            // sunPosition={[-0.1, 0, 10]}
            // sunPosition={[-0.1, -0.1, 10]}
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
            lightsOn={lightsOn}
            ferrisWheelSpeed={ferrisWheelSpeed}
            windFanSpeed={windFanSpeed}
          />
        </Suspense>
      </Canvas>
      {buttonText && (
        <div className='bg-white px-7 rounded-3xl flex py-2 justify-center text-black absolute bottom-10 left-[50%] translate-x-[-50%]'>
          <span className='text-xl uppercase font-semibold'>{buttonText}</span>
        </div>
      )}
      <ControlPanel onToggleLights={toggleLights} onToggleEnergy={toggleEnergy} />
    </div>
  );
}

export default Scene;
