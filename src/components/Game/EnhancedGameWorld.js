import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, MeshTransmissionMaterial, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { ToonMaterial } from './materials/ToonMaterial';
import TerrainSystem from '../../utils/TerrainSystem';
import PathNetwork from '../../utils/PathNetwork';
import DistrictManager from '../../utils/DistrictManager';
import EnvironmentSystem from '../../utils/EnvironmentSystem';

// Enhanced GameWorld Component
const EnhancedGameWorld = () => {
  const terrainRef = useRef();
  const pathsRef = useRef();
  const treesRef = useRef();
  const rocksRef = useRef();
  const plantsRef = useRef();
  const decorationsRef = useRef();
  const waterRef = useRef();
  
  // Create the terrain system
  const terrainSystem = useMemo(() => {
    return new TerrainSystem({
      size: 100,
      resolution: 128,
      maxHeight: 5
    });
  }, []);
  
  // Create the district manager
  const districtManager = useMemo(() => {
    return new DistrictManager(terrainSystem, {
      districtCount: 4
    });
  }, [terrainSystem]);
  
  // Create the path network
  const pathNetwork = useMemo(() => {
    return new PathNetwork(terrainSystem, {
      pathWidth: 2.5,
      mainRoadWidth: 4
    });
  }, [terrainSystem]);
  
  // Create the environment system
  const environmentSystem = useMemo(() => {
    return new EnvironmentSystem(terrainSystem, districtManager, {
      treeDensity: 0.6,
      rockDensity: 0.3,
      plantDensity: 0.4,
      gridSize: 5
    });
  }, [terrainSystem, districtManager]);
  
  // Generate environment elements
  const environmentElements = useMemo(() => {
    return environmentSystem.generateEnvironment();
  }, [environmentSystem]);
  
  // Create terrain geometry
  const terrainGeometry = useMemo(() => {
    return terrainSystem.createTerrainGeometry();
  }, [terrainSystem]);
  
  // Create materials with different colors based on terrain type
  const terrainMaterials = useMemo(() => {
    return {
      grass: new THREE.MeshStandardMaterial({ 
        color: '#57cc99', 
        roughness: 0.8, 
        metalness: 0.1,
        flatShading: false 
      }),
      forest: new THREE.MeshStandardMaterial({ 
        color: '#2d6a4f', 
        roughness: 0.9, 
        metalness: 0.1,
        flatShading: false 
      }),
      mountain: new THREE.MeshStandardMaterial({ 
        color: '#6c757d', 
        roughness: 0.9, 
        metalness: 0.2,
        flatShading: true 
      }),
      snow: new THREE.MeshStandardMaterial({ 
        color: '#f8f9fa', 
        roughness: 0.3, 
        metalness: 0.1,
        flatShading: false 
      }),
      beach: new THREE.MeshStandardMaterial({ 
        color: '#e9c46a', 
        roughness: 0.9, 
        metalness: 0.1,
        flatShading: false 
      }),
      water: new MeshTransmissionMaterial({
        backside: true,
        samples: 4,
        thickness: 0.5,
        chromaticAberration: 0.1,
        anisotropy: 0.5,
        distortion: 0.1,
        distortionScale: 0.2,
        temporalDistortion: 0.1,
        iridescence: 1,
        iridescenceIOR: 1,
        iridescenceThicknessRange: [0, 1400],
        color: '#219ebc'
      })
    };
  }, []);
  
  // Create paths geometry
  const pathsGeometry = useMemo(() => {
    try {
      return pathNetwork.createPathsGeometry();
    } catch (err) {
      console.error("Failed to create paths geometry:", err);
      return new THREE.BufferGeometry();
    }
  }, [pathNetwork]);
  
  // Path material
  const pathMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e9c46a',
      roughness: 0.8,
      metalness: 0.1
    });
  }, []);
  
  // Render optimization for environment elements
  const [visibleRange, setVisibleRange] = useState(50);
  
  // Add initialization logic to improve performance
  const { gl, camera } = useThree();
  useEffect(() => {
    // Optimize renderer
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setClearColor('#87CEEB', 1); // Set sky color
    gl.physicallyCorrectLights = true;
    
    // Set up camera
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);
    
    // Set visible range based on performance
    const setVisibleRangeByPerformance = () => {
      // Default to medium range
      let range = 50;
      
      // Check if high-end device (proxied by high pixel ratio)
      if (window.devicePixelRatio > 1) {
        range = 70;
      } 
      // Low-end device
      else if (window.navigator.hardwareConcurrency <= 4) {
        range = 30;
      }
      
      setVisibleRange(range);
    };
    
    setVisibleRangeByPerformance();
  }, [gl, camera]);
  
  // Water animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Animate water
    if (waterRef.current) {
      waterRef.current.position.y = Math.sin(t * 0.2) * 0.05 - 0.2;
      waterRef.current.rotation.z = Math.sin(t * 0.05) * 0.02;
    }
  });
  
  return (
    <>
      {/* Enhanced lighting system */}
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
      
      {/* Terrain mesh */}
      <mesh 
        ref={terrainRef} 
        geometry={terrainGeometry} 
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#57cc99" 
          roughness={0.8} 
          metalness={0.1}
          flatShading={false}
        />
      </mesh>
      
      {/* Paths */}
      <mesh
        ref={pathsRef}
        geometry={pathsGeometry}
        material={pathMaterial}
        position={[0, 0.05, 0]} // Slightly above terrain to prevent z-fighting
        receiveShadow
      />
      
      {/* Water areas */}
      <mesh ref={waterRef} position={[10, -0.2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 16]} />
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
      
      {/* Trees */}
      <group ref={treesRef}>
        {environmentElements.trees
          .filter(tree => {
            // Only render trees within visible range from camera
            const distanceToCamera = new THREE.Vector2(
              tree.position.x - camera.position.x,
              tree.position.z - camera.position.z
            ).length();
            return distanceToCamera < visibleRange;
          })
          .map((tree, index) => (
            <group 
              key={`tree-${index}`} 
              position={tree.position}
            >
              {/* Trunk */}
              <mesh castShadow>
                <cylinderGeometry 
                  args={[tree.trunkRadius, tree.trunkRadius * 1.2, tree.trunkHeight, 8]} 
                />
                <ToonMaterial color={tree.trunkColor} steps={3} />
              </mesh>
              
              {/* Leaves - different shape based on tree type */}
              <mesh 
                position={[0, tree.trunkHeight, 0]} 
                castShadow
              >
                {tree.shape === 'cone' ? (
                  <coneGeometry args={[tree.leavesRadius, tree.leavesRadius * 2, 8]} />
                ) : (
                  <sphereGeometry args={[tree.leavesRadius, 8, 8]} />
                )}
                <ToonMaterial color={tree.leavesColor} steps={4} />
              </mesh>
            </group>
          ))
        }
      </group>
      
      {/* Rocks */}
      <group ref={rocksRef}>
        {environmentElements.rocks
          .filter(rock => {
            // Only render rocks within visible range from camera
            const distanceToCamera = new THREE.Vector2(
              rock.position.x - camera.position.x,
              rock.position.z - camera.position.z
            ).length();
            return distanceToCamera < visibleRange * 0.7; // Rocks have shorter render distance
          })
          .map((rock, index) => {
            // Use different geometry based on rock shape
            const geometry = rock.shape === 'angular' ? 
              <dodecahedronGeometry args={[rock.size, 0]} /> : 
              <sphereGeometry args={[rock.size, 6, 6]} />;
              
            return (
              <mesh 
                key={`rock-${index}`} 
                position={rock.position}
                rotation={rock.rotation}
                castShadow
              >
                {geometry}
                <ToonMaterial color={rock.color} steps={3} />
              </mesh>
            );
          })
        }
      </group>
      
      {/* Plants & decorations - only show when close to camera */}
      <group ref={plantsRef}>
        {environmentElements.plants
          .filter(plant => {
            const distanceToCamera = new THREE.Vector2(
              plant.position.x - camera.position.x,
              plant.position.z - camera.position.z
            ).length();
            return distanceToCamera < visibleRange * 0.5; // Plants have shorter render distance
          })
          .map((plant, index) => {
            // Different representation based on plant type
            let plantMesh;
            
            switch (plant.shape) {
              case 'flower':
                plantMesh = (
                  <group position={plant.position} rotation={[0, plant.rotation.y, 0]}>
                    <mesh>
                      <cylinderGeometry args={[0.02, 0.02, plant.size, 4]} />
                      <ToonMaterial color="#228B22" steps={3} />
                    </mesh>
                    <mesh position={[0, plant.size, 0]}>
                      <sphereGeometry args={[plant.size * 0.2, 6, 6]} />
                      <ToonMaterial color={plant.color} steps={4} />
                    </mesh>
                  </group>
                );
                break;
                
              case 'bush':
                plantMesh = (
                  <mesh position={plant.position}>
                    <sphereGeometry args={[plant.size, 6, 6]} />
                    <ToonMaterial color={plant.color} steps={3} />
                  </mesh>
                );
                break;
                
              case 'grass':
              default:
                plantMesh = (
                  <mesh position={plant.position} rotation={[0, plant.rotation.y, 0]}>
                    <boxGeometry args={[plant.size * 0.2, plant.size, plant.size * 0.2]} />
                    <ToonMaterial color={plant.color} steps={3} />
                  </mesh>
                );
                break;
            }
            
            return <React.Fragment key={`plant-${index}`}>{plantMesh}</React.Fragment>;
          })
        }
      </group>
      
      {/* Decorations */}
      <group ref={decorationsRef}>
        {environmentElements.decorations
          .filter(decoration => {
            const distanceToCamera = new THREE.Vector2(
              decoration.position.x - camera.position.x,
              decoration.position.z - camera.position.z
            ).length();
            return distanceToCamera < visibleRange * 0.6; // Decorations have shorter render distance
          })
          .map((decoration, index) => {
            // Different representation based on decoration type
            let decorationMesh;
            
            switch (decoration.type) {
              case 'mailbox':
                decorationMesh = (
                  <group position={decoration.position} rotation={[0, decoration.rotation.y, 0]}>
                    <mesh position={[0, 0.4, 0]}>
                      <boxGeometry args={[0.1, 0.8, 0.1]} />
                      <ToonMaterial color="#8B4513" steps={3} />
                    </mesh>
                    <mesh position={[0, 0.9, 0]}>
                      <boxGeometry args={[0.3, 0.2, 0.2]} />
                      <ToonMaterial color={decoration.color} steps={3} />
                    </mesh>
                  </group>
                );
                break;
                
              case 'bench':
                decorationMesh = (
                  <group position={decoration.position} rotation={[0, decoration.rotation.y, 0]}>
                    <mesh position={[0, 0.2, 0]}>
                      <boxGeometry args={[1, 0.1, 0.4]} />
                      <ToonMaterial color={decoration.color} steps={3} />
                    </mesh>
                  </group>
                );
                break;
                
              default:
                decorationMesh = (
                  <mesh 
                    position={decoration.position} 
                    rotation={[0, decoration.rotation.y, 0]}
                  >
                    <boxGeometry args={[decoration.size, decoration.size, decoration.size]} />
                    <ToonMaterial color={decoration.color} steps={3} />
                  </mesh>
                );
                break;
            }
            
            return <React.Fragment key={`decoration-${index}`}>{decorationMesh}</React.Fragment>;
          })
        }
      </group>
      
      {/* Player placeholder */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <ToonMaterial color="#f94144" steps={3} />
      </mesh>
    </>
  );
};

export default EnhancedGameWorld; 