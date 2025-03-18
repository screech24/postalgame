import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Import shaders
import toonVertexShader from '../../../shaders/toon/toonVertex.glsl';
import toonFragmentShader from '../../../shaders/toon/toonFragment.glsl';

// Create a custom shader material
const ToonShaderMaterial = shaderMaterial(
  {
    baseColor: new THREE.Color(0xffffff),
    lightDirection: new THREE.Vector3(0.5, 1, 0.8),
    steps: 4.0,
    outlineThickness: 0.02,
  },
  toonVertexShader,
  toonFragmentShader
);

// Extend Three.js with our custom material
extend({ ToonShaderMaterial });

// ToonMaterial component
export const ToonMaterial = ({ color = '#ffffff', steps = 4, ...props }) => {
  // Convert color string to THREE.Color
  const threeColor = useMemo(() => {
    if (typeof color === 'string') {
      return new THREE.Color(color);
    }
    return color;
  }, [color]);
  
  // Create light direction dynamically to ensure proper lighting
  const lightDir = useMemo(() => {
    return new THREE.Vector3(0.5, 1, 0.8).normalize();
  }, []);
  
  return (
    <toonShaderMaterial 
      baseColor={threeColor} 
      steps={steps} 
      lightDirection={lightDir}
      transparent={true}
      side={THREE.DoubleSide}
      {...props} 
    />
  );
}; 