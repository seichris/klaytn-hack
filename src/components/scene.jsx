import React, { useRef, Suspense, useState, useEffect } from "react";
import * as dat from "dat.gui";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import { Sky, Cloud } from "@react-three/drei";
import { Model } from "./threejs/Isometric-cityscape13";
import { ControlPanel } from "./Panel";
import Loader from "./Loader";
import { useAccount } from 'wagmi';
// import { MeshBasicMaterial, SphereGeometry, Mesh } from 'three';
import { Environment } from "@react-three/drei";

function Scene() {
  const [buttonText, setButtonText] = useState(null);
  const { isConnected } = useAccount();
  const modelRef = useRef();
  const sunLightRef = useRef();
  const sunVisualRef = useRef();
  // const [lightsOn, setLightsOn] = useState(true);
  const [ferrisWheelSpeed, setFerrisWheelSpeed] = useState(0.007);
  const [windFanSpeed, setWindFanSpeed] = useState(0.1);
  const [isEnergyOn, setIsEnergyOn] = useState(true);
  const [areLightsOn, setAreLightsOn] = useState(true);
  const [isStoppingFerrisWheel, setIsStoppingFerrisWheel] = useState(false);
  const [isStoppingWindFans, setIsStoppingWindFans] = useState(false);
  const [windfarm, setWindfarm] = useState({ coins: 100.00, energyTokens: "∞" });
  const [city, setCity] = useState({ coins: 1000.00, energyTokens: 100.00 });
  // "∞"
  const decimalUpdateInterval = 1000; // 1 second for decimal updates
  const fullUpdateInterval = 5000; // 5 seconds for full unit updates

  // const updateDecimals = () => {
  //   if (isEnergyOn) {
  //     setCity(prevCity => ({
  //       ...prevCity,
  //       coins: parseFloat((prevCity.coins - 0.2).toFixed(2))
  //     }));
  //     setWindfarm(prevWindfarm => ({
  //       ...prevWindfarm,
  //       coins: parseFloat((prevWindfarm.coins + 0.2).toFixed(2))
  //     }));
  //   }
  // };
  const updateDecimals = () => {
    setCity(prevCity => {
      let newCoins = prevCity.coins;
      let newEnergyTokens = prevCity.energyTokens;
  
      if (isEnergyOn) {
        newCoins -= 0.2; // Decrease coins by a decimal value if energy is on
        if (!areLightsOn) {
          newEnergyTokens += 0.2; // Increase energy tokens by a decimal if energy is on and lights are off
        }
      } else if (areLightsOn) {
        newEnergyTokens -= 0.2; // Decrease energy tokens by a decimal if only lights are on
      }
  
      return {
        coins: parseFloat(newCoins.toFixed(2)),
        energyTokens: parseFloat(newEnergyTokens.toFixed(2))
      };
    });
  
    if (isEnergyOn) {
      setWindfarm(prevWindfarm => ({
        ...prevWindfarm,
        coins: parseFloat((prevWindfarm.coins + 0.2).toFixed(2)) // Increase windfarm coins by a decimal if energy is on
      }));
    }
  };
  
  
  const updateFullUnit = () => {
    setCity(prevCity => {
      let newCoins = parseFloat((prevCity.coins - 1).toFixed(2));
      let newEnergyTokens = prevCity.energyTokens;
  
      if (isEnergyOn) {
        newCoins -= 1; // Decrease coins if energy is on
        if (!areLightsOn) {
          newEnergyTokens += 1; // Increase energy tokens if energy is on and lights are off
        }
      } else if (areLightsOn) {
        newEnergyTokens -= 1; // Decrease energy tokens if only lights are on
      }
  
      return {
        coins: parseFloat(newCoins.toFixed(2)),
        energyTokens: parseFloat(newEnergyTokens.toFixed(2))
      };
    });
  
    if (isEnergyOn) {
      setWindfarm(prevWindfarm => ({
        ...prevWindfarm,
        coins: parseFloat((prevWindfarm.coins + 1).toFixed(2)) // Increase windfarm coins if energy is on
      }));
    }
  };
  
  useEffect(() => {
    const decimalInterval = setInterval(updateDecimals, decimalUpdateInterval);
    return () => clearInterval(decimalInterval);
  }, [isEnergyOn, areLightsOn]);
  
  
  useEffect(() => {
    const fullUnitInterval = setInterval(updateFullUnit, fullUpdateInterval);
  
    return () => clearInterval(fullUnitInterval);
  }, [isEnergyOn, areLightsOn]);

  const stopFerrisWheel = () => {
    setIsStoppingFerrisWheel(true);
    const duration = 3; // Duration in seconds for the wheel to stop
    const frameRate = 60; // Assuming 60 frames per second
    let framesCount = duration * frameRate;
    let initialSpeed = ferrisWheelSpeed;

    const interval = setInterval(() => {
      setFerrisWheelSpeed((prevSpeed) => {
        framesCount--;
        if (framesCount <= 0 || prevSpeed <= 0) {
          clearInterval(interval);
          setIsStoppingFerrisWheel(false);
          return 0;
        }
        // Linearly decrease the speed
        return initialSpeed * (framesCount / (duration * frameRate));
      });
    }, 1000 / frameRate); // Update speed every frame
  };

  const stopWindFans = () => {
    setIsStoppingWindFans(true);
    const duration = 3; // Duration in seconds for the fans to stop
    const frameRate = 60; // Assuming 60 frames per second
    let framesCount = duration * frameRate;
    let initialSpeed = windFanSpeed;

    const interval = setInterval(() => {
      setWindFanSpeed((prevSpeed) => {
        framesCount--;
        if (framesCount <= 0 || prevSpeed <= 0) {
          clearInterval(interval);
          setIsStoppingWindFans(false);
          return 0;
        }
        return initialSpeed * (framesCount / (duration * frameRate));
      });
    }, 1000 / frameRate); // Update speed every frame
  };

  const toggleEnergy = () => {
    setIsEnergyOn(!isEnergyOn);
    if (!isEnergyOn) {
      setWindFanSpeed(0.1); // Start wind fans
    } else {
      stopWindFans(); // Stop wind fans
    }
  };

  const toggleLights = () => {
    setAreLightsOn(!areLightsOn);
    if (!areLightsOn) {
      setFerrisWheelSpeed(0.007); // Start Ferris wheel
    } else {
      stopFerrisWheel(); // Stop Ferris wheel
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

  const fundCity = () => {
    setCity(prevCity => ({
      ...prevCity,
      coins: prevCity.coins + 10
    }));
  };

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
    <div className="relative w-screen h-screen">
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
        <fog attach="fog" args={["#fff", 1, 90]} />
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
            lightsOn={areLightsOn}
            ferrisWheelSpeed={ferrisWheelSpeed}
            windFanSpeed={windFanSpeed}
          />
        </Suspense>
      </Canvas>
      {buttonText && (
        <div className="bg-white px-7 rounded-3xl flex py-2 justify-center text-black absolute bottom-10 left-[50%] translate-x-[-50%]">
          <span className="text-xl uppercase font-semibold">{buttonText}</span>
        </div>
      )}
      <ControlPanel
        onToggleLights={toggleLights}
        onToggleEnergy={toggleEnergy}
        isEnergyStopping={isStoppingWindFans}
        isLightsStopping={isStoppingFerrisWheel}
        isEnergyOn={isEnergyOn}
        areLightsOn={areLightsOn}
        windfarm={windfarm}
        city={city}
        isConnected={isConnected}
        setCity={setCity}
      />
    </div>
  );
}

export default Scene;
