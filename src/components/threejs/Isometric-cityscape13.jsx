import React, { useRef, useEffect, useState, useMemo } from "react";
import { useGLTF, PresentationControls, Html } from "@react-three/drei";
import Car from "./Car";
import Helicopter from "./Helicopter";
import Birds from "./Birds";
// import Sun from './Sun';
import { gsap } from "gsap";

import { useFrame, useThree } from "@react-three/fiber";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import * as THREE from "three";

export function Model(props) {
  const { nodes, materials } = useGLTF("/models/isometric-cityscape13.glb");
  const [initalAnimationPlaying, setInitialAnimationPlaying] = useState(true);
  const { camera } = useThree();
  const buildingRef = useRef();
  const groupRef = useRef();
  const ferrisWheelRef = useRef();
  const windFanRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [controlsEnabled, setControlsEnabled] = useState(false);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const initialCameraPosition = { x: 5, y: 5.5, z: -15 };
  const [isInitialPosition, setIsInitialPosition] = useState(true);
  const windowMaterial = useMemo(
    () =>
      props.lightsOn ? materials.WindowLightBlue : materials.BlackoutWindow,
    [props.lightsOn]
  );

  // useEffect(() => {
  //   console.log("GLTF Nodes:", nodes);
  // }, [nodes]);

  useEffect(() => {
    // Create a sphere geometry for the sun
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    // Create a basic material with emissive color for the sun
    // const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00, emissive: 0xffcc00 });
    const sunMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00, // Bright yellow color
      emissive: 0xffff00, // Emissive color to make it glow
      emissiveIntensity: 1.5, // Increase emissive intensity
    });
    const spriteMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load("/path-to-glow-texture.png"),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const sunLight = new THREE.DirectionalLight(0xffffaa, 1);
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(10, 10, 1);
    const sunScale = 1.5;
    // Create the sun mesh
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.scale.set(sunScale, sunScale, sunScale);
    const spriteScale = sunScale * 5;
    sprite.scale.set(spriteScale, spriteScale, 1);
    // Set the relative position of the sun
    sunMesh.position.set(-50, 10, 40);
    // Add the sun to the model
    // nodes.groupRef.add(sunMesh); // Replace YourModelNodeName with the correct node name
    if (buildingRef.current) {
      buildingRef.current.add(sunMesh);
    }

    // Cleanup: remove the sun from the model when the component unmounts
    return () => {
      // nodes.groupRef.remove(sunMesh);
      if (buildingRef.current) {
        buildingRef.current.remove(sunMesh);
      }
      sunGeometry.dispose();
      sunMaterial.dispose();
    };
  }, [nodes]);

  const getMousePosition = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  // Function to return the camera to its original position
  const returnToOriginalPosition = () => {
    gsap.to(camera.position, {
      duration: 8, // Duration of the animation in seconds
      delay: 0.5, // Delay before the animation starts
      x: initialCameraPosition.x, // Returning to the initial x coordinate
      y: initialCameraPosition.y, // Returning to the initial y coordinate
      z: initialCameraPosition.z, // Returning to the initial z coordinate
      ease: TWEEN.Easing.Quartic.InOut, // Easing function for smoother motion

      onUpdate: () => {
        // Function to update the camera's focus on a specific position
        if (buildingRef.current) {
          camera.lookAt(...buildingRef.current.position);
        }
      },
      onComplete: () => {
        setIsInitialPosition(true); // Setting the state to indicate the initial position
        setControlsEnabled(true); // Enabling controls for user interaction
      },
    });
  };

  // Function handling mouse down events
  const handleMouseDown = (e) => {
    getMousePosition(e); // Getting the mouse position
    raycaster.setFromCamera(mouse, camera); // Setting the raycaster position

    // Intersecting objects with the raycaster
    const intersects = raycaster.intersectObjects(
      groupRef.current.children,
      true
    );

    // If intersecting objects are found
    if (intersects.length > 0) {
      const name = intersects[0].object.parent.name; // Getting the name of the object
      const position = intersects[0].point; // Getting the position of the intersection

      // Handling the case when the object's name is "model"
      if (name === "model") {
        // If the camera is in the initial position, animate it to a new position
        if (isInitialPosition) {
          gsap.to(camera.position, {
            duration: 8, // Duration of the animation in seconds
            x: position.x + Math.PI * 2 - 1, // Setting the new x coordinate
            y: position.y + 1.5, // Setting the new y coordinate
            z: position.z, // Setting the new z coordinate
            delay: 0.5, // Delay before the animation starts
            ease: TWEEN.Easing.Quartic.InOut, // Easing function for smoother motion
            onStart: () => {
              setControlsEnabled(false); // Disabling controls for smoother animation
            },
            onUpdate: () => {
              if (buildingRef.current) {
                camera.lookAt(...buildingRef.current.position);
              } // Updating the camera's focus
            },
            onComplete: () => {
              setIsInitialPosition(false); // Setting the state to indicate a new position
              setControlsEnabled(true); // Enabling controls for user interaction
            },
          });
        } else {
          returnToOriginalPosition(); // If the camera is not in the initial position, return it to the original position
        }
      } else {
        returnToOriginalPosition(); // If the object's name is not "model," return the camera to the original position
      }
    }
  };

  // An effect that handles the animation of the camera's movement
  useEffect(() => {
    // If the group reference is not available or controls are already enabled, return
    if (!groupRef.current || controlsEnabled) return;

    // Using GSAP to animate the camera's position
    gsap.fromTo(
      camera.position, // Starting position of the camera
      {
        x: -25, // Initial x coordinate
        y: 4, // Initial y coordinate
        z: -15, // Initial z coordinate
      },
      {
        duration: 10, // Duration of the animation in seconds
        x: 5, // Final x coordinate
        y: 5.5, // Final y coordinate
        z: -15, // Final z coordinate
        delay: 1, // Delay before the animation starts
        ease: TWEEN.Easing.Quartic.InOut, // Easing function for smoother motion

        onUpdate: () => {
          // Function to update the camera's focus on a specific position
          camera.lookAt(...buildingRef.current.position);
        },
        onComplete: () => {
          // Action to perform once the animation is complete
          setControlsEnabled(true); // Enable controls for user interaction
          setInitialAnimationPlaying(false); // Update the state for the initial animation
        },
      }
    );
  }, [groupRef.current]); // Dependency array for the effect

  // A frame update function handling the rotation of specified references
  useFrame(() => {
    // Ferris wheel rotation
    if (ferrisWheelRef.current) {
      ferrisWheelRef.current.rotation.y += props.ferrisWheelSpeed;
    }

    // Wind fans rotation
    windFanRefs.forEach((ref) => {
      if (ref.current) {
        ref.current.rotation.z += props.windFanSpeed;
      }
    });
  });

  const handlePointerMove = (e) => {
    getMousePosition(e); // Getting the mouse position
    raycaster.setFromCamera(mouse, camera); // Setting the raycaster position

    // Intersecting objects with the raycaster
    const intersects = raycaster.intersectObjects(
      groupRef.current.children,
      true
    );

    // If intersecting objects are found
    if (intersects.length > 0) {
      const name = intersects[0].object.parent.name; // Getting the name of the object

      const objectName = intersects[0].object.name; // Getting the object name element

      // Handling the case when the object's name is "model"
      if (name === "model" || name === "cursor") {
        document.body.style.cursor = `url('/ring.png') 16 16, auto`;
        if (objectName === "building1") {
          props.setButtonText("Bank");
        } else if (objectName === "building2") {
          props.setButtonText("Klaytn HQ");
        } else if (objectName === "building3") {
          props.setButtonText("Government");
        } else {
          props.setButtonText(null);
        }
      } else {
        document.body.style.cursor = "grab";
        props.setButtonText(null);
      }
    }
  };

  return (
    <PresentationControls
      cursor={false}
      enabled={controlsEnabled}
      polar={[0, 0]}
    >
      <group
        {...props}
        ref={groupRef}
        dispose={null}
        onClick={(e) => {
          if (initalAnimationPlaying) return;
          if (!controlsEnabled) return;
          handleMouseDown(e);
        }}
        onPointerMove={(e) => {
          if (initalAnimationPlaying) return;
          if (!controlsEnabled) return;
          handlePointerMove(e);
        }}
      >
        {/* {sunVisual} */}
        <mesh
          geometry={nodes.Landskape_plane_Landscape_color_1_0002.geometry}
          material={materials["Landscape_color_1.001"]}
        />
        <mesh
          name="cursor"
          geometry={nodes.Landskape_plane_Landscape_color_1_0002_1.geometry}
          material={materials.StreetGrey}
        />
        <mesh
          name="cursor"
          geometry={nodes.Landskape_plane_Landscape_color_1_0002_2.geometry}
          material={materials["TreeGreen.005"]}
        />
        <mesh
          name="cursor"
          geometry={nodes.Landskape_plane_Landscape_color_1_0002_3.geometry}
          material={materials["TreeGreen.005"]}
        />
        <mesh
          geometry={nodes.Landskape_plane_Landscape_color_1_0001.geometry}
          material={materials.PineTrees}
        />
        <mesh
          geometry={nodes.Landskape_plane_Landscape_color_1_0001_1.geometry}
          material={materials["Material.004"]}
        />
        <mesh
          geometry={nodes.Landskape_plane_Landscape_color_1_0001_2.geometry}
          material={materials["TreeGreen.003"]}
        />
        <mesh
          geometry={nodes.wind2.geometry}
          material={materials.LightMetal}
          position={[16.27, 2.7, -13.83]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2001.geometry}
          material={materials.LightMetal}
          position={[23.93, 2.07, -22.8]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2002.geometry}
          material={materials.LightMetal}
          position={[-6.28, 5.29, -21.28]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2003.geometry}
          material={materials.LightMetal}
          position={[-14.24, 2.47, 23.59]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2004.geometry}
          material={materials.LightMetal}
          position={[3.75, 1.37, 25.82]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2005.geometry}
          material={materials.LightMetal}
          position={[24.98, 1.31, 16.74]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
        />
        <mesh
          geometry={nodes.wind2_head.geometry}
          material={materials.WindHead}
          position={[16.48, 4.65, -13.79]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[0]}
        />
        <mesh
          geometry={nodes.wind2_head001.geometry}
          material={materials.WindHead}
          position={[24.14, 4.03, -22.75]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[1]}
        />
        <mesh
          geometry={nodes.wind2_head002.geometry}
          material={materials.WindHead}
          position={[-6.07, 7.25, -21.24]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[2]}
        />
        <mesh
          geometry={nodes.wind2_head003.geometry}
          material={materials.WindHead}
          position={[-14.04, 4.43, 23.63]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[3]}
        />
        <mesh
          geometry={nodes.wind2_head004.geometry}
          material={materials.WindHead}
          position={[3.96, 3.32, 25.86]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[4]}
        />
        <mesh
          geometry={nodes.wind2_head005.geometry}
          material={materials.WindHead}
          position={[25.19, 3.27, 16.78]}
          rotation={[0, 1.37, 0]}
          scale={0.08}
          ref={windFanRefs[5]}
        />
        <mesh
          geometry={nodes.Cube002.geometry}
          material={materials.RedLight}
          position={[23.88, 4.12, -22.8]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />
        <mesh
          geometry={nodes.Cube003.geometry}
          material={materials.RedLight}
          position={[16.23, 4.74, -13.83]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />
        <mesh
          geometry={nodes.Cube004.geometry}
          material={materials.RedLight}
          position={[-6.32, 7.34, -21.29]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />
        <mesh
          geometry={nodes.Cube005.geometry}
          material={materials.RedLight}
          position={[-14.28, 4.52, 23.58]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />
        <mesh
          geometry={nodes.Cube006.geometry}
          material={materials.RedLight}
          position={[3.72, 3.41, 25.81]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />
        <Car />
        <Helicopter />
        <Birds />
        {/* <Sun /> */}

        <mesh
          geometry={nodes.Cube007.geometry}
          material={materials.RedLight}
          position={[24.94, 3.36, 16.73]}
          rotation={[0, -0.16, 0]}
          scale={0.05}
        />

        <group
          name="model"
          position={[0.4, 0.36, 0.53]}
          rotation={[0, Math.PI / 2, 0]}
          scale={0.65}
          ref={buildingRef}
        >
          <mesh
            geometry={nodes.CircleBuildBase003_1.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.CircleBuildBase003_2.geometry}
            material={windowMaterial}
          />
          <mesh
            geometry={nodes.CircleBuildBase003_3.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            geometry={nodes.CircleBuildBase003_4.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.CircleBuildBase003_5.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.CircleBuildBase003_6.geometry}
            material={windowMaterial}
          />
        </group>
        <group
          name="model"
          position={[3.7, 1.49, -3.29]}
          rotation={[Math.PI / 2, 1.57, 0]}
          scale={[-1, 0.15, 1]}
        >
          <mesh
            geometry={nodes.FerrisSupport_1.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            geometry={nodes.FerrisSupport_2.geometry}
            material={materials.RedLight}
          />
          <mesh
            geometry={nodes.FerrisSupport_3.geometry}
            material={materials.BlueMetal}
          />
          <group
            position={[0.99, 1.41, 0.39]}
            rotation={[0, 0, Math.PI / 2]}
            scale={[0.94, 0.14, 0.14]}
          >
            <mesh
              geometry={nodes.Cube037.geometry}
              material={materials.BuildingRed}
            />
            <mesh
              geometry={nodes.Cube037_1.geometry}
              material={materials.BuildingLightBlue}
            />
            <mesh
              geometry={nodes.Cube037_2.geometry}
              material={windowMaterial}
            />
          </group>
          <mesh
            geometry={nodes.Roda_Gigante.geometry}
            material={materials.LightMetal}
            position={[0, -1.56, 0]}
            scale={0.96}
            ref={ferrisWheelRef}
          />
        </group>
        <group position={[3.25, 0.36, 2.93]} scale={0.65} name="model">
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004_1.geometry}
            material={windowMaterial}
          />
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004_2.geometry}
            material={materials.BuildingOrange}
          />
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004_3.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004_4.geometry}
            material={materials.Metal}
          />
          <mesh
            name="building2"
            geometry={nodes.CircleBuildBase004_5.geometry}
            material={materials.LightOrange}
          />
          <group name="building2" position={[0, 1.54, 0]}>
            <mesh
              geometry={nodes.Circle017.geometry}
              material={materials.Metal}
            />
            <mesh
              geometry={nodes.Circle017_1.geometry}
              material={materials.DarkMetal}
            />
          </group>
        </group>
        <group
          name={"model"}
          position={[-2.81, 0.36, 4.19]}
          rotation={[0, Math.PI / 4, 0]}
          scale={0.65}
        >
          <mesh
            geometry={nodes.CircleBuildBase001_1.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_2.geometry}
            material={windowMaterial}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_3.geometry}
            material={materials.BuildingYellow}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_4.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_5.geometry}
            material={materials["SceneBl;ack"]}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_6.geometry}
            material={materials["TreeGreen.005"]}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_7.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.CircleBuildBase001_8.geometry}
            material={windowMaterial}
          />
        </group>
        <group name={"model"} position={[-1.86, 0.36, -0.54]} scale={0.54}>
          <mesh
            geometry={nodes.Cube040.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.Cube040_1.geometry}
            material={materials.LightOrange}
          />
          <mesh geometry={nodes.Cube040_2.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube040_3.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.Cube040_4.geometry}
            material={materials.BuildingOrange}
          />
          <mesh
            geometry={nodes.Cube040_5.geometry}
            material={materials.FanBiege}
          />
          <mesh
            geometry={nodes.Cube040_6.geometry}
            material={materials.BuildingLightBlue}
          />
          <mesh
            geometry={nodes.Cube040_7.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.Cube040_8.geometry}
            material={materials.DarkMetal}
          />
        </group>
        <group
          name="model"
          position={[2.91, 0.36, 0.55]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={0.54}
        >
          <mesh
            geometry={nodes.Cube043.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh geometry={nodes.Cube043_1.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube043_2.geometry}
            material={materials.BuildingGreen}
          />
          <mesh
            geometry={nodes.Cube043_3.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.Cube043_4.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.Cube043_5.geometry}
            material={materials.FanBiege}
          />
          <mesh
            geometry={nodes.Cube043_6.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.Cube043_7.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            geometry={nodes.Cube043_8.geometry}
            material={materials.BuildingWhite}
          />
          <mesh
            geometry={nodes.Cube043_9.geometry}
            material={materials.BuildingRed}
          />
        </group>
        <group name="model" position={[-3.02, 0.36, 0.95]} scale={0.54}>
          <mesh
            geometry={nodes.Cube046.geometry}
            material={materials.OldBrick}
          />
          <mesh geometry={nodes.Cube046_1.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube046_2.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            geometry={nodes.Cube046_3.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.Cube046_4.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.Cube046_5.geometry}
            material={materials.FanBiege}
          />
          <mesh
            geometry={nodes.Cube046_6.geometry}
            material={materials.BuildingOrange}
          />
          <mesh
            geometry={nodes.Cube046_7.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.Cube046_8.geometry}
            material={materials.DarkMetal}
          />
        </group>
        <group name="model" position={[0.71, 0.36, 3.32]} scale={0.54}>
          <mesh
            geometry={nodes.Cube049.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.Cube049_1.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.Cube049_2.geometry}
            material={materials.BuildingLightBlue}
          />
          <mesh geometry={nodes.Cube049_3.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube049_4.geometry}
            material={materials.BuildingDarkBlue}
          />
          <mesh
            geometry={nodes.Cube049_5.geometry}
            material={materials.TreeBrown}
          />
          <mesh
            geometry={nodes.Cube049_6.geometry}
            material={materials.FanBiege}
          />
          <mesh
            geometry={nodes.Cube049_7.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            geometry={nodes.Cube049_8.geometry}
            material={materials.BuildingWhite}
          />
          <mesh
            geometry={nodes.Cube049_9.geometry}
            material={materials.BuildingRed}
          />
          <mesh
            geometry={nodes.Cube049_10.geometry}
            material={materials.Metal}
          />
        </group>
        <group position={[1.28, 0.36, -2.04]} scale={0.54} name="model">
          <mesh
            geometry={nodes.Cube052.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            geometry={nodes.Cube052_1.geometry}
            material={materials.LightOrange}
          />
          <mesh geometry={nodes.Cube052_2.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube052_3.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            geometry={nodes.Cube052_4.geometry}
            material={materials.BuildingLightBlue}
          />
          <mesh
            geometry={nodes.Cube052_5.geometry}
            material={materials.BuildingDarkBlue}
          />
          <mesh
            geometry={nodes.Cube052_6.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            geometry={nodes.Cube052_7.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.Cube052_8.geometry}
            material={materials.Air_conditioning}
          />
        </group>
        <group name="model" position={[4.3, 0.36, -1.67]} scale={0.54}>
          <mesh
            name="building3"
            geometry={nodes.Cube005_1.geometry}
            material={materials.SquareBlockMain}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_2.geometry}
            material={materials.LightOrange}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_3.geometry}
            material={windowMaterial}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_4.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_5.geometry}
            material={materials.BuildingRed}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_6.geometry}
            material={materials.OldBrick}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_7.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_8.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_9.geometry}
            material={materials.Metal}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_10.geometry}
            material={windowMaterial}
          />
          <mesh
            name="building3"
            geometry={nodes.Cube005_11.geometry}
            material={materials.BuildingWhite}
          />
        </group>
        <group position={[-0.36, 0.36, -3.56]} scale={0.65} name="model">
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_1.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_2.geometry}
            material={windowMaterial}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_3.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_4.geometry}
            material={materials.Metal}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_5.geometry}
            material={materials.BuildingRed}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_6.geometry}
            material={materials.BuildingWhite}
          />
          <mesh
            name="building1"
            geometry={nodes.CircleBuildBase002_7.geometry}
            material={materials.DarkMetal}
          />
        </group>
        <group position={[-2.39, 0.36, -3.05]} name="model">
          <mesh
            geometry={nodes.Cube038.geometry}
            material={materials.BuildingDarkBlue}
          />
          <mesh
            geometry={nodes.Cube038_1.geometry}
            material={materials.BlackoutWindow}
          />
          <mesh geometry={nodes.Cube038_2.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cube038_3.geometry}
            material={materials.BlackoutWindow}
          />
        </group>
        <group position={[-1.33, 1.25, 1.5]} name="model ">
          <mesh
            geometry={nodes.Cone003.geometry}
            material={materials.BuildingDarkBlue}
          />
          <mesh geometry={nodes.Cone003_1.geometry} material={windowMaterial} />
          <mesh
            geometry={nodes.Cone003_2.geometry}
            material={materials.DarkMetal}
          />
          <mesh
            geometry={nodes.Cone003_3.geometry}
            material={materials.Metal}
          />
          <mesh
            geometry={nodes.Cone003_4.geometry}
            material={materials.CircularBuildMain}
          />
          <mesh
            geometry={nodes.Cone003_5.geometry}
            material={materials.LightOrange}
          />
          <mesh
            geometry={nodes.Cone003_6.geometry}
            material={materials.BlackoutWindow}
          />
          <group position={[0, 0.65, 0]} scale={[0.01, 1, 0.01]}>
            <mesh
              geometry={nodes.Cylinder002.geometry}
              material={materials.DarkMetal}
            />
            <mesh
              geometry={nodes.Cylinder002_1.geometry}
              material={windowMaterial}
            />
          </group>
        </group>

        <group
          name="cursor"
          position={[1.71, 0.36, 0.36]}
          scale={[0.36, 0.65, 4.9]}
        >
          <mesh
            geometry={nodes.Plane002.geometry}
            material={materials["SceneBl;ack"]}
          />
          <mesh
            geometry={nodes.Plane002_1.geometry}
            material={materials["Rocks.001"]}
          />
        </group>

        <mesh
          name="cursor"
          geometry={nodes.CityBase002.geometry}
          material={materials.Metal}
          position={[3.89, 0.47, -3.45]}
          scale={[4.9, 0.65, 4.9]}
        />
      </group>
    </PresentationControls>
  );
}

useGLTF.preload("/models/isometric-cityscape13.glb");
