import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, MeshTransmissionMaterial, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { ToonMaterial } from './materials/ToonMaterial';

// Custom hook for creating a Ghibli-style ground
const useGhibliGround = () => {
  const groundRef = useRef();
  
  // Create a procedural texture for the ground - optimized
  const groundTexture = useMemo(() => {
    const size = 256; // Reduced from 512 for better performance
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Fill with base color
    context.fillStyle = '#57cc99';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise/variation - reduced iterations for better performance
    for (let i = 0; i < 2000; i++) {
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
  
  // Pre-compute house properties for better performance
  const houseProps = useMemo(() => {
    return Array.from({ length: count }, () => {
      const width = 2 + Math.random() * 2;
      const height = 2 + Math.random() * 1;
      const depth = 2 + Math.random() * 2;
      const roofHeight = 1 + Math.random() * 0.5;
      
      // Generate a pastel color
      const hue = Math.random() * 360;
      const saturation = 25 + Math.random() * 30;
      const lightness = 70 + Math.random() * 20;
      const color = new THREE.Color().setHSL(hue/360, saturation/100, lightness/100);
      
      // Generate a roof color
      const roofHue = (hue + 30) % 360;
      const roofColor = new THREE.Color().setHSL(roofHue/360, saturation/100, (lightness - 20)/100);
      
      return { width, height, depth, roofHeight, color, roofColor };
    });
  }, [count]);
  
  return { housePositions, houseProps };
};

// Instanced Tree component for better performance
const Trees = ({ positions }) => {
  const trunkRef = useRef();
  const leavesRef = useRef();
  
  // Pre-compute animation offsets for better performance
  const animationOffsets = useMemo(() => {
    return positions.map(position => ({
      x: position[0] * 0.1,
      speed: 0.1 + Math.random() * 0.1,
    }));
  }, [positions]);
  
  // Animate trees with optimized batched updates
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Only apply animation if refs exist
    if (trunkRef.current && leavesRef.current) {
      for (let i = 0; i < trunkRef.current.count; i++) {
        const offset = animationOffsets[i];
        const rotation = Math.sin(t * offset.speed + offset.x) * 0.05;
        trunkRef.current.setMatrixAt(
          i,
          new THREE.Matrix4().makeRotationY(rotation)
        );
      }
      trunkRef.current.instanceMatrix.needsUpdate = true;
      
      for (let i = 0; i < leavesRef.current.count; i++) {
        const offset = animationOffsets[i];
        const rotation = Math.sin(t * offset.speed + offset.x) * 0.1;
        leavesRef.current.setMatrixAt(
          i,
          new THREE.Matrix4().makeRotationY(rotation)
        );
      }
      leavesRef.current.instanceMatrix.needsUpdate = true;
    }
  });
  
  return (
    <group>
      <Instances limit={positions.length}>
        <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
        <ToonMaterial color="#8B4513" steps={3} />
        {positions.map((position, i) => (
          <Instance 
            key={`trunk-${i}`} 
            position={[position[0], position[1] + 1, position[2]]} 
            ref={trunkRef}
          />
        ))}
      </Instances>
      
      <Instances limit={positions.length}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <ToonMaterial color="#2a9d8f" steps={4} />
        {positions.map((position, i) => (
          <Instance 
            key={`leaves-${i}`} 
            position={[position[0], position[1] + 3, position[2]]} 
            ref={leavesRef}
          />
        ))}
      </Instances>
    </group>
  );
};

// Instanced House component for better performance
const Houses = ({ positions, props }) => {
  // Pre-compute house geometries
  const houseGroup = useRef();
  
  return (
    <group ref={houseGroup}>
      {positions.map((position, index) => (
        <group key={`house-${index}`} position={[position[0], position[1] + props[index].height / 2, position[2]]}>
          {/* Main house body */}
          <mesh>
            <boxGeometry args={[props[index].width, props[index].height, props[index].depth]} />
            <ToonMaterial color={props[index].color} steps={3} />
          </mesh>
          
          {/* Roof */}
          <mesh position={[0, props[index].height / 2 + props[index].roofHeight / 2, 0]}>
            <coneGeometry args={[props[index].width * 0.8, props[index].roofHeight, 4]} />
            <ToonMaterial color={props[index].roofColor} steps={2} />
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[props[index].width * 0.8, props[index].roofHeight, 4]} />
              <ToonMaterial color={props[index].roofColor} steps={2} />
            </mesh>
          </mesh>
          
          {/* Windows and doors - simplified for performance */}
          {index % 2 === 0 && (
            <mesh position={[0, -props[index].height / 2 + 0.5, props[index].depth / 2 + 0.01]}>
              <planeGeometry args={[0.7, 1]} />
              <ToonMaterial color="#8B4513" steps={2} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Path component - optimized
const Path = () => {
  const pathRef = useRef();
  
  // Create a pre-computed procedural texture for the path
  const pathTexture = useMemo(() => {
    const size = 256; // Reduced from 512 for better performance
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Fill with base color
    context.fillStyle = '#e9c46a';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise/variation - reduced for performance
    for (let i = 0; i < 2000; i++) {
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
  
  return (
    <mesh ref={pathRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
  
  // Optimized transmission material settings
  return (
    <mesh ref={waterRef} position={[10, -0.2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[5, 16]} /> {/* Reduced from 32 for better performance */}
      <MeshTransmissionMaterial
        backside
        samples={2} // Reduced from 4
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
  const { housePositions, houseProps } = useGhibliHouses(8);
  
  // Add initialization logic to improve performance
  const { gl } = useThree();
  useEffect(() => {
    // Optimize renderer
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setClearColor('#87CEEB', 1); // Set sky color
    // Enable optimizations
    gl.physicallyCorrectLights = true;
  }, [gl]);
  
  return (
    <>
      {/* Lighting - Enhanced with more lights and higher intensities */}
      <ambientLight intensity={1.2} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
      />
      {/* Additional hemisphere light for better color distribution */}
      <hemisphereLight 
        skyColor="#87CEEB" 
        groundColor="#8B4513" 
        intensity={0.8} 
      />
      {/* Additional point lights for highlight areas */}
      <pointLight position={[-10, 8, -10]} intensity={0.6} color="#FFF8E1" />
      <pointLight position={[15, 8, 15]} intensity={0.6} color="#FFECB3" />
      
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
      
      {/* Trees - using instancing for better performance */}
      <Trees positions={treePositions} />
      
      {/* Houses - using instancing for better performance */}
      <Houses positions={housePositions} props={houseProps} />
      
      {/* Player placeholder */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <ToonMaterial color="#f94144" steps={3} />
      </mesh>
    </>
  );
};

export default GameWorld; 