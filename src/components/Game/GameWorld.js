import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ToonMaterial } from './materials/ToonMaterial';

// Custom hook for creating a Ghibli-style ground
const useGhibliGround = () => {
  const groundRef = useRef();
  
  // Create a procedural texture for the ground
  const groundTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Fill with base color
    context.fillStyle = '#57cc99';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise/variation
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2 + 1;
      const hue = Math.random() * 10 + 140; // Green-ish
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${hue}, 70%, 80%, 0.3)`;
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    
    return texture;
  }, []);
  
  return { groundRef, groundTexture };
};

// Custom hook for creating Ghibli-style trees
const useGhibliTrees = (count = 20) => {
  // Generate random positions for trees
  const treePositions = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 40,
      0,
      (Math.random() - 0.5) * 40
    ]);
  }, [count]);
  
  return { treePositions };
};

// Custom hook for creating Ghibli-style houses
const useGhibliHouses = (count = 10) => {
  // Generate random positions for houses
  const housePositions = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    ]);
  }, [count]);
  
  return { housePositions };
};

// Tree component
const Tree = ({ position }) => {
  const trunkRef = useRef();
  const leavesRef = useRef();
  
  // Animate the tree slightly
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (trunkRef.current && leavesRef.current) {
      trunkRef.current.rotation.y = Math.sin(t * 0.1 + position[0]) * 0.05;
      leavesRef.current.rotation.y = Math.sin(t * 0.1 + position[0]) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <ToonMaterial color="#8B4513" steps={3} />
      </mesh>
      
      {/* Leaves */}
      <mesh ref={leavesRef} position={[0, 3, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <ToonMaterial color="#2a9d8f" steps={4} />
      </mesh>
    </group>
  );
};

// House component
const House = ({ position }) => {
  const houseRef = useRef();
  
  // Randomize house properties
  const houseProps = useMemo(() => {
    const width = 2 + Math.random() * 2;
    const height = 2 + Math.random() * 1;
    const depth = 2 + Math.random() * 2;
    const roofHeight = 1 + Math.random() * 0.5;
    
    // Generate a pastel color
    const hue = Math.random() * 360;
    const saturation = 25 + Math.random() * 30;
    const lightness = 70 + Math.random() * 20;
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Generate a roof color
    const roofHue = (hue + 30) % 360;
    const roofColor = `hsl(${roofHue}, ${saturation}%, ${lightness - 20}%)`;
    
    return { width, height, depth, roofHeight, color, roofColor };
  }, []);
  
  return (
    <group position={[position[0], position[1] + houseProps.height / 2, position[2]]}>
      {/* Main house body */}
      <mesh>
        <boxGeometry args={[houseProps.width, houseProps.height, houseProps.depth]} />
        <ToonMaterial color={houseProps.color} steps={3} />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, houseProps.height / 2 + houseProps.roofHeight / 2, 0]}>
        <coneGeometry args={[houseProps.width * 0.8, houseProps.roofHeight, 4]} />
        <ToonMaterial color={houseProps.roofColor} steps={2} />
        <mesh rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[houseProps.width * 0.8, houseProps.roofHeight, 4]} />
          <ToonMaterial color={houseProps.roofColor} steps={2} />
        </mesh>
      </mesh>
      
      {/* Door */}
      <mesh position={[0, -houseProps.height / 2 + 0.5, houseProps.depth / 2 + 0.01]}>
        <planeGeometry args={[0.7, 1]} />
        <ToonMaterial color="#8B4513" steps={2} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[houseProps.width / 3, 0, houseProps.depth / 2 + 0.01]}>
        <planeGeometry args={[0.5, 0.5]} />
        <ToonMaterial color="#87CEEB" steps={1} />
      </mesh>
      
      <mesh position={[-houseProps.width / 3, 0, houseProps.depth / 2 + 0.01]}>
        <planeGeometry args={[0.5, 0.5]} />
        <ToonMaterial color="#87CEEB" steps={1} />
      </mesh>
    </group>
  );
};

// Path component
const Path = () => {
  const pathRef = useRef();
  
  // Create a procedural texture for the path
  const pathTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Fill with base color
    context.fillStyle = '#e9c46a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise/variation
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2 + 1;
      const hue = Math.random() * 20 + 30; // Yellow-ish
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${hue}, 70%, 80%, 0.3)`;
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 10);
    
    return texture;
  }, []);
  
  // Create path points
  const pathData = useMemo(() => {
    const points = [];
    const curvePath = new THREE.CurvePath();
    
    // Create a winding path
    const startPoint = new THREE.Vector3(-15, 0.01, -15);
    points.push(startPoint);
    
    // Add some control points to create a winding path
    for (let i = 0; i < 5; i++) {
      const prevPoint = points[points.length - 1];
      const newPoint = new THREE.Vector3(
        prevPoint.x + (Math.random() - 0.3) * 10,
        0.01,
        prevPoint.z + (Math.random() - 0.3) * 10
      );
      points.push(newPoint);
    }
    
    // Create curves between points
    for (let i = 0; i < points.length - 1; i++) {
      const bezierCurve = new THREE.QuadraticBezierCurve3(
        points[i],
        new THREE.Vector3(
          (points[i].x + points[i + 1].x) / 2 + (Math.random() - 0.5) * 5,
          0.01,
          (points[i].z + points[i + 1].z) / 2 + (Math.random() - 0.5) * 5
        ),
        points[i + 1]
      );
      curvePath.add(bezierCurve);
    }
    
    // Note: Currently we're just rendering a simple plane for the path
    // In the future, this curve could be used to create a more complex path geometry
    // using something like THREE.TubeGeometry or by extruding a shape along the path
    
    return { points, curvePath };
  }, []);
  
  return (
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 40, 1, 1]} />
      <meshStandardMaterial 
        map={pathTexture} 
        transparent={true} 
        opacity={0.7} 
        roughness={0.8}
      />
    </mesh>
  );
};

// Water component
const Water = () => {
  const waterRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(t * 0.2) * 0.05 - 0.2;
    }
  });
  
  return (
    <mesh ref={waterRef} position={[10, -0.2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5, 32]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
        thickness={0.5}
        chromaticAberration={0.1}
        anisotropy={0.5}
        distortion={0.1}
        distortionScale={0.2}
        temporalDistortion={0.1}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[0, 1400]}
        color="#8ecae6"
      />
    </mesh>
  );
};

// Main GameWorld component
const GameWorld = () => {
  const { groundRef, groundTexture } = useGhibliGround();
  const { treePositions } = useGhibliTrees(15);
  const { housePositions } = useGhibliHouses(8);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
      />
      
      {/* Ground */}
      <mesh 
        ref={groundRef} 
        position={[0, -0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={groundTexture} 
          roughness={0.8} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Path */}
      <Path />
      
      {/* Water */}
      <Water />
      
      {/* Trees */}
      {treePositions.map((position, index) => (
        <Tree key={`tree-${index}`} position={position} />
      ))}
      
      {/* Houses */}
      {housePositions.map((position, index) => (
        <House key={`house-${index}`} position={position} />
      ))}
      
      {/* Player placeholder */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <ToonMaterial color="#f94144" steps={3} />
      </mesh>
    </>
  );
};

export default GameWorld; 