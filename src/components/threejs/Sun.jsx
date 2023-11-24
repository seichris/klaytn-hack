// Sun.jsx
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Sun() {
  const { scene } = useThree();

  useEffect(() => {
    // Create a sphere geometry for the sun
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    // Create a basic material with emissive color for the sun
    const material = new THREE.MeshBasicMaterial({ color: 0xffcc00, emissive: 0xffcc00 });
    // Create the sun mesh
    const sunMesh = new THREE.Mesh(geometry, material);
    // Set the position of the sun
    sunMesh.position.set(-0.1, 6, 10);
    // Add the sun to the scene
    scene.add(sunMesh);

    // Cleanup: remove the sun from the scene when the component unmounts
    return () => {
      scene.remove(sunMesh);
      geometry.dispose();
      material.dispose();
    };
  }, [scene]);

  return null; // This component does not render anything itself
}

export default Sun;
